/**
 * CI/CD provider type
 */
export enum CiProvider {
  GITHUB = 'github',
  GITLAB = 'gitlab',
  CODEBUILD = 'codebuild',
  UNKNOWN = 'unknown',
}

/**
 * Repository information
 */
export interface RepoInfo {
  /**
   * CI/CD provider (github/gitlab/codebuild)
   */
  readonly provider: CiProvider;

  /**
   * Repository owner/organization
   */
  readonly owner?: string;

  /**
   * Repository name
   */
  readonly repository: string;

  /**
   * Branch name
   */
  readonly branch: string;

  /**
   * Commit hash
   */
  readonly commitHash: string;
}

/**
 * Pipeline execution information
 */
export interface PipelineInfo {
  /**
   * CI/CD provider
   */
  readonly provider: CiProvider;

  /**
   * Job/build ID
   */
  readonly jobId?: string;

  /**
   * Job/build URL
   */
  readonly jobUrl?: string;

  /**
   * User who triggered the job
   */
  readonly triggeredBy?: string;

  /**
   * Workflow/pipeline name
   */
  readonly workflowName?: string;

  /**
   * Run number
   */
  readonly runNumber?: string;

  /**
   * Run attempt (for retries)
   */
  readonly runAttempt?: string;

  /**
   * Event that triggered the workflow
   */
  readonly event?: string;

  /**
   * Additional provider-specific information
   */
  readonly additionalInfo?: Record<string, string>;
}

/**
 * Custom environment variable names for overriding defaults
 */
export interface CustomEnvVarConfig {
  /**
   * Custom environment variable for repository owner
   */
  readonly repoOwner?: string;

  /**
   * Custom environment variable for repository name
   */
  readonly repoName?: string;

  /**
   * Custom environment variable for branch name
   */
  readonly branch?: string;

  /**
   * Custom environment variable for commit hash
   */
  readonly commitHash?: string;

  /**
   * Custom environment variable for job ID
   */
  readonly jobId?: string;

  /**
   * Custom environment variable for job URL
   */
  readonly jobUrl?: string;

  /**
   * Custom environment variable for triggered by user
   */
  readonly triggeredBy?: string;

  /**
   * Custom environment variable for workflow name
   */
  readonly workflowName?: string;
}
