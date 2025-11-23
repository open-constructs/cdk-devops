/**
 * Git repository information
 */
export interface GitInfo {
  /**
   * Full commit hash
   */
  readonly commitHash: string;

  /**
   * Short commit hash (typically 8 characters)
   */
  readonly shortCommitHash: string;

  /**
   * Current branch name
   */
  readonly branch: string;

  /**
   * Git tag (if on a tagged commit)
   */
  readonly tag?: string;

  /**
   * Total commit count
   */
  readonly commitCount: number;

  /**
   * Commit count since last tag
   */
  readonly commitsSinceTag?: number;
}

/**
 * Props for creating GitInfo
 */
export interface GitInfoProps {
  /**
   * Full commit hash
   */
  readonly commitHash: string;

  /**
   * Current branch name
   */
  readonly branch: string;

  /**
   * Git tag (if on a tagged commit)
   */
  readonly tag?: string;

  /**
   * Total commit count
   */
  readonly commitCount: number;

  /**
   * Commit count since last tag
   */
  readonly commitsSinceTag?: number;
}

/**
 * Helper class for working with Git information
 */
export class GitInfoHelper {
  /**
   * Create GitInfo from individual components
   */
  public static create(props: GitInfoProps): GitInfo {
    return {
      commitHash: props.commitHash,
      shortCommitHash: this.shortenHash(props.commitHash),
      branch: props.branch,
      tag: props.tag,
      commitCount: props.commitCount,
      commitsSinceTag: props.commitsSinceTag,
    };
  }

  /**
   * Create GitInfo from environment variables (CI/CD context)
   */
  public static fromEnvironment(): GitInfo {
    // GitHub Actions
    if (process.env.GITHUB_SHA) {
      return this.create({
        commitHash: process.env.GITHUB_SHA,
        branch: this.extractBranchName(
          process.env.GITHUB_REF || '',
          process.env.GITHUB_HEAD_REF,
        ),
        tag: this.extractTagName(process.env.GITHUB_REF),
        commitCount: parseInt(process.env.COMMIT_COUNT || '0', 10),
        commitsSinceTag: process.env.COMMITS_SINCE_TAG
          ? parseInt(process.env.COMMITS_SINCE_TAG, 10)
          : undefined,
      });
    }

    // GitLab CI
    if (process.env.CI_COMMIT_SHA) {
      return this.create({
        commitHash: process.env.CI_COMMIT_SHA,
        branch: process.env.CI_COMMIT_REF_NAME || 'unknown',
        tag: process.env.CI_COMMIT_TAG,
        commitCount: parseInt(process.env.COMMIT_COUNT || '0', 10),
        commitsSinceTag: process.env.COMMITS_SINCE_TAG
          ? parseInt(process.env.COMMITS_SINCE_TAG, 10)
          : undefined,
      });
    }

    // Generic fallback
    return this.create({
      commitHash: process.env.GIT_COMMIT || process.env.COMMIT_SHA || 'unknown',
      branch: process.env.GIT_BRANCH || process.env.BRANCH || 'unknown',
      tag: process.env.GIT_TAG,
      commitCount: parseInt(process.env.COMMIT_COUNT || '0', 10),
      commitsSinceTag: process.env.COMMITS_SINCE_TAG
        ? parseInt(process.env.COMMITS_SINCE_TAG, 10)
        : undefined,
    });
  }

  /**
   * Shorten a git commit hash to 8 characters
   */
  public static shortenHash(hash: string, length: number = 8): string {
    return hash.substring(0, length);
  }

  /**
   * Check if on a main branch
   */
  public static isMainBranch(branch: string): boolean {
    return branch === 'main' || branch === 'master';
  }

  /**
   * Check if on a tagged release
   */
  public static isTaggedRelease(gitInfo: GitInfo): boolean {
    return gitInfo.tag !== undefined;
  }

  /**
   * Extract branch name from Git ref
   */
  private static extractBranchName(
    ref: string,
    headRef?: string,
  ): string {
    // For pull requests, prefer head ref
    if (headRef) {
      return headRef;
    }

    // Extract from refs/heads/branch-name
    if (ref.startsWith('refs/heads/')) {
      return ref.substring('refs/heads/'.length);
    }

    // Extract from refs/pull/123/merge
    if (ref.includes('/pull/')) {
      return ref;
    }

    return ref || 'unknown';
  }

  /**
   * Extract tag name from Git ref
   */
  private static extractTagName(ref?: string): string | undefined {
    if (!ref) {
      return undefined;
    }

    // Extract from refs/tags/tag-name
    if (ref.startsWith('refs/tags/')) {
      return ref.substring('refs/tags/'.length);
    }

    return undefined;
  }
}
