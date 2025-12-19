import { RepoInfoHelper } from './repo-info';
import { CiProvider, CustomEnvVarConfig, PipelineInfo } from './types';

/**
 * Props for creating PipelineInfo
 */
export interface PipelineInfoProps {
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
 * Helper class for working with pipeline information
 */
export class PipelineInfoHelper {
  /**
   * Create PipelineInfo from individual components
   */
  public static create(props: PipelineInfoProps): PipelineInfo {
    return {
      provider: props.provider,
      jobId: props.jobId,
      jobUrl: props.jobUrl,
      triggeredBy: props.triggeredBy,
      workflowName: props.workflowName,
      runNumber: props.runNumber,
      runAttempt: props.runAttempt,
      event: props.event,
      additionalInfo: props.additionalInfo,
    };
  }

  /**
   * Create PipelineInfo from environment variables (CI/CD context)
   */
  public static fromEnvironment(customEnvVars?: CustomEnvVarConfig): PipelineInfo {
    const provider = RepoInfoHelper.detectProvider();

    switch (provider) {
      case CiProvider.GITHUB:
        return this.fromGitHubEnvironment(customEnvVars);
      case CiProvider.GITLAB:
        return this.fromGitLabEnvironment(customEnvVars);
      case CiProvider.CODEBUILD:
        return this.fromCodeBuildEnvironment(customEnvVars);
      default:
        return this.fromGenericEnvironment(customEnvVars);
    }
  }

  /**
   * Extract pipeline information from GitHub Actions environment
   */
  private static fromGitHubEnvironment(customEnvVars?: CustomEnvVarConfig): PipelineInfo {
    const repository = process.env.GITHUB_REPOSITORY || '';
    const runId = process.env.GITHUB_RUN_ID || '';
    const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';

    const jobUrl = repository && runId
      ? `${serverUrl}/${repository}/actions/runs/${runId}`
      : this.getEnvVar(customEnvVars?.jobUrl);

    return this.create({
      provider: CiProvider.GITHUB,
      jobId: this.getEnvVar(customEnvVars?.jobId, 'GITHUB_RUN_ID'),
      jobUrl,
      triggeredBy: this.getEnvVar(customEnvVars?.triggeredBy, 'GITHUB_ACTOR', 'GITHUB_TRIGGERING_ACTOR'),
      workflowName: this.getEnvVar(customEnvVars?.workflowName, 'GITHUB_WORKFLOW'),
      runNumber: process.env.GITHUB_RUN_NUMBER,
      runAttempt: process.env.GITHUB_RUN_ATTEMPT,
      event: process.env.GITHUB_EVENT_NAME,
      additionalInfo: {
        job: process.env.GITHUB_JOB || '',
        action: process.env.GITHUB_ACTION || '',
        ref: process.env.GITHUB_REF || '',
        sha: process.env.GITHUB_SHA || '',
      },
    });
  }

  /**
   * Extract pipeline information from GitLab CI environment
   */
  private static fromGitLabEnvironment(customEnvVars?: CustomEnvVarConfig): PipelineInfo {
    return this.create({
      provider: CiProvider.GITLAB,
      jobId: this.getEnvVar(customEnvVars?.jobId, 'CI_JOB_ID', 'CI_PIPELINE_ID'),
      jobUrl: this.getEnvVar(customEnvVars?.jobUrl, 'CI_JOB_URL', 'CI_PIPELINE_URL'),
      triggeredBy: this.getEnvVar(
        customEnvVars?.triggeredBy,
        'GITLAB_USER_LOGIN',
        'CI_COMMIT_AUTHOR',
        'GITLAB_USER_NAME',
      ),
      workflowName: this.getEnvVar(customEnvVars?.workflowName, 'CI_PROJECT_NAME', 'CI_PIPELINE_NAME'),
      runNumber: process.env.CI_PIPELINE_IID,
      event: process.env.CI_PIPELINE_SOURCE,
      additionalInfo: {
        jobName: process.env.CI_JOB_NAME || '',
        jobStage: process.env.CI_JOB_STAGE || '',
        pipelineId: process.env.CI_PIPELINE_ID || '',
        projectPath: process.env.CI_PROJECT_PATH || '',
        commitRef: process.env.CI_COMMIT_REF_NAME || '',
      },
    });
  }

  /**
   * Extract pipeline information from AWS CodeBuild environment
   */
  private static fromCodeBuildEnvironment(customEnvVars?: CustomEnvVarConfig): PipelineInfo {
    const buildId = process.env.CODEBUILD_BUILD_ID || '';
    const region = this.extractRegionFromArn(process.env.CODEBUILD_BUILD_ARN);
    const buildNumber = process.env.CODEBUILD_BUILD_NUMBER;

    // Construct CodeBuild console URL
    const jobUrl = buildId && region
      ? `https://${region}.console.aws.amazon.com/codesuite/codebuild/projects/${buildId.split(':')[0]}/build/${encodeURIComponent(buildId)}`
      : this.getEnvVar(customEnvVars?.jobUrl);

    // Extract workflow name from custom env var or build ARN
    let workflowName: string | undefined;
    if (customEnvVars?.workflowName && process.env[customEnvVars.workflowName]) {
      workflowName = process.env[customEnvVars.workflowName];
    } else if (process.env.CODEBUILD_BUILD_ARN) {
      workflowName = process.env.CODEBUILD_BUILD_ARN.split(':')[5]?.split('/')[1];
    }

    return this.create({
      provider: CiProvider.CODEBUILD,
      jobId: this.getEnvVar(customEnvVars?.jobId, 'CODEBUILD_BUILD_ID'),
      jobUrl,
      triggeredBy: this.getEnvVar(customEnvVars?.triggeredBy, 'CODEBUILD_INITIATOR'),
      workflowName,
      runNumber: buildNumber,
      additionalInfo: {
        buildArn: process.env.CODEBUILD_BUILD_ARN || '',
        buildNumber: buildNumber || '',
        sourceVersion: process.env.CODEBUILD_SOURCE_VERSION || '',
        webhookEvent: process.env.CODEBUILD_WEBHOOK_EVENT || '',
        webhookTrigger: process.env.CODEBUILD_WEBHOOK_TRIGGER || '',
        publicBuildUrl: process.env.CODEBUILD_PUBLIC_BUILD_URL || '',
      },
    });
  }

  /**
   * Extract pipeline information from generic environment variables
   */
  private static fromGenericEnvironment(customEnvVars?: CustomEnvVarConfig): PipelineInfo {
    return this.create({
      provider: CiProvider.UNKNOWN,
      jobId: this.getEnvVar(customEnvVars?.jobId, 'BUILD_ID', 'JOB_ID'),
      jobUrl: this.getEnvVar(customEnvVars?.jobUrl, 'BUILD_URL', 'JOB_URL'),
      triggeredBy: this.getEnvVar(customEnvVars?.triggeredBy, 'BUILD_USER', 'USER'),
      workflowName: this.getEnvVar(customEnvVars?.workflowName, 'WORKFLOW_NAME', 'PIPELINE_NAME'),
      runNumber: process.env.BUILD_NUMBER,
      additionalInfo: {},
    });
  }

  /**
   * Get environment variable value with fallbacks
   */
  private static getEnvVar(customVar?: string, ...fallbackVars: string[]): string | undefined {
    if (customVar && process.env[customVar]) {
      return process.env[customVar];
    }
    for (const varName of fallbackVars) {
      if (process.env[varName]) {
        return process.env[varName];
      }
    }
    return undefined;
  }

  /**
   * Extract AWS region from ARN
   */
  private static extractRegionFromArn(arn?: string): string | undefined {
    if (!arn) {
      return undefined;
    }
    // ARN format: arn:aws:codebuild:region:account-id:build/project-name:build-id
    const parts = arn.split(':');
    return parts.length > 3 ? parts[3] : undefined;
  }
}
