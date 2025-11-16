import {
  IVersioningStrategy,
  VersioningStrategyComponents,
  GitTagConfig,
  PackageJsonConfig,
  CommitCountConfig,
  BuildNumberConfig,
} from './types';

/**
 * Versioning strategy implementation
 */
export class VersioningStrategy implements IVersioningStrategy {
  /**
   * Create a custom versioning strategy
   */
  public static create(format: string, components: VersioningStrategyComponents = {}): VersioningStrategy {
    return new VersioningStrategy(format, components);
  }

  /**
   * Strategy using build number and commit information
   * Format: build-{commit-count}-{commit-hash:8}
   */
  public static buildNumber(config: BuildNumberConfig = {}): VersioningStrategy {
    return new VersioningStrategy(
      'build-{commit-count}-{commit-hash:8}',
      {
        buildNumber: config,
        commitCount: { mode: 'all', padding: 0 },
      },
    );
  }

  /**
   * Strategy using git tags as version source
   * Format: {git-tag} or {git-tag}-{commit-count} if not on a tag
   */
  public static gitTag(config: GitTagConfig = {}): VersioningStrategy {
    return new VersioningStrategy(
      '{git-tag}',
      {
        gitTag: {
          prefix: config.prefix ?? 'v',
          pattern: config.pattern ?? '*.*.*',
          countCommitsSince: config.countCommitsSince ?? true,
        },
      },
    );
  }

  /**
   * Strategy using package.json version
   * Format: {package-version}
   */
  public static packageJson(config: PackageJsonConfig = {}): VersioningStrategy {
    return new VersioningStrategy(
      '{package-version}',
      {
        packageJson: {
          includePrerelease: config.includePrerelease ?? true,
        },
      },
    );
  }

  /**
   * Strategy using commit count
   * Format: 0.0.{commit-count}
   */
  public static commitCount(config: CommitCountConfig = {}): VersioningStrategy {
    return new VersioningStrategy(
      '0.0.{commit-count}',
      {
        commitCount: {
          mode: config.mode ?? 'all',
          padding: config.padding ?? 0,
        },
      },
    );
  }

  /**
   * Strategy using commit hash
   * Format: {commit-hash:8}
   */
  public static commitHash(length: number = 8): VersioningStrategy {
    return new VersioningStrategy(`{commit-hash:${length}}`, {});
  }

  /**
   * Strategy combining git tag with commit count for non-tagged commits
   * Format: {git-tag} or {git-tag}-dev.{commit-count}
   */
  public static gitTagWithDevVersions(config: GitTagConfig = {}): VersioningStrategy {
    return new VersioningStrategy(
      '{git-tag}',
      {
        gitTag: {
          prefix: config.prefix ?? 'v',
          pattern: config.pattern ?? '*.*.*',
          countCommitsSince: true,
        },
        commitCount: { mode: 'since-tag', padding: 0 },
      },
    );
  }

  /**
   * Strategy combining package version with branch and commit info
   * Format: {package-version}-{branch}.{commit-count}
   */
  public static packageWithBranch(config: PackageJsonConfig = {}): VersioningStrategy {
    return new VersioningStrategy(
      '{package-version}-{branch}.{commit-count}',
      {
        packageJson: {
          includePrerelease: config.includePrerelease ?? true,
        },
        commitCount: { mode: 'all', padding: 0 },
      },
    );
  }

  /**
   * Semantic versioning strategy with automatic patch increment
   * Format: {package-version}.{commit-count}
   */
  public static semanticWithPatch(config: PackageJsonConfig = {}): VersioningStrategy {
    return new VersioningStrategy(
      '{package-version}.{commit-count}',
      {
        packageJson: {
          includePrerelease: config.includePrerelease ?? false,
        },
        commitCount: { mode: 'all', padding: 0 },
      },
    );
  }

  public readonly format: string;
  public readonly components: VersioningStrategyComponents;

  private constructor(format: string, components: VersioningStrategyComponents = {}) {
    this.format = format;
    this.components = components;
  }
}
