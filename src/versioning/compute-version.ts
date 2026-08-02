#!/usr/bin/env node
import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { VersionComputer } from './computation';
import { GitInfo } from './git-info';
import { DEFAULT_VERSION_OUTPUT_PATH, LEGACY_VERSION_OUTPUT_PATH, shellSafePath, validateOutputPath } from './output-path';
import { VersioningStrategy } from './strategy';

/**
 * Options for the compute-version CLI
 */
export interface ComputeVersionOptions {
  /**
   * Strategy configuration with format string and components
   */
  readonly strategyConfig: { format: string; components: any };

  /**
   * Output file path for the version JSON artifact.
   * @default '.tmp/version.json'
   */
  readonly outputPath?: string;
}

/**
 * Resolve the output path from CLI args, environment, or default.
 */
function resolveOutputPath(cliOutput: string | undefined): string {
  const outputPath = cliOutput || process.env.VERSION_OUTPUT_PATH || DEFAULT_VERSION_OUTPUT_PATH;
  validateOutputPath(outputPath);
  return outputPath;
}

/**
 * Ensure the parent directory of a file path exists.
 */
function ensureDirectory(filePath: string): void {
  const dir = path.dirname(filePath);
  if (dir && dir !== '.' && !fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Compute version information and write to file
 *
 * @param options - Configuration options
 */
export async function computeVersion(options: ComputeVersionOptions): Promise<void> {
  const outputPath = resolveOutputPath(options.outputPath);

  try {
    // Gather git information
    const commitHash = cp.execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    const commitHashShort = commitHash.substring(0, 8);
    const commitCount = parseInt(cp.execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim());
    const branch = cp.execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();

    let tag = '';
    let commitsSinceTag = 0;
    try {
      tag = cp.execSync('git describe --tags --exact-match 2>/dev/null', { encoding: 'utf8' }).trim();
    } catch {
      try {
        const describeOutput = cp.execSync('git describe --tags --long 2>/dev/null', { encoding: 'utf8' }).trim();
        const match = describeOutput.match(/^(.+)-(\d+)-g[0-9a-f]+$/);
        if (match) {
          tag = match[1];
          commitsSinceTag = parseInt(match[2]);
        }
      } catch { /* no tags */ }
    }

    let packageVersion = '0.0.0';
    try {
      packageVersion = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
    } catch { /* no package.json */ }

    // Create git info
    const gitInfo: GitInfo = {
      commitHash,
      shortCommitHash: commitHashShort,
      branch,
      tag: tag || undefined,
      commitCount,
      commitsSinceTag: commitsSinceTag || undefined,
    };

    // Create computation context
    const context = {
      gitInfo,
      packageVersion,
      environment: process.env.STAGE || process.env.ENVIRONMENT || 'unknown',
      repositoryUrl: process.env.GITHUB_REPOSITORY
        ? `https://github.com/${process.env.GITHUB_REPOSITORY}`
        : process.env.CI_PROJECT_PATH,
      buildNumber: process.env.BUILD_NUMBER || process.env.GITHUB_RUN_NUMBER,
      pipelineVersion: process.env.PIPELINE_VERSION,
      deploymentTime: new Date().toISOString(),
    };

    // Create strategy and compute version
    const strategy = VersioningStrategy.create(options.strategyConfig.format, options.strategyConfig.components);
    const computer = new VersionComputer(strategy);
    const versionInfo = computer.compute(context);

    ensureDirectory(outputPath);
    fs.writeFileSync(outputPath, versionInfo.toJson());
    console.log(`Version computed: ${versionInfo.version} (commit: ${versionInfo.shortCommitHash})`);
    console.log(`Written to: ${shellSafePath(outputPath)}`);
  } catch (error: any) {
    console.error('Error computing version:', error.message);
    const fallback = {
      version: '0.0.0',
      commitHash: 'unknown',
      shortCommitHash: 'unknown',
      branch: 'unknown',
      commitCount: 0,
      packageVersion: '0.0.0',
      deploymentTime: new Date().toISOString(),
      deploymentUser: 'unknown',
      environment: 'unknown',
    };
    ensureDirectory(outputPath);
    fs.writeFileSync(outputPath, JSON.stringify(fallback, null, 2));
  }
}

/**
 * Read version information from the output file.
 *
 * Checks the configured path first, then falls back to the legacy
 * `~version.json` path with a deprecation warning.
 *
 * @param outputPath - Primary path to read from
 * @returns The file contents as a string, or undefined if not found
 */
export function readVersionFile(outputPath?: string): string | undefined {
  const primary = outputPath || DEFAULT_VERSION_OUTPUT_PATH;

  if (fs.existsSync(primary)) {
    return fs.readFileSync(primary, 'utf8');
  }

  // Backwards-compat fallback: read from legacy path with deprecation warning
  if (fs.existsSync(LEGACY_VERSION_OUTPUT_PATH)) {
    console.warn(
      `[DEPRECATED] Reading version from "${LEGACY_VERSION_OUTPUT_PATH}". ` +
      'This fallback will be removed in the next minor version. ' +
      `Please update your workflow to use "${shellSafePath(DEFAULT_VERSION_OUTPUT_PATH)}" instead.`,
    );
    return fs.readFileSync(LEGACY_VERSION_OUTPUT_PATH, 'utf8');
  }

  return undefined;
}

/**
 * Parse CLI arguments.
 *
 * Supports:
 *   compute-version [strategyJson]
 *   compute-version --output <path> [strategyJson]
 */
function parseCLIArgs(argv: string[]): { strategyConfig: string; outputPath?: string } {
  const args = argv.slice(2);
  let outputPath: string | undefined;
  let strategyConfig = '{"format":"{commit-count}","components":{}}';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' || args[i] === '-o') {
      outputPath = args[++i];
    } else if (!args[i].startsWith('-')) {
      strategyConfig = args[i];
    }
  }

  return { strategyConfig, outputPath };
}

// CLI entry point
if (require.main === module) {
  const { strategyConfig, outputPath } = parseCLIArgs(process.argv);
  computeVersion({
    strategyConfig: JSON.parse(strategyConfig),
    outputPath,
  }).catch(console.error);
}
