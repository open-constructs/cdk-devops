import { GitInfoHelper } from '../../src/versioning/git-info';
import { VersionInfo, VersionInfoBuilder } from '../../src/versioning/version-info';

describe('VersionInfo', () => {
  const mockGitInfo = GitInfoHelper.create({
    commitHash: 'abcdef1234567890',
    branch: 'main',
    tag: 'v1.2.3',
    commitCount: 42,
  });

  describe('create', () => {
    it('should create VersionInfo with all properties', () => {
      const versionInfo = VersionInfo.create({
        version: '1.2.3',
        gitInfo: mockGitInfo,
        environment: 'production',
        packageVersion: '1.2.3',
        deploymentTime: '2024-01-15T10:00:00Z',
        repositoryUrl: 'https://github.com/test/repo',
        buildNumber: '123',
        pipelineVersion: 'pipeline-v1',
      });

      expect(versionInfo.version).toBe('1.2.3');
      expect(versionInfo.commitHash).toBe('abcdef1234567890');
      expect(versionInfo.shortCommitHash).toBe('abcdef12');
      expect(versionInfo.branch).toBe('main');
      expect(versionInfo.tag).toBe('v1.2.3');
      expect(versionInfo.commitCount).toBe(42);
      expect(versionInfo.environment).toBe('production');
      expect(versionInfo.packageVersion).toBe('1.2.3');
      expect(versionInfo.deploymentTime).toBe('2024-01-15T10:00:00Z');
      expect(versionInfo.repositoryUrl).toBe('https://github.com/test/repo');
      expect(versionInfo.buildNumber).toBe('123');
      expect(versionInfo.pipelineVersion).toBe('pipeline-v1');
    });

    it('should use current time if deploymentTime not provided', () => {
      const before = Date.now();
      const versionInfo = VersionInfo.create({
        version: '1.2.3',
        gitInfo: mockGitInfo,
        environment: 'production',
      });
      const after = Date.now();

      const deploymentTime = new Date(versionInfo.deploymentTime).getTime();
      expect(deploymentTime).toBeGreaterThanOrEqual(before);
      expect(deploymentTime).toBeLessThanOrEqual(after);
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

    it('should create from GitHub Actions environment', () => {
      process.env.GITHUB_SHA = 'abcdef1234567890';
      process.env.GITHUB_REF = 'refs/heads/main';
      process.env.GITHUB_REPOSITORY = 'test/repo';
      process.env.GITHUB_RUN_NUMBER = '123';
      process.env.COMMIT_COUNT = '42';
      process.env.PACKAGE_VERSION = '1.2.3';

      const versionInfo = VersionInfo.fromEnvironment('1.2.3', 'production');

      expect(versionInfo.version).toBe('1.2.3');
      expect(versionInfo.commitHash).toBe('abcdef1234567890');
      expect(versionInfo.branch).toBe('main');
      expect(versionInfo.environment).toBe('production');
      expect(versionInfo.repositoryUrl).toBe('https://github.com/test/repo');
      expect(versionInfo.buildNumber).toBe('123');
      expect(versionInfo.packageVersion).toBe('1.2.3');
    });

    it('should handle CodeBuild environment', () => {
      process.env.GIT_COMMIT = 'abcdef1234567890';
      process.env.GIT_BRANCH = 'main';
      process.env.COMMIT_COUNT = '42';
      process.env.CODEBUILD_BUILD_ID = 'build-123';

      const versionInfo = VersionInfo.fromEnvironment('1.2.3', 'production');

      expect(versionInfo.pipelineVersion).toBe('build-123');
    });
  });

  describe('fromJson', () => {
    it('should parse JSON correctly', () => {
      const json = JSON.stringify({
        version: '1.2.3',
        commitHash: 'abcdef1234567890',
        shortCommitHash: 'abcdef12',
        branch: 'main',
        tag: 'v1.2.3',
        commitCount: 42,
        environment: 'production',
        deploymentTime: '2024-01-15T10:00:00Z',
        packageVersion: '1.2.3',
        repositoryUrl: 'https://github.com/test/repo',
        buildNumber: '123',
        pipelineVersion: 'pipeline-v1',
      });

      const versionInfo = VersionInfo.fromJson(json);

      expect(versionInfo.version).toBe('1.2.3');
      expect(versionInfo.commitHash).toBe('abcdef1234567890');
      expect(versionInfo.tag).toBe('v1.2.3');
    });
  });

  describe('displayVersion', () => {
    it('should return tag when available', () => {
      const versionInfo = VersionInfo.create({
        version: '1.2.3-dev',
        gitInfo: mockGitInfo,
        environment: 'production',
      });

      expect(versionInfo.displayVersion()).toBe('v1.2.3');
    });

    it('should return version when tag is not available', () => {
      const gitInfo = GitInfoHelper.create({
        commitHash: 'abc123',
        branch: 'main',
        commitCount: 42,
      });

      const versionInfo = VersionInfo.create({
        version: '1.2.3-dev',
        gitInfo,
        environment: 'production',
      });

      expect(versionInfo.displayVersion()).toBe('1.2.3-dev');
    });
  });

  describe('isTaggedRelease', () => {
    it('should return true when tag exists', () => {
      const versionInfo = VersionInfo.create({
        version: '1.2.3',
        gitInfo: mockGitInfo,
        environment: 'production',
      });

      expect(versionInfo.isTaggedRelease()).toBe(true);
    });

    it('should return false when tag is missing', () => {
      const gitInfo = GitInfoHelper.create({
        commitHash: 'abc123',
        branch: 'main',
        commitCount: 42,
      });

      const versionInfo = VersionInfo.create({
        version: '1.2.3',
        gitInfo,
        environment: 'production',
      });

      expect(versionInfo.isTaggedRelease()).toBe(false);
    });
  });

  describe('isMainBranch', () => {
    it('should return true for main branch', () => {
      const versionInfo = VersionInfo.create({
        version: '1.2.3',
        gitInfo: mockGitInfo,
        environment: 'production',
      });

      expect(versionInfo.isMainBranch()).toBe(true);
    });

    it('should return false for other branches', () => {
      const gitInfo = GitInfoHelper.create({
        commitHash: 'abc123',
        branch: 'develop',
        commitCount: 42,
      });

      const versionInfo = VersionInfo.create({
        version: '1.2.3',
        gitInfo,
        environment: 'production',
      });

      expect(versionInfo.isMainBranch()).toBe(false);
    });
  });

  describe('toJson and toObject', () => {
    it('should convert to JSON string', () => {
      const versionInfo = VersionInfo.create({
        version: '1.2.3',
        gitInfo: mockGitInfo,
        environment: 'production',
      });

      const json = versionInfo.toJson();
      const parsed = JSON.parse(json);

      expect(parsed.version).toBe('1.2.3');
      expect(parsed.commitHash).toBe('abcdef1234567890');
    });

    it('should convert to object', () => {
      const versionInfo = VersionInfo.create({
        version: '1.2.3',
        gitInfo: mockGitInfo,
        environment: 'production',
      });

      const obj = versionInfo.toObject();

      expect(obj.version).toBe('1.2.3');
      expect(obj.commitHash).toBe('abcdef1234567890');
    });
  });

  describe('template substitution', () => {
    it('should substitute version in parameterName', () => {
      const versionInfo = VersionInfo.create({
        version: '1.2.3',
        gitInfo: mockGitInfo,
        environment: 'production',
      });

      const name = versionInfo.parameterName('/app/{environment}/{version}');
      expect(name).toBe('/app/production/1.2.3');
    });

    it('should substitute multiple variables', () => {
      const versionInfo = VersionInfo.create({
        version: '1.2.3',
        gitInfo: mockGitInfo,
        environment: 'prod',
      });

      const name = versionInfo.exportName('{environment}-{version}-{commit-hash}');
      expect(name).toBe('prod-1.2.3-abcdef12');
    });
  });

  describe('compare', () => {
    it('should compare by commit count', () => {
      const v1 = VersionInfo.create({
        version: '1.2.3',
        gitInfo: GitInfoHelper.create({
          commitHash: 'abc123',
          branch: 'main',
          commitCount: 10,
        }),
        environment: 'production',
      });

      const v2 = VersionInfo.create({
        version: '1.2.4',
        gitInfo: GitInfoHelper.create({
          commitHash: 'def456',
          branch: 'main',
          commitCount: 20,
        }),
        environment: 'production',
      });

      expect(VersionInfo.compare(v1, v2)).toBeLessThan(0);
      expect(VersionInfo.compare(v2, v1)).toBeGreaterThan(0);
    });

    it('should compare by version string when commit counts are equal', () => {
      const v1 = VersionInfo.create({
        version: '1.2.3',
        gitInfo: GitInfoHelper.create({
          commitHash: 'abc123',
          branch: 'main',
          commitCount: 10,
        }),
        environment: 'production',
      });

      const v2 = VersionInfo.create({
        version: '1.2.4',
        gitInfo: GitInfoHelper.create({
          commitHash: 'def456',
          branch: 'main',
          commitCount: 10,
        }),
        environment: 'production',
      });

      expect(VersionInfo.compare(v1, v2)).toBeLessThan(0);
    });
  });
});

describe('VersionInfoBuilder', () => {
  it('should build VersionInfo with fluent API', () => {
    const gitInfo = GitInfoHelper.create({
      commitHash: 'abc123',
      branch: 'main',
      commitCount: 42,
    });

    const versionInfo = new VersionInfoBuilder()
      .withVersion('1.2.3')
      .withGitInfo(gitInfo)
      .withEnvironment('production')
      .withPackageVersion('1.2.3')
      .withRepositoryUrl('https://github.com/test/repo')
      .withBuildNumber('123')
      .buildVersionInfo();

    expect(versionInfo.version).toBe('1.2.3');
    expect(versionInfo.environment).toBe('production');
    expect(versionInfo.packageVersion).toBe('1.2.3');
    expect(versionInfo.buildNumber).toBe('123');
  });

  it('should throw error if version is missing', () => {
    const builder = new VersionInfoBuilder()
      .withGitInfo(GitInfoHelper.create({
        commitHash: 'abc123',
        branch: 'main',
        commitCount: 42,
      }))
      .withEnvironment('production');

    expect(() => builder.buildVersionInfo()).toThrow('Version is required');
  });

  it('should throw error if gitInfo is missing', () => {
    const builder = new VersionInfoBuilder()
      .withVersion('1.2.3')
      .withEnvironment('production');

    expect(() => builder.buildVersionInfo()).toThrow('GitInfo is required');
  });

  it('should throw error if environment is missing', () => {
    const builder = new VersionInfoBuilder()
      .withVersion('1.2.3')
      .withGitInfo(GitInfoHelper.create({
        commitHash: 'abc123',
        branch: 'main',
        commitCount: 42,
      }));

    expect(() => builder.buildVersionInfo()).toThrow('Environment is required');
  });
});
