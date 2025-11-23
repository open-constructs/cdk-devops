import { GitInfo, GitInfoHelper } from './git-info';
import { IVersionInfo } from './types';

/**
 * Props for creating VersionInfo
 */
export interface VersionInfoProps {
  /**
   * Computed version string
   */
  readonly version: string;

  /**
   * Git information
   */
  readonly gitInfo: GitInfo;

  /**
   * Package version from package.json
   */
  readonly packageVersion?: string;

  /**
   * Deployment timestamp
   */
  readonly deploymentTime?: string;

  /**
   * Deployment username
   */
  readonly deploymentUser?: string;

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
}

/**
 * Version information for deployments
 */
export class VersionInfo implements IVersionInfo {
  /**
   * Create VersionInfo from props
   */
  public static create(props: VersionInfoProps): VersionInfo {
    return new VersionInfo(props);
  }

  /**
   * Create VersionInfo from environment variables
   */
  public static fromEnvironment(version: string, environment: string): VersionInfo {
    const gitInfo = GitInfoHelper.fromEnvironment();

    return new VersionInfo({
      version,
      gitInfo,
      environment,
      packageVersion: process.env.PACKAGE_VERSION,
      deploymentTime: process.env.DEPLOYMENT_TIME || new Date().toISOString(),
      deploymentUser: process.env.GITHUB_ACTOR || process.env.GITLAB_USER_LOGIN || process.env.USER || 'unknown',
      repositoryUrl: process.env.REPOSITORY_URL || process.env.GITHUB_REPOSITORY
        ? `https://github.com/${process.env.GITHUB_REPOSITORY}`
        : undefined,
      buildNumber: process.env.BUILD_NUMBER || process.env.GITHUB_RUN_NUMBER,
      pipelineVersion: process.env.PIPELINE_VERSION || process.env.CODEBUILD_BUILD_ID,
    });
  }

  /**
   * Create VersionInfo from JSON string
   */
  public static fromJson(json: string): VersionInfo {
    const data = JSON.parse(json);
    return new VersionInfo({
      version: data.version,
      gitInfo: {
        commitHash: data.commitHash,
        shortCommitHash: data.shortCommitHash,
        branch: data.branch,
        tag: data.tag,
        commitCount: data.commitCount,
      },
      packageVersion: data.packageVersion,
      deploymentTime: data.deploymentTime,
      deploymentUser: data.deploymentUser,
      environment: data.environment,
      repositoryUrl: data.repositoryUrl,
      buildNumber: data.buildNumber,
      pipelineVersion: data.pipelineVersion,
    });
  }

  /**
   * Compare two version infos
   */
  public static compare(a: VersionInfo, b: VersionInfo): number {
    // First compare by commit count
    if (a.commitCount !== b.commitCount) {
      return a.commitCount - b.commitCount;
    }

    // Then by version string
    return a.version.localeCompare(b.version);
  }

  public readonly version: string;
  public readonly commitHash: string;
  public readonly shortCommitHash: string;
  public readonly branch: string;
  public readonly tag?: string;
  public readonly commitCount: number;
  public readonly packageVersion?: string;
  public readonly deploymentTime: string;
  public readonly deploymentUser: string;
  public readonly environment: string;
  public readonly repositoryUrl?: string;
  public readonly buildNumber?: string;
  public readonly pipelineVersion?: string;

  private constructor(props: VersionInfoProps) {
    this.version = props.version;
    this.commitHash = props.gitInfo.commitHash;
    this.shortCommitHash = props.gitInfo.shortCommitHash;
    this.branch = props.gitInfo.branch;
    this.tag = props.gitInfo.tag;
    this.commitCount = props.gitInfo.commitCount;
    this.packageVersion = props.packageVersion;
    this.deploymentTime = props.deploymentTime || new Date().toISOString();
    this.deploymentUser = props.deploymentUser || 'unknown';
    this.environment = props.environment;
    this.repositoryUrl = props.repositoryUrl;
    this.buildNumber = props.buildNumber;
    this.pipelineVersion = props.pipelineVersion;
  }

  /**
   * Get display version (prefers tag if available)
   */
  public displayVersion(): string {
    return this.tag || this.version;
  }

  /**
   * Check if this is a tagged release
   */
  public isTaggedRelease(): boolean {
    return this.tag !== undefined;
  }

  /**
   * Check if deployed from main branch
   */
  public isMainBranch(): boolean {
    return GitInfoHelper.isMainBranch(this.branch);
  }

  /**
   * Convert to JSON string
   */
  public toJson(): string {
    return JSON.stringify(this, null, 2);
  }

  /**
   * Convert to plain object
   */
  public toObject(): IVersionInfo {
    return {
      version: this.version,
      commitHash: this.commitHash,
      shortCommitHash: this.shortCommitHash,
      branch: this.branch,
      tag: this.tag,
      commitCount: this.commitCount,
      packageVersion: this.packageVersion,
      deploymentTime: this.deploymentTime,
      deploymentUser: this.deploymentUser,
      environment: this.environment,
      repositoryUrl: this.repositoryUrl,
      buildNumber: this.buildNumber,
      pipelineVersion: this.pipelineVersion,
    };
  }

  /**
   * Get SSM parameter name from template
   */
  public parameterName(template: string): string {
    return this.substituteTemplate(template);
  }

  /**
   * Get export name from template
   */
  public exportName(template: string): string {
    return this.substituteTemplate(template);
  }

  /**
   * Substitute template variables
   */
  private substituteTemplate(template: string): string {
    return template
      .replace(/{version}/g, this.version)
      .replace(/{environment}/g, this.environment)
      .replace(/{branch}/g, this.branch)
      .replace(/{commit-hash}/g, this.shortCommitHash)
      .replace(/{tag}/g, this.tag || '')
      .replace(/{commit-count}/g, this.commitCount.toString());
  }
}

/**
 * Builder for VersionInfo
 */
export class VersionInfoBuilder {
  private version?: string;
  private gitInfo?: GitInfo;
  private packageVersion?: string;
  private deploymentTime?: string;
  private deploymentUser?: string;
  private environment?: string;
  private repositoryUrl?: string;
  private buildNumber?: string;
  private pipelineVersion?: string;

  /**
   * Set version string
   */
  public withVersion(version: string): this {
    this.version = version;
    return this;
  }

  /**
   * Set git information
   */
  public withGitInfo(gitInfo: GitInfo): this {
    this.gitInfo = gitInfo;
    return this;
  }

  /**
   * Set package version
   */
  public withPackageVersion(packageVersion?: string): this {
    this.packageVersion = packageVersion;
    return this;
  }

  /**
   * Set deployment time
   */
  public withDeploymentTime(deploymentTime?: string): this {
    this.deploymentTime = deploymentTime;
    return this;
  }

  /**
   * Set deployment username
   */
  public withDeploymentUser(deploymentUser?: string): this {
    this.deploymentUser = deploymentUser;
    return this;
  }

  /**
   * Set environment
   */
  public withEnvironment(environment: string): this {
    this.environment = environment;
    return this;
  }

  /**
   * Set repository URL
   */
  public withRepositoryUrl(repositoryUrl?: string): this {
    this.repositoryUrl = repositoryUrl;
    return this;
  }

  /**
   * Set build number
   */
  public withBuildNumber(buildNumber?: string): this {
    this.buildNumber = buildNumber;
    return this;
  }

  /**
   * Set pipeline version
   */
  public withPipelineVersion(pipelineVersion?: string): this {
    this.pipelineVersion = pipelineVersion;
    return this;
  }

  /**
   * Build the VersionInfo instance
   */
  public buildVersionInfo(): VersionInfo {
    if (!this.version) {
      throw new Error('Version is required');
    }
    if (!this.gitInfo) {
      throw new Error('GitInfo is required');
    }
    if (!this.environment) {
      throw new Error('Environment is required');
    }

    return VersionInfo.create({
      version: this.version,
      gitInfo: this.gitInfo,
      packageVersion: this.packageVersion,
      deploymentTime: this.deploymentTime,
      deploymentUser: this.deploymentUser,
      environment: this.environment,
      repositoryUrl: this.repositoryUrl,
      buildNumber: this.buildNumber,
      pipelineVersion: this.pipelineVersion,
    });
  }
}
