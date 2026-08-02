# cdk-devops

A collection of AWS CDK constructs for DevOps automation, providing features like versioning and deployment metadata capabilities for your CDK applications.

## Installation

```bash
npm install cdk-devops
```

## Features

### Versioning

Compute and track version information for your CDK deployments. Supports multiple versioning strategies including git tags, package.json versions, commit counts, and custom formats.

```typescript
import { VersioningStrategy, VersionInfo, VersionOutputs } from 'cdk-devops';

// Use a pre-built strategy
const strategy = VersioningStrategy.gitTag();

// Create version info from environment
const versionInfo = VersionInfo.fromEnvironment('1.0.0', 'production');

// Output version to CloudFormation and SSM Parameter Store
new VersionOutputs(stack, 'VersionOutputs', {
  versionInfo,
  cloudFormation: { enabled: true },
  parameterStore: { enabled: true, basePath: '/myapp/version' },
});
```

For detailed documentation, see [Versioning Guide](docs/VERSIONING.md).

### Stack Metadata

Add repository and CI/CD pipeline metadata to your CloudFormation stacks, making it easy to track deployments back to their source code and build pipelines.

```typescript
import { StackMetadata } from 'cdk-devops';

// Automatically extracts repo and pipeline info from CI/CD environment
new StackMetadata(stack, 'Metadata');
```

Works out of the box with GitHub Actions, GitLab CI, AWS CodeBuild, and generic CI/CD systems.

For detailed documentation, see [Metadata Guide](docs/METADATA.md).

## CLI Tools

### compute-version

A CLI utility for computing versions based on git information:

```bash
# Basic usage (writes to .tmp/version.json)
npx compute-version '{"format":"{commit-count}","components":{}}'

# Custom output path
npx compute-version --output build/version.json '{"format":"{git-tag}","components":{}}'
```

The version artifact is written to `.tmp/version.json` by default. This path is
gitignored and safe for all shell emulators (Yarn Berry, pnpm, Bun).

You can override the output path with the `--output` (or `-o`) flag, or via the
`VERSION_OUTPUT_PATH` environment variable.

> **Migration note:** Previous versions wrote to `~version.json`. That path
> caused tilde-expansion failures in non-bash shell emulators. The CLI still
> reads `~version.json` as a fallback (with a deprecation warning), but no
> longer writes to it. Update any scripts that reference `~version.json` to
> use `.tmp/version.json` instead.

## API Reference

For complete API documentation, see [API.md](docs/API.md).

## License

Apache-2.0
