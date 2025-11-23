#!/usr/bin/env node
import * as cp from 'child_process';
import * as fs from 'fs';
import { VersionComputer } from './computation';
import { GitInfo } from './git-info';
import { VersioningStrategy } from './strategy';

/**
 * Compute version information and write to file
 */
export async function computeVersion(strategyConfig: { format: string; components: any }): Promise<void> {
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
    const strategy = VersioningStrategy.create(strategyConfig.format, strategyConfig.components);
    const computer = new VersionComputer(strategy);
    const versionInfo = computer.compute(context);

    fs.writeFileSync('~version.json', versionInfo.toJson());
    console.log('Version computed:', versionInfo.version, '(commit:', versionInfo.shortCommitHash + ')');
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
    fs.writeFileSync('~version.json', JSON.stringify(fallback, null, 2));
  }
}

// CLI entry point
if (require.main === module) {
  const strategyConfig = JSON.parse(process.argv[2] || '{"format":"{commit-count}","components":{}}');
  computeVersion(strategyConfig).catch(console.error);
}
