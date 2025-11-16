import { GitInfoHelper } from '../../src/versioning/git-info';

describe('GitInfoHelper', () => {
  describe('create', () => {
    it('should create GitInfo with short hash', () => {
      const gitInfo = GitInfoHelper.create({
        commitHash: 'abcdef1234567890',
        branch: 'main',
        commitCount: 42,
      });

      expect(gitInfo.commitHash).toBe('abcdef1234567890');
      expect(gitInfo.shortCommitHash).toBe('abcdef12');
      expect(gitInfo.branch).toBe('main');
      expect(gitInfo.commitCount).toBe(42);
      expect(gitInfo.tag).toBeUndefined();
    });

    it('should include tag when provided', () => {
      const gitInfo = GitInfoHelper.create({
        commitHash: 'abcdef1234567890',
        branch: 'main',
        tag: 'v1.2.3',
        commitCount: 42,
      });

      expect(gitInfo.tag).toBe('v1.2.3');
    });

    it('should include commits since tag when provided', () => {
      const gitInfo = GitInfoHelper.create({
        commitHash: 'abcdef1234567890',
        branch: 'main',
        commitCount: 42,
        commitsSinceTag: 5,
      });

      expect(gitInfo.commitsSinceTag).toBe(5);
    });
  });

  describe('shortenHash', () => {
    it('should shorten hash to 8 characters by default', () => {
      const short = GitInfoHelper.shortenHash('abcdef1234567890');
      expect(short).toBe('abcdef12');
    });

    it('should shorten hash to custom length', () => {
      const short = GitInfoHelper.shortenHash('abcdef1234567890', 12);
      expect(short).toBe('abcdef123456');
    });

    it('should handle short hashes', () => {
      const short = GitInfoHelper.shortenHash('abc', 8);
      expect(short).toBe('abc');
    });
  });

  describe('fromEnvironment', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it('should extract from GitHub Actions environment', () => {
      process.env.GITHUB_SHA = 'abcdef1234567890';
      process.env.GITHUB_REF = 'refs/heads/feature-branch';
      process.env.COMMIT_COUNT = '42';

      const gitInfo = GitInfoHelper.fromEnvironment();

      expect(gitInfo.commitHash).toBe('abcdef1234567890');
      expect(gitInfo.branch).toBe('feature-branch');
      expect(gitInfo.commitCount).toBe(42);
    });

    it('should extract tag from GitHub Actions', () => {
      process.env.GITHUB_SHA = 'abcdef1234567890';
      process.env.GITHUB_REF = 'refs/tags/v1.2.3';
      process.env.COMMIT_COUNT = '42';

      const gitInfo = GitInfoHelper.fromEnvironment();

      expect(gitInfo.tag).toBe('v1.2.3');
    });

    it('should use head ref for pull requests', () => {
      process.env.GITHUB_SHA = 'abcdef1234567890';
      process.env.GITHUB_REF = 'refs/pull/123/merge';
      process.env.GITHUB_HEAD_REF = 'feature-branch';
      process.env.COMMIT_COUNT = '42';

      const gitInfo = GitInfoHelper.fromEnvironment();

      expect(gitInfo.branch).toBe('feature-branch');
    });

    it('should extract from GitLab CI environment', () => {
      process.env.CI_COMMIT_SHA = 'abcdef1234567890';
      process.env.CI_COMMIT_REF_NAME = 'feature-branch';
      process.env.CI_COMMIT_TAG = 'v1.2.3';
      process.env.COMMIT_COUNT = '42';

      const gitInfo = GitInfoHelper.fromEnvironment();

      expect(gitInfo.commitHash).toBe('abcdef1234567890');
      expect(gitInfo.branch).toBe('feature-branch');
      expect(gitInfo.tag).toBe('v1.2.3');
      expect(gitInfo.commitCount).toBe(42);
    });

    it('should use generic fallback', () => {
      process.env.GIT_COMMIT = 'abcdef1234567890';
      process.env.GIT_BRANCH = 'main';
      process.env.COMMIT_COUNT = '42';

      const gitInfo = GitInfoHelper.fromEnvironment();

      expect(gitInfo.commitHash).toBe('abcdef1234567890');
      expect(gitInfo.branch).toBe('main');
      expect(gitInfo.commitCount).toBe(42);
    });

    it('should handle missing environment variables', () => {
      const gitInfo = GitInfoHelper.fromEnvironment();

      expect(gitInfo.commitHash).toBe('unknown');
      expect(gitInfo.branch).toBe('unknown');
      expect(gitInfo.commitCount).toBe(0);
    });
  });

  describe('isMainBranch', () => {
    it('should return true for main branch', () => {
      expect(GitInfoHelper.isMainBranch('main')).toBe(true);
    });

    it('should return true for master branch', () => {
      expect(GitInfoHelper.isMainBranch('master')).toBe(true);
    });

    it('should return false for other branches', () => {
      expect(GitInfoHelper.isMainBranch('develop')).toBe(false);
      expect(GitInfoHelper.isMainBranch('feature/test')).toBe(false);
    });
  });

  describe('isTaggedRelease', () => {
    it('should return true when tag is present', () => {
      const gitInfo = GitInfoHelper.create({
        commitHash: 'abc123',
        branch: 'main',
        tag: 'v1.0.0',
        commitCount: 42,
      });

      expect(GitInfoHelper.isTaggedRelease(gitInfo)).toBe(true);
    });

    it('should return false when tag is missing', () => {
      const gitInfo = GitInfoHelper.create({
        commitHash: 'abc123',
        branch: 'main',
        commitCount: 42,
      });

      expect(GitInfoHelper.isTaggedRelease(gitInfo)).toBe(false);
    });
  });
});
