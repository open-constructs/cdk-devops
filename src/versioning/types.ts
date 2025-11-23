/**
 * Git tag configuration for version extraction
 */
export interface GitTagConfig {
  /**
   * Prefix to strip from git tags (e.g., 'v' for tags like 'v1.2.3')
   * @default 'v'
   */
  readonly prefix?: string;

  /**
   * Pattern to match git tags
   * @default '*.*.*'
   */
  readonly pattern?: string;

  /**
   * Whether to count commits since the last tag
   * @default true
   */
  readonly countCommitsSince?: boolean;
}

/**
 * Package.json version configuration
 */
export interface PackageJsonConfig {
  /**
   * Whether to include prerelease identifiers
   * @default true
   */
  readonly includePrerelease?: boolean;
}

/**
 * Commit count configuration
 */
export interface CommitCountConfig {
  /**
   * Commit counting mode
   * - 'all': Count all commits
   * - 'branch': Count commits on current branch
   * - 'since-tag': Count commits since last tag
   * @default 'all'
   */
  readonly mode?: 'all' | 'branch' | 'since-tag';

  /**
   * Padding for commit count (e.g., 5 means '00042')
   * @default 0
   */
  readonly padding?: number;
}

/**
 * Build number configuration
 */
export interface BuildNumberConfig {
  /**
   * Environment variable to read build number from
   * @default 'BUILD_NUMBER'
   */
  readonly envVar?: string;
}

/**
 * Components that can be included in a versioning strategy
 */
export interface VersioningStrategyComponents {
  /**
   * Git tag configuration
   */
  readonly gitTag?: GitTagConfig;

  /**
   * Package.json version configuration
   */
  readonly packageJson?: PackageJsonConfig;

  /**
   * Commit count configuration
   */
  readonly commitCount?: CommitCountConfig;

  /**
   * Build number configuration
   */
  readonly buildNumber?: BuildNumberConfig;
}

/**
 * Versioning strategy interface
 */
export interface IVersioningStrategy {
  /**
   * Format string for version computation
   * Supports placeholders: {git-tag}, {package-version}, {commit-count}, {commit-hash}, {branch}, {build-number}
   */
  readonly format: string;

  /**
   * Strategy components configuration
   */
  readonly components: VersioningStrategyComponents;
}

/**
 * CloudFormation output configuration
 */
export interface CloudFormationOutputConfig {
  /**
   * Whether to create CloudFormation outputs
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * Whether to export the outputs for cross-stack references
   * @default false
   */
  readonly export?: boolean;

  /**
   * Export name template (supports {version}, {environment}, etc.)
   */
  readonly exportNameTemplate?: string;
}

/**
 * SSM Parameter Store output configuration
 */
export interface ParameterStoreOutputConfig {
  /**
   * Whether to create SSM parameters
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * Base path for parameters (e.g., '/myapp/version')
   */
  readonly basePath?: string;

  /**
   * Whether to split version info into separate parameters
   * @default false
   */
  readonly splitParameters?: boolean;

  /**
   * Description for the parameter
   */
  readonly description?: string;
}

/**
 * Output configuration for version information
 */
export interface VersioningOutputsConfig {
  /**
   * CloudFormation output configuration
   */
  readonly cloudFormation?: CloudFormationOutputConfig;

  /**
   * SSM Parameter Store configuration
   */
  readonly parameterStore?: ParameterStoreOutputConfig;
}

/**
 * Version information interface
 */
export interface IVersionInfo {
  /**
   * Computed version string
   */
  readonly version: string;

  /**
   * Git commit hash
   */
  readonly commitHash: string;

  /**
   * Git commit hash (short form, typically 8 characters)
   */
  readonly shortCommitHash: string;

  /**
   * Git branch name
   */
  readonly branch: string;

  /**
   * Git tag (if available)
   */
  readonly tag?: string;

  /**
   * Total commit count
   */
  readonly commitCount: number;

  /**
   * Package version from package.json (if available)
   */
  readonly packageVersion?: string;

  /**
   * Deployment timestamp
   */
  readonly deploymentTime: string;

  /**
   * Deployment username
   */
  readonly deploymentUser: string;

  /**
   * Environment/stage name
   */
  readonly environment: string;

  /**
   * Repository URL
   */
  readonly repositoryUrl?: string;

  /**
   * Build number (if available)
   */
  readonly buildNumber?: string;

  /**
   * Pipeline version/execution ID
   */
  readonly pipelineVersion?: string;
}

/**
 * Versioning configuration
 */
export interface VersioningConfig {
  /**
   * Whether versioning is enabled
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * Versioning strategy
   */
  readonly strategy: IVersioningStrategy;

  /**
   * Output configuration
   */
  readonly outputs: VersioningOutputsConfig;
}
