import { VersioningStrategy } from '../../src/versioning/strategy';

describe('VersioningStrategy', () => {
  describe('create', () => {
    it('should create custom strategy', () => {
      const strategy = VersioningStrategy.create('{version}-{branch}', {
        commitCount: { mode: 'all', padding: 0 },
      });

      expect(strategy.format).toBe('{version}-{branch}');
      expect(strategy.components.commitCount?.mode).toBe('all');
    });

    it('should create strategy without components', () => {
      const strategy = VersioningStrategy.create('{commit-hash}');

      expect(strategy.format).toBe('{commit-hash}');
      expect(strategy.components).toEqual({});
    });
  });

  describe('buildNumber', () => {
    it('should create build number strategy with defaults', () => {
      const strategy = VersioningStrategy.buildNumber();

      expect(strategy.format).toBe('build-{commit-count}-{commit-hash:8}');
      expect(strategy.components.commitCount?.mode).toBe('all');
      expect(strategy.components.commitCount?.padding).toBe(0);
    });

    it('should accept custom config', () => {
      const strategy = VersioningStrategy.buildNumber({ envVar: 'MY_BUILD_NUMBER' });

      expect(strategy.components.buildNumber?.envVar).toBe('MY_BUILD_NUMBER');
    });
  });

  describe('gitTag', () => {
    it('should create git tag strategy with defaults', () => {
      const strategy = VersioningStrategy.gitTag();

      expect(strategy.format).toBe('{git-tag}');
      expect(strategy.components.gitTag?.prefix).toBe('v');
      expect(strategy.components.gitTag?.pattern).toBe('*.*.*');
      expect(strategy.components.gitTag?.countCommitsSince).toBe(true);
    });

    it('should accept custom prefix', () => {
      const strategy = VersioningStrategy.gitTag({ prefix: 'release-' });

      expect(strategy.components.gitTag?.prefix).toBe('release-');
    });

    it('should accept custom pattern', () => {
      const strategy = VersioningStrategy.gitTag({ pattern: 'v*' });

      expect(strategy.components.gitTag?.pattern).toBe('v*');
    });
  });

  describe('packageJson', () => {
    it('should create package.json strategy with defaults', () => {
      const strategy = VersioningStrategy.packageJson();

      expect(strategy.format).toBe('{package-version}');
      expect(strategy.components.packageJson?.includePrerelease).toBe(true);
    });

    it('should accept custom config', () => {
      const strategy = VersioningStrategy.packageJson({ includePrerelease: false });

      expect(strategy.components.packageJson?.includePrerelease).toBe(false);
    });
  });

  describe('commitCount', () => {
    it('should create commit count strategy with defaults', () => {
      const strategy = VersioningStrategy.commitCount();

      expect(strategy.format).toBe('0.0.{commit-count}');
      expect(strategy.components.commitCount?.mode).toBe('all');
      expect(strategy.components.commitCount?.padding).toBe(0);
    });

    it('should accept custom mode', () => {
      const strategy = VersioningStrategy.commitCount({ mode: 'since-tag' });

      expect(strategy.components.commitCount?.mode).toBe('since-tag');
    });

    it('should accept custom padding', () => {
      const strategy = VersioningStrategy.commitCount({ padding: 5 });

      expect(strategy.components.commitCount?.padding).toBe(5);
    });
  });

  describe('commitHash', () => {
    it('should create commit hash strategy with default length', () => {
      const strategy = VersioningStrategy.commitHash();

      expect(strategy.format).toBe('{commit-hash:8}');
    });
  });

  describe('gitTagWithDevVersions', () => {
    it('should create strategy with dev version support', () => {
      const strategy = VersioningStrategy.gitTagWithDevVersions();

      expect(strategy.format).toBe('{git-tag}');
      expect(strategy.components.gitTag?.countCommitsSince).toBe(true);
      expect(strategy.components.commitCount?.mode).toBe('since-tag');
    });
  });

  describe('packageWithBranch', () => {
    it('should create package with branch strategy', () => {
      const strategy = VersioningStrategy.packageWithBranch();

      expect(strategy.format).toBe('{package-version}-{branch}.{commit-count}');
      expect(strategy.components.packageJson?.includePrerelease).toBe(true);
      expect(strategy.components.commitCount?.mode).toBe('all');
    });
  });

  describe('semanticWithPatch', () => {
    it('should create semantic versioning with patch strategy', () => {
      const strategy = VersioningStrategy.semanticWithPatch();

      expect(strategy.format).toBe('{package-version}.{commit-count}');
      expect(strategy.components.packageJson?.includePrerelease).toBe(false);
      expect(strategy.components.commitCount?.mode).toBe('all');
    });
  });
});
