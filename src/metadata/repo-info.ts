import { CiProvider, CustomEnvVarConfig, RepoInfo } from './types';

/**
 * Props for creating RepoInfo
 */
export interface RepoInfoProps {
  /**
   * CI/CD provider
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
 * Helper class for working with repository information
 */
export class RepoInfoHelper {
  /**
   * Create RepoInfo from individual components
   */
  public static create(props: RepoInfoProps): RepoInfo {
    return {
      provider: props.provider,
      owner: props.owner,
      repository: props.repository,
      branch: props.branch,
      commitHash: props.commitHash,
    };
  }

  /**
   * Create RepoInfo from environment variables (CI/CD context)
   */
  public static fromEnvironment(customEnvVars?: CustomEnvVarConfig): RepoInfo {
    const provider = this.detectProvider();

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
   * Detect CI/CD provider from environment variables
   */
  public static detectProvider(): CiProvider {
    if (process.env.GITHUB_ACTIONS === 'true' || process.env.GITHUB_SHA) {
      return CiProvider.GITHUB;
    }
    if (process.env.GITLAB_CI === 'true' || process.env.CI_COMMIT_SHA) {
      return CiProvider.GITLAB;
    }
    if (process.env.CODEBUILD_BUILD_ID || process.env.CODEBUILD_BUILD_ARN) {
      return CiProvider.CODEBUILD;
    }
    return CiProvider.UNKNOWN;
  }

  /**
   * Extract repository information from GitHub Actions environment
   */
  private static fromGitHubEnvironment(customEnvVars?: CustomEnvVarConfig): RepoInfo {
    const repository = this.getEnvVar(customEnvVars?.repoName, 'GITHUB_REPOSITORY') || 'unknown/unknown';
    const [owner, repo] = repository.includes('/')
      ? repository.split('/', 2)
      : ['unknown', repository];

    return this.create({
      provider: CiProvider.GITHUB,
      owner: this.getEnvVar(customEnvVars?.repoOwner, 'GITHUB_REPOSITORY_OWNER') || owner,
      repository: repo,
      branch: this.extractBranchName(
        this.getEnvVar(customEnvVars?.branch, 'GITHUB_REF') || '',
        process.env.GITHUB_HEAD_REF,
      ),
      commitHash: this.getEnvVar(customEnvVars?.commitHash, 'GITHUB_SHA') || 'unknown',
    });
  }

  /**
   * Extract repository information from GitLab CI environment
   */
  private static fromGitLabEnvironment(customEnvVars?: CustomEnvVarConfig): RepoInfo {
    // Prefer CI_PROJECT_NAME if available, otherwise parse from CI_PROJECT_PATH
    const projectName = this.getEnvVar(customEnvVars?.repoName, 'CI_PROJECT_NAME');
    const projectPath = process.env.CI_PROJECT_PATH || 'unknown/unknown';
    const [owner, repoFromPath] = projectPath.includes('/')
      ? projectPath.split('/', 2)
      : ['unknown', projectPath];

    return this.create({
      provider: CiProvider.GITLAB,
      owner: this.getEnvVar(customEnvVars?.repoOwner, 'CI_PROJECT_NAMESPACE') || owner,
      repository: projectName || repoFromPath || 'unknown',
      branch: this.getEnvVar(customEnvVars?.branch, 'CI_COMMIT_REF_NAME') || 'unknown',
      commitHash: this.getEnvVar(customEnvVars?.commitHash, 'CI_COMMIT_SHA') || 'unknown',
    });
  }

  /**
   * Extract repository information from AWS CodeBuild environment
   */
  private static fromCodeBuildEnvironment(customEnvVars?: CustomEnvVarConfig): RepoInfo {
    // CodeBuild source information from CODEBUILD_SOURCE_REPO_URL
    const repoUrl = process.env.CODEBUILD_SOURCE_REPO_URL || '';
    const { owner, repository } = this.parseRepoUrl(repoUrl);

    return this.create({
      provider: CiProvider.CODEBUILD,
      owner: this.getEnvVar(customEnvVars?.repoOwner) || owner,
      repository: this.getEnvVar(customEnvVars?.repoName) || repository || 'unknown',
      branch: this.getEnvVar(customEnvVars?.branch, 'CODEBUILD_WEBHOOK_HEAD_REF')
        || this.getEnvVar(customEnvVars?.branch, 'CODEBUILD_SOURCE_VERSION')
        || 'unknown',
      commitHash: this.getEnvVar(customEnvVars?.commitHash, 'CODEBUILD_RESOLVED_SOURCE_VERSION')
        || this.getEnvVar(customEnvVars?.commitHash, 'CODEBUILD_SOURCE_VERSION')
        || 'unknown',
    });
  }

  /**
   * Extract repository information from generic environment variables
   */
  private static fromGenericEnvironment(customEnvVars?: CustomEnvVarConfig): RepoInfo {
    return this.create({
      provider: CiProvider.UNKNOWN,
      owner: this.getEnvVar(customEnvVars?.repoOwner, 'REPO_OWNER'),
      repository: this.getEnvVar(customEnvVars?.repoName, 'REPO_NAME', 'REPOSITORY') || 'unknown',
      branch: this.getEnvVar(customEnvVars?.branch, 'BRANCH', 'GIT_BRANCH') || 'unknown',
      commitHash: this.getEnvVar(customEnvVars?.commitHash, 'COMMIT_HASH', 'GIT_COMMIT') || 'unknown',
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
   * Extract branch name from Git ref
   */
  private static extractBranchName(ref: string, headRef?: string): string {
    // For pull requests, prefer head ref
    if (headRef) {
      return headRef;
    }

    // Extract from refs/heads/branch-name
    if (ref.startsWith('refs/heads/')) {
      return ref.substring('refs/heads/'.length);
    }

    // Extract from refs/tags/tag-name
    if (ref.startsWith('refs/tags/')) {
      return ref.substring('refs/tags/'.length);
    }

    // Extract from refs/pull/123/merge
    if (ref.includes('/pull/')) {
      return ref;
    }

    return ref || 'unknown';
  }

  /**
   * Parse repository owner and name from URL
   */
  private static parseRepoUrl(url: string): { owner?: string; repository?: string } {
    if (!url) {
      return { owner: undefined, repository: undefined };
    }

    // Handle GitHub/GitLab URLs like https://github.com/owner/repo.git
    const githubMatch = url.match(/github\.com[/:]([^/]+)\/([^/.]+)/);
    if (githubMatch) {
      return { owner: githubMatch[1], repository: githubMatch[2] };
    }

    const gitlabMatch = url.match(/gitlab\.com[/:]([^/]+)\/([^/.]+)/);
    if (gitlabMatch) {
      return { owner: gitlabMatch[1], repository: gitlabMatch[2] };
    }

    // Handle AWS CodeCommit URLs like https://git-codecommit.region.amazonaws.com/v1/repos/repo-name
    const codecommitMatch = url.match(/codecommit\.[\w-]+\.amazonaws\.com\/v1\/repos\/([^/.]+)/);
    if (codecommitMatch) {
      return { owner: undefined, repository: codecommitMatch[1] };
    }

    return { owner: undefined, repository: undefined };
  }
}
