import { RepoInfoHelper } from '../../src/metadata/repo-info';
import { CiProvider } from '../../src/metadata/types';

describe('RepoInfoHelper', () => {
  describe('create', () => {
    it('should create RepoInfo with all properties', () => {
      const repoInfo = RepoInfoHelper.create({
        provider: CiProvider.GITHUB,
        owner: 'my-org',
        repository: 'my-repo',
        branch: 'main',
        commitHash: 'abcdef1234567890',
      });

      expect(repoInfo.provider).toBe(CiProvider.GITHUB);
      expect(repoInfo.owner).toBe('my-org');
      expect(repoInfo.repository).toBe('my-repo');
      expect(repoInfo.branch).toBe('main');
      expect(repoInfo.commitHash).toBe('abcdef1234567890');
    });

    it('should create RepoInfo without owner', () => {
      const repoInfo = RepoInfoHelper.create({
        provider: CiProvider.CODEBUILD,
        repository: 'my-repo',
        branch: 'main',
        commitHash: 'abcdef1234567890',
      });

      expect(repoInfo.provider).toBe(CiProvider.CODEBUILD);
      expect(repoInfo.owner).toBeUndefined();
      expect(repoInfo.repository).toBe('my-repo');
    });
  });

  describe('detectProvider', () => {
    it('should detect GitHub Actions', () => {
      process.env.GITHUB_ACTIONS = 'true';
      process.env.GITHUB_SHA = 'abc123';

      const provider = RepoInfoHelper.detectProvider();
      expect(provider).toBe(CiProvider.GITHUB);
    });

    it('should detect GitLab CI', () => {
      process.env.GITLAB_CI = 'true';
      process.env.CI_COMMIT_SHA = 'abc123';

      const provider = RepoInfoHelper.detectProvider();
      expect(provider).toBe(CiProvider.GITLAB);
    });

    it('should detect AWS CodeBuild', () => {
      process.env.CODEBUILD_BUILD_ID = 'my-build:123';

      const provider = RepoInfoHelper.detectProvider();
      expect(provider).toBe(CiProvider.CODEBUILD);
    });

    it('should return UNKNOWN for unrecognized environment', () => {
      const provider = RepoInfoHelper.detectProvider();
      expect(provider).toBe(CiProvider.UNKNOWN);
    });
  });

  describe('fromEnvironment - GitHub', () => {
    beforeEach(() => {
      process.env.GITHUB_ACTIONS = 'true';
    });

    it('should extract from GitHub Actions environment', () => {
      process.env.GITHUB_REPOSITORY = 'my-org/my-repo';
      process.env.GITHUB_REPOSITORY_OWNER = 'my-org';
      process.env.GITHUB_REF = 'refs/heads/feature-branch';
      process.env.GITHUB_SHA = 'abcdef1234567890';

      const repoInfo = RepoInfoHelper.fromEnvironment();

      expect(repoInfo.provider).toBe(CiProvider.GITHUB);
      expect(repoInfo.owner).toBe('my-org');
      expect(repoInfo.repository).toBe('my-repo');
      expect(repoInfo.branch).toBe('feature-branch');
      expect(repoInfo.commitHash).toBe('abcdef1234567890');
    });

    it('should handle pull request with head ref', () => {
      process.env.GITHUB_REPOSITORY = 'my-org/my-repo';
      process.env.GITHUB_REF = 'refs/pull/123/merge';
      process.env.GITHUB_HEAD_REF = 'feature-branch';
      process.env.GITHUB_SHA = 'abcdef1234567890';

      const repoInfo = RepoInfoHelper.fromEnvironment();

      expect(repoInfo.branch).toBe('feature-branch');
    });

    it('should extract tag name', () => {
      process.env.GITHUB_REPOSITORY = 'my-org/my-repo';
      process.env.GITHUB_REF = 'refs/tags/v1.2.3';
      process.env.GITHUB_SHA = 'abcdef1234567890';

      const repoInfo = RepoInfoHelper.fromEnvironment();

      expect(repoInfo.branch).toBe('v1.2.3');
    });

    it('should use custom environment variables', () => {
      process.env.MY_CUSTOM_OWNER = 'custom-org';
      process.env.MY_CUSTOM_REPO = 'custom-repo';
      process.env.MY_CUSTOM_BRANCH = 'custom-branch';
      process.env.MY_CUSTOM_COMMIT = 'custom-commit-hash';

      const repoInfo = RepoInfoHelper.fromEnvironment({
        repoOwner: 'MY_CUSTOM_OWNER',
        repoName: 'MY_CUSTOM_REPO',
        branch: 'MY_CUSTOM_BRANCH',
        commitHash: 'MY_CUSTOM_COMMIT',
      });

      expect(repoInfo.owner).toBe('custom-org');
      expect(repoInfo.repository).toBe('custom-repo');
      expect(repoInfo.branch).toBe('custom-branch');
      expect(repoInfo.commitHash).toBe('custom-commit-hash');
    });

    it('should handle repository without slash', () => {
      process.env.GITHUB_REPOSITORY = 'my-repo';
      process.env.GITHUB_REF = 'refs/heads/main';
      process.env.GITHUB_SHA = 'abcdef1234567890';

      const repoInfo = RepoInfoHelper.fromEnvironment();

      expect(repoInfo.owner).toBe('unknown');
      expect(repoInfo.repository).toBe('my-repo');
    });
  });

  describe('fromEnvironment - GitLab', () => {
    beforeEach(() => {
      process.env.GITLAB_CI = 'true';
    });

    it('should extract from GitLab CI environment', () => {
      process.env.CI_PROJECT_PATH = 'my-group/my-project';
      process.env.CI_PROJECT_NAMESPACE = 'my-group';
      process.env.CI_PROJECT_NAME = 'my-project';
      process.env.CI_COMMIT_REF_NAME = 'feature-branch';
      process.env.CI_COMMIT_SHA = 'abcdef1234567890';

      const repoInfo = RepoInfoHelper.fromEnvironment();

      expect(repoInfo.provider).toBe(CiProvider.GITLAB);
      expect(repoInfo.owner).toBe('my-group');
      expect(repoInfo.repository).toBe('my-project');
      expect(repoInfo.branch).toBe('feature-branch');
      expect(repoInfo.commitHash).toBe('abcdef1234567890');
    });

    it('should fallback to CI_PROJECT_NAME when path has no slash', () => {
      process.env.CI_PROJECT_PATH = 'my-project';
      process.env.CI_PROJECT_NAME = 'my-project-name';
      process.env.CI_COMMIT_REF_NAME = 'main';
      process.env.CI_COMMIT_SHA = 'abcdef1234567890';

      const repoInfo = RepoInfoHelper.fromEnvironment();

      expect(repoInfo.repository).toBe('my-project-name');
    });

    it('should use custom environment variables', () => {
      process.env.MY_CUSTOM_OWNER = 'custom-group';
      process.env.MY_CUSTOM_REPO = 'custom-project';
      process.env.MY_CUSTOM_BRANCH = 'custom-branch';
      process.env.MY_CUSTOM_COMMIT = 'custom-commit-hash';

      const repoInfo = RepoInfoHelper.fromEnvironment({
        repoOwner: 'MY_CUSTOM_OWNER',
        repoName: 'MY_CUSTOM_REPO',
        branch: 'MY_CUSTOM_BRANCH',
        commitHash: 'MY_CUSTOM_COMMIT',
      });

      expect(repoInfo.owner).toBe('custom-group');
      expect(repoInfo.repository).toBe('custom-project');
      expect(repoInfo.branch).toBe('custom-branch');
      expect(repoInfo.commitHash).toBe('custom-commit-hash');
    });
  });

  describe('fromEnvironment - CodeBuild', () => {
    beforeEach(() => {
      process.env.CODEBUILD_BUILD_ID = 'my-project:abc-123';
    });

    it('should extract from CodeBuild environment with GitHub URL', () => {
      process.env.CODEBUILD_SOURCE_REPO_URL = 'https://github.com/my-org/my-repo.git';
      process.env.CODEBUILD_WEBHOOK_HEAD_REF = 'refs/heads/feature-branch';
      process.env.CODEBUILD_RESOLVED_SOURCE_VERSION = 'abcdef1234567890';

      const repoInfo = RepoInfoHelper.fromEnvironment();

      expect(repoInfo.provider).toBe(CiProvider.CODEBUILD);
      expect(repoInfo.owner).toBe('my-org');
      expect(repoInfo.repository).toBe('my-repo');
      expect(repoInfo.branch).toBe('refs/heads/feature-branch');
      expect(repoInfo.commitHash).toBe('abcdef1234567890');
    });

    it('should extract from CodeBuild environment with GitLab URL', () => {
      process.env.CODEBUILD_SOURCE_REPO_URL = 'https://gitlab.com/my-group/my-project.git';
      process.env.CODEBUILD_SOURCE_VERSION = 'main';
      process.env.CODEBUILD_RESOLVED_SOURCE_VERSION = 'abcdef1234567890';

      const repoInfo = RepoInfoHelper.fromEnvironment();

      expect(repoInfo.owner).toBe('my-group');
      expect(repoInfo.repository).toBe('my-project');
    });

    it('should extract from CodeBuild environment with CodeCommit URL', () => {
      process.env.CODEBUILD_SOURCE_REPO_URL =
        'https://git-codecommit.us-east-1.amazonaws.com/v1/repos/my-repo';
      process.env.CODEBUILD_SOURCE_VERSION = 'main';
      process.env.CODEBUILD_RESOLVED_SOURCE_VERSION = 'abcdef1234567890';

      const repoInfo = RepoInfoHelper.fromEnvironment();

      expect(repoInfo.owner).toBeUndefined();
      expect(repoInfo.repository).toBe('my-repo');
    });

    it('should fallback to CODEBUILD_SOURCE_VERSION when RESOLVED is missing', () => {
      process.env.CODEBUILD_SOURCE_REPO_URL = 'https://github.com/my-org/my-repo.git';
      process.env.CODEBUILD_SOURCE_VERSION = 'commit-hash-123';

      const repoInfo = RepoInfoHelper.fromEnvironment();

      expect(repoInfo.commitHash).toBe('commit-hash-123');
    });

    it('should use custom environment variables', () => {
      process.env.MY_CUSTOM_OWNER = 'custom-org';
      process.env.MY_CUSTOM_REPO = 'custom-repo';
      process.env.MY_CUSTOM_BRANCH = 'custom-branch';
      process.env.MY_CUSTOM_COMMIT = 'custom-commit-hash';

      const repoInfo = RepoInfoHelper.fromEnvironment({
        repoOwner: 'MY_CUSTOM_OWNER',
        repoName: 'MY_CUSTOM_REPO',
        branch: 'MY_CUSTOM_BRANCH',
        commitHash: 'MY_CUSTOM_COMMIT',
      });

      expect(repoInfo.owner).toBe('custom-org');
      expect(repoInfo.repository).toBe('custom-repo');
      expect(repoInfo.branch).toBe('custom-branch');
      expect(repoInfo.commitHash).toBe('custom-commit-hash');
    });
  });

  describe('fromEnvironment - Generic', () => {
    it('should extract from generic environment variables', () => {
      process.env.REPO_OWNER = 'my-org';
      process.env.REPO_NAME = 'my-repo';
      process.env.BRANCH = 'feature-branch';
      process.env.COMMIT_HASH = 'abcdef1234567890';

      const repoInfo = RepoInfoHelper.fromEnvironment();

      expect(repoInfo.provider).toBe(CiProvider.UNKNOWN);
      expect(repoInfo.owner).toBe('my-org');
      expect(repoInfo.repository).toBe('my-repo');
      expect(repoInfo.branch).toBe('feature-branch');
      expect(repoInfo.commitHash).toBe('abcdef1234567890');
    });

    it('should use fallback environment variables', () => {
      process.env.REPOSITORY = 'my-repo';
      process.env.GIT_BRANCH = 'main';
      process.env.GIT_COMMIT = 'commit-123';

      const repoInfo = RepoInfoHelper.fromEnvironment();

      expect(repoInfo.repository).toBe('my-repo');
      expect(repoInfo.branch).toBe('main');
      expect(repoInfo.commitHash).toBe('commit-123');
    });

    it('should use unknown as default for missing values', () => {
      const repoInfo = RepoInfoHelper.fromEnvironment();

      expect(repoInfo.repository).toBe('unknown');
      expect(repoInfo.branch).toBe('unknown');
      expect(repoInfo.commitHash).toBe('unknown');
    });
  });
});
