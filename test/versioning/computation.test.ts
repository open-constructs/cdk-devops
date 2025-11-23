import { VersionComputer, ComputationContext } from '../../src/versioning/computation';
import { GitInfoHelper } from '../../src/versioning/git-info';
import { VersioningStrategy } from '../../src/versioning/strategy';

describe('VersionComputer', () => {
  const mockContext: ComputationContext = {
    gitInfo: GitInfoHelper.create({
      commitHash: 'abcdef1234567890',
      branch: 'feature/test-branch',
      tag: 'v1.2.3',
      commitCount: 42,
      commitsSinceTag: 5,
    }),
    packageVersion: '1.2.3',
    environment: 'production',
    buildNumber: '123',
  };

  describe('git tag strategy', () => {
    it('should use git tag as version', () => {
      const strategy = VersioningStrategy.gitTag();
      const computer = new VersionComputer(strategy);

      const version = computer.computeVersionString(mockContext);

      expect(version).toBe('1.2.3');
    });

    it('should strip prefix from git tag', () => {
      const strategy = VersioningStrategy.gitTag({ prefix: 'v' });
      const computer = new VersionComputer(strategy);

      const version = computer.computeVersionString(mockContext);

      expect(version).toBe('1.2.3');
    });

    it('should use dev version when no tag', () => {
      const strategy = VersioningStrategy.gitTag();
      const computer = new VersionComputer(strategy);

      const contextNoTag = {
        ...mockContext,
        gitInfo: GitInfoHelper.create({
          commitHash: 'abc123',
          branch: 'main',
          commitCount: 42,
        }),
      };

      const version = computer.computeVersionString(contextNoTag);

      expect(version).toBe('dev');
    });

    it('should create dev version with commit count', () => {
      const strategy = VersioningStrategy.gitTagWithDevVersions();
      const computer = new VersionComputer(strategy);

      const contextNoTag = {
        ...mockContext,
        gitInfo: GitInfoHelper.create({
          commitHash: 'abc123',
          branch: 'main',
          commitCount: 42,
          commitsSinceTag: 5,
        }),
      };

      const version = computer.computeVersionString(contextNoTag);

      expect(version).toBe('dev.5');
    });
  });

  describe('package.json strategy', () => {
    it('should use package version', () => {
      const strategy = VersioningStrategy.packageJson();
      const computer = new VersionComputer(strategy);

      const version = computer.computeVersionString(mockContext);

      expect(version).toBe('1.2.3');
    });

    it('should use default version when package version missing', () => {
      const strategy = VersioningStrategy.packageJson();
      const computer = new VersionComputer(strategy);

      const contextNoPackage = {
        ...mockContext,
        packageVersion: undefined,
      };

      const version = computer.computeVersionString(contextNoPackage);

      expect(version).toBe('0.0.0');
    });
  });

  describe('commit count strategy', () => {
    it('should use commit count', () => {
      const strategy = VersioningStrategy.commitCount();
      const computer = new VersionComputer(strategy);

      const version = computer.computeVersionString(mockContext);

      expect(version).toBe('0.0.42');
    });

    it('should pad commit count', () => {
      const strategy = VersioningStrategy.commitCount({ padding: 5 });
      const computer = new VersionComputer(strategy);

      const version = computer.computeVersionString(mockContext);

      expect(version).toBe('0.0.00042');
    });

    it('should use commits since tag when mode is since-tag', () => {
      const strategy = VersioningStrategy.create('0.0.{commit-count}', {
        commitCount: { mode: 'since-tag' },
      });
      const computer = new VersionComputer(strategy);

      const version = computer.computeVersionString(mockContext);

      expect(version).toBe('0.0.5');
    });
  });

  describe('commit hash strategy', () => {
    it('should use short commit hash', () => {
      const strategy = VersioningStrategy.commitHash();
      const computer = new VersionComputer(strategy);

      const version = computer.computeVersionString(mockContext);

      expect(version).toBe('abcdef12');
    });

    it('should use custom hash length', () => {
      const strategy = VersioningStrategy.create('{commit-hash:12}');
      const computer = new VersionComputer(strategy);

      const version = computer.computeVersionString(mockContext);

      expect(version).toBe('abcdef123456');
    });
  });

  describe('build number strategy', () => {
    it('should use build number in version', () => {
      const strategy = VersioningStrategy.buildNumber();
      const computer = new VersionComputer(strategy);

      const version = computer.computeVersionString(mockContext);

      expect(version).toBe('build-42-abcdef12');
    });
  });

  describe('branch replacement', () => {
    it('should sanitize branch name', () => {
      const strategy = VersioningStrategy.create('{branch}');
      const computer = new VersionComputer(strategy);

      const version = computer.computeVersionString(mockContext);

      expect(version).toBe('feature-test-branch');
    });

    it('should remove special characters from branch', () => {
      const strategy = VersioningStrategy.create('{branch}');
      const computer = new VersionComputer(strategy);

      const contextSpecialBranch = {
        ...mockContext,
        gitInfo: GitInfoHelper.create({
          commitHash: 'abc123',
          branch: 'feature/test@branch#123',
          commitCount: 42,
        }),
      };

      const version = computer.computeVersionString(contextSpecialBranch);

      expect(version).toBe('feature-test-branch-123');
    });
  });

  describe('composite strategy', () => {
    it('should combine multiple components', () => {
      const strategy = VersioningStrategy.packageWithBranch();
      const computer = new VersionComputer(strategy);

      const version = computer.computeVersionString(mockContext);

      expect(version).toBe('1.2.3-feature-test-branch.42');
    });

    it('should handle semantic with patch', () => {
      const strategy = VersioningStrategy.semanticWithPatch();
      const computer = new VersionComputer(strategy);

      const version = computer.computeVersionString(mockContext);

      expect(version).toBe('1.2.3.42');
    });
  });

  describe('compute (VersionInfo)', () => {
    it('should create complete VersionInfo', () => {
      const strategy = VersioningStrategy.gitTag();
      const computer = new VersionComputer(strategy);

      const versionInfo = computer.compute(mockContext);

      expect(versionInfo.version).toBe('1.2.3');
      expect(versionInfo.commitHash).toBe('abcdef1234567890');
      expect(versionInfo.branch).toBe('feature/test-branch');
      expect(versionInfo.tag).toBe('v1.2.3');
      expect(versionInfo.commitCount).toBe(42);
      expect(versionInfo.environment).toBe('production');
      expect(versionInfo.buildNumber).toBe('123');
      expect(versionInfo.packageVersion).toBe('1.2.3');
    });

    it('should include repository URL when provided', () => {
      const strategy = VersioningStrategy.gitTag();
      const computer = new VersionComputer(strategy);

      const contextWithRepo = {
        ...mockContext,
        repositoryUrl: 'https://github.com/test/repo',
      };

      const versionInfo = computer.compute(contextWithRepo);

      expect(versionInfo.repositoryUrl).toBe('https://github.com/test/repo');
    });
  });

  describe('inline padding specification', () => {
    it('should support inline padding in commit count', () => {
      const strategy = VersioningStrategy.create('v{commit-count:5}');
      const computer = new VersionComputer(strategy);

      const version = computer.computeVersionString(mockContext);

      expect(version).toBe('v00042');
    });

    it('should support multiple commit count placeholders with different padding', () => {
      const strategy = VersioningStrategy.create('{commit-count:3}-{commit-count:5}');
      const computer = new VersionComputer(strategy);

      const version = computer.computeVersionString(mockContext);

      expect(version).toBe('042-00042');
    });
  });
});
