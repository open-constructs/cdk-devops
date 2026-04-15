import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PipelineInfoHelper } from './pipeline-info';
import { RepoInfoHelper } from './repo-info';
import { CustomEnvVarConfig, PipelineInfo, RepoInfo } from './types';

/**
 * Props for StackMetadata construct
 */
export interface StackMetadataProps {
  /**
   * Repository information
   * If not provided, will be extracted from environment variables
   */
  readonly repoInfo?: RepoInfo;

  /**
   * Pipeline information
   * If not provided, will be extracted from environment variables
   */
  readonly pipelineInfo?: PipelineInfo;

  /**
   * Custom environment variable names for overriding defaults
   * Only used when repoInfo and pipelineInfo are not provided
   */
  readonly customEnvVars?: CustomEnvVarConfig;

  /**
   * Metadata key for repository information
   * @default 'Repo'
   */
  readonly repoMetadataKey?: string;

  /**
   * Metadata key for pipeline information
   * @default 'Pipeline'
   */
  readonly pipelineMetadataKey?: string;
}

/**
 * Construct for adding repository and pipeline metadata to a CloudFormation stack
 *
 * This construct adds metadata to the stack containing information about the
 * repository (provider, owner, repository name, branch, commit) and the
 * CI/CD pipeline (job ID, job URL, triggered by, workflow name).
 *
 * @example
 *
 * // Automatically extract from environment variables
 * new StackMetadata(this, 'Metadata');
 *
 * // Use custom environment variable names
 * new StackMetadata(this, 'Metadata', {
 *   customEnvVars: {
 *     repoOwner: 'MY_REPO_OWNER',
 *     repoName: 'MY_REPO_NAME',
 *     branch: 'MY_BRANCH',
 *     commitHash: 'MY_COMMIT_HASH',
 *   },
 * });
 *
 * // Manually provide information
 * new StackMetadata(this, 'Metadata', {
 *   repoInfo: {
 *     provider: CiProvider.GITHUB,
 *     owner: 'my-org',
 *     repository: 'my-repo',
 *     branch: 'main',
 *     commitHash: 'abc123',
 *   },
 *   pipelineInfo: {
 *     provider: CiProvider.GITHUB,
 *     jobId: '12345',
 *     jobUrl: 'https://github.com/my-org/my-repo/actions/runs/12345',
 *     triggeredBy: 'user@example.com',
 *   },
 * });
 */
export class StackMetadata extends Construct {
  /**
   * Create a new StackMetadata construct that extracts information from environment variables
   */
  public static fromEnvironment(scope: Construct, id: string, customEnvVars?: CustomEnvVarConfig): StackMetadata {
    return new StackMetadata(scope, id, {
      customEnvVars,
    });
  }

  /**
   * The repository information
   */
  public readonly repoInfo: RepoInfo;

  /**
   * The pipeline information
   */
  public readonly pipelineInfo: PipelineInfo;

  constructor(scope: Construct, id: string, props?: StackMetadataProps) {
    super(scope, id);

    // Extract or use provided repository information
    this.repoInfo = props?.repoInfo || RepoInfoHelper.fromEnvironment(props?.customEnvVars);

    // Extract or use provided pipeline information
    this.pipelineInfo = props?.pipelineInfo || PipelineInfoHelper.fromEnvironment(props?.customEnvVars);

    // Add metadata to the stack
    this.addMetadataToStack(props);
  }

  /**
   * Add repository and pipeline metadata to the stack
   */
  private addMetadataToStack(props?: StackMetadataProps): void {
    const stack = Stack.of(this);
    const repoKey = props?.repoMetadataKey || 'Repo';
    const pipelineKey = props?.pipelineMetadataKey || 'Pipeline';

    // Add repository metadata
    stack.addMetadata(repoKey, {
      provider: this.repoInfo.provider,
      owner: this.repoInfo.owner,
      repository: this.repoInfo.repository,
      branch: this.repoInfo.branch,
      commitHash: this.repoInfo.commitHash,
    });

    // Add pipeline metadata
    const pipelineMetadata: Record<string, any> = {
      provider: this.pipelineInfo.provider,
      jobId: this.pipelineInfo.jobId,
      jobUrl: this.pipelineInfo.jobUrl,
      triggeredBy: this.pipelineInfo.triggeredBy,
      runNumber: this.pipelineInfo.runNumber,
    };

    stack.addMetadata(pipelineKey, pipelineMetadata);
  }

}
