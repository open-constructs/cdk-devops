import { GitInfo } from './git-info';
import { IVersioningStrategy } from './types';
import { VersionInfo, VersionInfoBuilder } from './version-info';

/**
 * Context for version computation
 */
export interface ComputationContext {
  /**
   * Git information
   */
  readonly gitInfo: GitInfo;

  /**
   * Package version from package.json
   */
  readonly packageVersion?: string;

  /**
   * Environment/stage name
   */
  readonly environment: string;

  /**
   * Repository URL
   */
  readonly repositoryUrl?: string;

  /**
   * Build number
   */
  readonly buildNumber?: string;

  /**
   * Pipeline version/execution ID
   */
  readonly pipelineVersion?: string;

  /**
   * Deployment timestamp
   */
  readonly deploymentTime?: string;
}

/**
 * Abstract base class for version computation strategies
 */
export abstract class VersionComputationStrategy {
  /**
   * Compute version string from context
   */
  public abstract compute(context: ComputationContext): string;

  /**
   * Create VersionInfo from computation result
   */
  protected createVersionInfo(version: string, context: ComputationContext): VersionInfo {
    return new VersionInfoBuilder()
      .withVersion(version)
      .withGitInfo(context.gitInfo)
      .withPackageVersion(context.packageVersion)
      .withEnvironment(context.environment)
      .withRepositoryUrl(context.repositoryUrl)
      .withBuildNumber(context.buildNumber)
      .withPipelineVersion(context.pipelineVersion)
      .withDeploymentTime(context.deploymentTime)
      .buildVersionInfo();
  }
}

/**
 * Composite computation strategy that replaces template variables
 */
export class CompositeComputation extends VersionComputationStrategy {
  constructor(private readonly strategy: IVersioningStrategy) {
    super();
  }

  /**
   * Compute version by replacing template variables in format string
   */
  public compute(context: ComputationContext): string {
    let version = this.strategy.format;

    // Replace git tag
    version = this.replaceGitTag(version, context);

    // Replace package version
    version = this.replacePackageVersion(version, context);

    // Replace commit count
    version = this.replaceCommitCount(version, context);

    // Replace commit hash
    version = this.replaceCommitHash(version, context);

    // Replace branch
    version = this.replaceBranch(version, context);

    // Replace build number
    version = this.replaceBuildNumber(version, context);

    return version;
  }

  /**
   * Replace {git-tag} placeholder
   */
  private replaceGitTag(format: string, context: ComputationContext): string {
    if (!format.includes('{git-tag}')) {
      return format;
    }

    const config = this.strategy.components.gitTag;
    let tag = context.gitInfo.tag;

    if (tag && config?.prefix) {
      // Strip prefix if configured
      if (tag.startsWith(config.prefix)) {
        tag = tag.substring(config.prefix.length);
      }
    }

    // If no tag and we're counting commits since tag, create dev version
    if (!tag && config?.countCommitsSince && context.gitInfo.commitsSinceTag !== undefined) {
      const commitCount = this.strategy.components.commitCount;
      const padding = commitCount?.padding ?? 0;
      const count = context.gitInfo.commitsSinceTag.toString().padStart(padding, '0');
      return format.replace(/{git-tag}/g, `dev.${count}`);
    }

    return format.replace(/{git-tag}/g, tag || 'dev');
  }

  /**
   * Replace {package-version} placeholder
   */
  private replacePackageVersion(format: string, context: ComputationContext): string {
    if (!format.includes('{package-version}')) {
      return format;
    }

    const version = context.packageVersion || '0.0.0';
    return format.replace(/{package-version}/g, version);
  }

  /**
   * Replace {commit-count} placeholder with optional padding
   */
  private replaceCommitCount(format: string, context: ComputationContext): string {
    // Match {commit-count} or {commit-count:5}
    const pattern = /{commit-count(?::(\d+))?}/g;
    const matches = Array.from(format.matchAll(pattern));

    if (matches.length === 0) {
      return format;
    }

    let result = format;
    const config = this.strategy.components.commitCount;

    for (const match of matches) {
      const paddingStr = match[1];
      const padding = paddingStr ? parseInt(paddingStr, 10) : (config?.padding ?? 0);

      let count: number;
      if (config?.mode === 'since-tag' && context.gitInfo.commitsSinceTag !== undefined) {
        count = context.gitInfo.commitsSinceTag;
      } else {
        count = context.gitInfo.commitCount;
      }

      const formattedCount = count.toString().padStart(padding, '0');
      result = result.replace(match[0], formattedCount);
    }

    return result;
  }

  /**
   * Replace {commit-hash} placeholder with optional length
   */
  private replaceCommitHash(format: string, context: ComputationContext): string {
    // Match {commit-hash} or {commit-hash:8}
    const pattern = /{commit-hash(?::(\d+))?}/g;
    const matches = Array.from(format.matchAll(pattern));

    if (matches.length === 0) {
      return format;
    }

    let result = format;
    for (const match of matches) {
      const lengthStr = match[1];
      const length = lengthStr ? parseInt(lengthStr, 10) : 8;
      const hash = context.gitInfo.commitHash.substring(0, length);
      result = result.replace(match[0], hash);
    }

    return result;
  }

  /**
   * Replace {branch} placeholder
   */
  private replaceBranch(format: string, context: ComputationContext): string {
    if (!format.includes('{branch}')) {
      return format;
    }

    // Sanitize branch name for use in versions
    const branch = context.gitInfo.branch
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '');

    return format.replace(/{branch}/g, branch);
  }

  /**
   * Replace {build-number} placeholder
   */
  private replaceBuildNumber(format: string, context: ComputationContext): string {
    if (!format.includes('{build-number}')) {
      return format;
    }

    const buildNumber = context.buildNumber || '0';
    return format.replace(/{build-number}/g, buildNumber);
  }
}

/**
 * Main version computer class
 */
export class VersionComputer {
  private readonly computation: CompositeComputation;

  constructor(strategy: IVersioningStrategy) {
    this.computation = new CompositeComputation(strategy);
  }

  /**
   * Compute version from context
   */
  public compute(context: ComputationContext): VersionInfo {
    const version = this.computation.compute(context);
    return new VersionInfoBuilder()
      .withVersion(version)
      .withGitInfo(context.gitInfo)
      .withPackageVersion(context.packageVersion)
      .withEnvironment(context.environment)
      .withRepositoryUrl(context.repositoryUrl)
      .withBuildNumber(context.buildNumber)
      .withPipelineVersion(context.pipelineVersion)
      .withDeploymentTime(context.deploymentTime)
      .buildVersionInfo();
  }

  /**
   * Compute version string only (without creating VersionInfo)
   */
  public computeVersionString(context: ComputationContext): string {
    return this.computation.compute(context);
  }
}
