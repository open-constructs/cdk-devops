# Versioning Guide

The versioning module provides tools for computing, tracking, and outputting version information for your CDK deployments.

## Quick Start

```typescript
import * as cdk from 'aws-cdk-lib';
import { VersionInfo, VersionOutputs, VersioningStrategy } from 'cdk-devops';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'MyStack');

// Create version info from environment
const versionInfo = VersionInfo.fromEnvironment('1.0.0', 'production');

// Output version information
new VersionOutputs(stack, 'VersionOutputs', {
  versionInfo,
  cloudFormation: { enabled: true },
  parameterStore: { enabled: true, basePath: '/myapp/version' },
});

app.synth();
```

## Versioning Strategies

The module provides several pre-built versioning strategies:

### Git Tag Strategy

Uses git tags as the version source. If the current commit is not on a tag, it appends the commit count since the last tag.

```typescript
const strategy = VersioningStrategy.gitTag({
  prefix: 'v',           // Strip 'v' prefix from tags (e.g., v1.2.3 -> 1.2.3)
  pattern: '*.*.*',      // Match semver tags
  countCommitsSince: true,
});
```

### Package.json Strategy

Uses the version from package.json:

```typescript
const strategy = VersioningStrategy.packageJson({
  includePrerelease: true,
});
```

### Commit Count Strategy

Uses the total commit count as version:

```typescript
const strategy = VersioningStrategy.commitCount({
  mode: 'all',      // 'all', 'branch', or 'since-tag'
  padding: 5,       // Pad to 5 digits (e.g., 00042)
});
```

### Commit Hash Strategy

Uses the short commit hash as version:

```typescript
const strategy = VersioningStrategy.commitHash();
// Result: abc12345
```

### Build Number Strategy

Uses commit count and hash:

```typescript
const strategy = VersioningStrategy.buildNumber();
// Result: build-42-abc12345
```

### Git Tag with Dev Versions

Combines git tags with dev versions for non-tagged commits:

```typescript
const strategy = VersioningStrategy.gitTagWithDevVersions();
// On tag: 1.2.3
// After tag: 1.2.3-dev.5
```

### Package with Branch

Combines package version with branch and commit info:

```typescript
const strategy = VersioningStrategy.packageWithBranch();
// Result: 1.0.0-main.42
```

### Semantic with Patch

Appends commit count as patch version:

```typescript
const strategy = VersioningStrategy.semanticWithPatch();
// Result: 1.0.42
```

### Custom Strategy

Create a custom format using placeholders:

```typescript
const strategy = VersioningStrategy.create(
  '{package-version}-{branch}.{commit-count}+{commit-hash:8}',
  {
    commitCount: { mode: 'all' },
    packageJson: { includePrerelease: true },
  }
);
```

**Available placeholders:**
- `{git-tag}` - Git tag (if available)
- `{package-version}` - Version from package.json
- `{commit-count}` - Commit count
- `{commit-hash}` or `{commit-hash:N}` - Full or N-character commit hash
- `{branch}` - Current branch name
- `{build-number}` - Build number from environment

## Version Information

The `VersionInfo` class holds comprehensive version and deployment information:

```typescript
const versionInfo = VersionInfo.fromEnvironment('1.0.0', 'production');

console.log(versionInfo.version);        // Computed version
console.log(versionInfo.commitHash);     // Full commit hash
console.log(versionInfo.shortCommitHash); // 8-char commit hash
console.log(versionInfo.branch);         // Branch name
console.log(versionInfo.tag);            // Git tag (if on a tag)
console.log(versionInfo.commitCount);    // Total commit count
console.log(versionInfo.environment);    // Environment name
console.log(versionInfo.deploymentTime); // Deployment timestamp
console.log(versionInfo.deploymentUser); // User who triggered deployment
```

### Creating Version Info

**From environment:**

```typescript
const versionInfo = VersionInfo.fromEnvironment('1.0.0', 'production');
```

**With builder:**

```typescript
import { VersionInfoBuilder, GitInfoHelper } from 'cdk-devops';

const versionInfo = new VersionInfoBuilder()
  .withVersion('1.0.0')
  .withGitInfo(GitInfoHelper.fromEnvironment())
  .withEnvironment('production')
  .withDeploymentUser('ci-bot')
  .buildVersionInfo();
```

**From props:**

```typescript
const versionInfo = VersionInfo.create({
  version: '1.0.0',
  gitInfo: {
    commitHash: 'abc123def456789',
    shortCommitHash: 'abc123de',
    branch: 'main',
    commitCount: 42,
  },
  environment: 'production',
});
```

## Version Outputs

The `VersionOutputs` construct creates CloudFormation outputs and SSM parameters for version information.

### CloudFormation Outputs

```typescript
new VersionOutputs(stack, 'VersionOutputs', {
  versionInfo,
  cloudFormation: {
    enabled: true,
    export: true,                            // Export for cross-stack references
    exportNameTemplate: '{environment}-version',
  },
});
```

Creates outputs for:
- Version string
- Commit hash
- Branch
- Commit count
- Deployment time
- Environment
- Tag (if available)
- Package version (if available)

### SSM Parameter Store

```typescript
new VersionOutputs(stack, 'VersionOutputs', {
  versionInfo,
  parameterStore: {
    enabled: true,
    basePath: '/myapp/production/version',
    splitParameters: false,  // Single JSON parameter
    description: 'Version information',
  },
});
```

With `splitParameters: true`, creates individual parameters:
- `/myapp/production/version/version`
- `/myapp/production/version/commit-hash`
- `/myapp/production/version/branch`
- `/myapp/production/version/commit-count`
- `/myapp/production/version/deployment-time`
- `/myapp/production/version/environment`

### Using Factory Methods

```typescript
import { VersioningOutputsFactory } from 'cdk-devops';

// Standard: CloudFormation + single SSM parameter
const config = VersioningOutputsFactory.standard();

// CloudFormation only
const config = VersioningOutputsFactory.cloudFormationOnly({
  exportName: 'MyApp-Version',
});

// Hierarchical SSM parameters
const config = VersioningOutputsFactory.hierarchicalParameters('/myapp/version', {
  includeCloudFormation: true,
});

// Minimal: CloudFormation outputs only
const config = VersioningOutputsFactory.minimal();
```

## CLI Usage

The `compute-version` CLI computes version information from git and writes it to
a JSON artifact file.

```bash
# Basic usage — writes to .tmp/version.json (default)
npx compute-version '{"format":"{commit-count}","components":{}}'

# Custom strategy
npx compute-version '{"format":"{git-tag}","components":{"commitCount":{"mode":"all"}}}'

# Override output path
npx compute-version --output build/version.json '{"format":"{commit-count}","components":{}}'

# Or via environment variable
VERSION_OUTPUT_PATH=build/version.json npx compute-version '{"format":"{commit-count}","components":{}}'
```

### Version Artifact

| Setting | Value |
|---------|-------|
| Default path | `.tmp/version.json` |
| Override flag | `--output <path>` / `-o <path>` |
| Environment variable | `VERSION_OUTPUT_PATH` |
| Gitignored | Yes (`.tmp/` is excluded) |

The artifact is a JSON file containing all computed version fields (version,
commitHash, shortCommitHash, branch, tag, commitCount, environment, etc.).

**Path validation:** The CLI rejects output paths whose filename starts with
`~`, `-`, or `#` — characters that cause shell-parsing hazards (tilde expansion,
option-flag interpretation, comment stripping).

### Reading the Version File (Programmatic)

```typescript
import { readVersionFile } from 'cdk-devops';

// Reads from .tmp/version.json, falls back to ~version.json (deprecated)
const json = readVersionFile();
```

### Migration from `~version.json`

Previous versions wrote the artifact to `~version.json`. A leading `~` in a
filename triggers tilde expansion in shell emulators used by Yarn Berry, pnpm,
and Bun, causing the build step to abort with "Unsupported tilde expansion".

The new default is `.tmp/version.json`. The `readVersionFile()` helper still
reads `~version.json` as a fallback and emits a deprecation warning. This
fallback will be removed in the next minor release. Update any CI scripts or
projen tasks that reference `~version.json` to use `.tmp/version.json`.

## Environment Variables

The module automatically extracts information from these environment variables:

| Variable | Description |
|----------|-------------|
| `GITHUB_ACTOR` | GitHub Actions user |
| `GITLAB_USER_LOGIN` | GitLab CI user |
| `GITHUB_REPOSITORY` | GitHub repository |
| `GITHUB_RUN_NUMBER` | GitHub Actions run number |
| `CODEBUILD_BUILD_ID` | AWS CodeBuild build ID |
| `BUILD_NUMBER` | Generic build number |
| `PACKAGE_VERSION` | Package version |
| `DEPLOYMENT_TIME` | Deployment timestamp |
| `PIPELINE_VERSION` | Pipeline version/execution ID |

## API Reference

For complete API documentation, see [API.md](./API.md).

### Main Classes

- **`VersionInfo`** - Version information container
- **`VersionInfoBuilder`** - Builder for VersionInfo
- **`VersioningStrategy`** - Versioning strategy configuration
- **`VersionOutputs`** - CDK construct for version outputs
- **`VersioningOutputsFactory`** - Factory for output configurations
- **`GitInfoHelper`** - Helper for extracting git information

### Interfaces

- **`IVersionInfo`** - Version information interface
- **`IVersioningStrategy`** - Strategy interface
- **`VersioningOutputsConfig`** - Output configuration
- **`CloudFormationOutputConfig`** - CloudFormation output options
- **`ParameterStoreOutputConfig`** - SSM parameter options
