# Stack Metadata Usage Guide

The `StackMetadata` construct adds repository and CI/CD pipeline metadata to your CloudFormation stacks, making it easy to track deployments back to their source code and build pipelines.

## Quick Start

### Basic Usage (Automatic Detection)

The simplest way to use the construct is to let it automatically detect and extract information from your CI/CD environment:

```typescript
import * as cdk from 'aws-cdk-lib';
import { StackMetadata } from 'cdk-devops';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'MyStack');

// Automatically extracts repo and pipeline info from environment variables
new StackMetadata(stack, 'Metadata');

app.synth();
```

This works out of the box with:
- **GitHub Actions**
- **GitLab CI**
- **AWS CodeBuild**
- Generic CI/CD systems

### Using Static Factory Method

You can also use the `fromEnvironment` static method:

```typescript
StackMetadata.fromEnvironment(stack, 'Metadata');
```

## Advanced Usage

### Custom Environment Variables

If your CI/CD system uses non-standard environment variable names, you can override them:

```typescript
new StackMetadata(stack, 'Metadata', {
  customEnvVars: {
    repoOwner: 'MY_CUSTOM_OWNER_VAR',
    repoName: 'MY_CUSTOM_REPO_VAR',
    branch: 'MY_CUSTOM_BRANCH_VAR',
    commitHash: 'MY_CUSTOM_COMMIT_VAR',
    jobId: 'MY_CUSTOM_JOB_ID',
    jobUrl: 'MY_CUSTOM_JOB_URL',
    triggeredBy: 'MY_CUSTOM_USER',
    workflowName: 'MY_CUSTOM_WORKFLOW',
  },
});
```

### Manual Configuration

For complete control, provide the information manually:

```typescript
import { CiProvider } from 'cdk-devops';

new StackMetadata(stack, 'Metadata', {
  repoInfo: {
    provider: CiProvider.GITHUB,
    owner: 'my-organization',
    repository: 'my-repository',
    branch: 'main',
    commitHash: 'abc123def456789',
  },
  pipelineInfo: {
    provider: CiProvider.GITHUB,
    jobId: '12345',
    jobUrl: 'https://github.com/my-org/my-repo/actions/runs/12345',
    triggeredBy: 'developer@example.com',
    workflowName: 'Production Deployment',
    runNumber: '42',
  },
});
```

### Custom Metadata Keys

By default, the construct uses "Repo" and "Pipeline" as metadata keys. You can customize these:

```typescript
new StackMetadata(stack, 'Metadata', {
  repoMetadataKey: 'SourceCode',
  pipelineMetadataKey: 'BuildInfo',
});
```

## Supported CI/CD Platforms

### GitHub Actions

Automatically detected when `GITHUB_ACTIONS=true`. Extracts:

**Repository Info:**
- Owner from `GITHUB_REPOSITORY_OWNER` or `GITHUB_REPOSITORY`
- Repository name from `GITHUB_REPOSITORY`
- Branch from `GITHUB_REF` or `GITHUB_HEAD_REF`
- Commit hash from `GITHUB_SHA`

**Pipeline Info:**
- Job ID from `GITHUB_RUN_ID`
- Job URL (automatically constructed)
- Triggered by from `GITHUB_ACTOR`
- Workflow name from `GITHUB_WORKFLOW`
- Run number from `GITHUB_RUN_NUMBER`
- Run attempt from `GITHUB_RUN_ATTEMPT`
- Event from `GITHUB_EVENT_NAME`

### GitLab CI

Automatically detected when `GITLAB_CI=true`. Extracts:

**Repository Info:**
- Owner from `CI_PROJECT_NAMESPACE`
- Repository name from `CI_PROJECT_NAME`
- Branch from `CI_COMMIT_REF_NAME`
- Commit hash from `CI_COMMIT_SHA`

**Pipeline Info:**
- Job ID from `CI_JOB_ID` or `CI_PIPELINE_ID`
- Job URL from `CI_JOB_URL` or `CI_PIPELINE_URL`
- Triggered by from `GITLAB_USER_LOGIN` or `CI_COMMIT_AUTHOR`
- Workflow name from `CI_PROJECT_NAME`
- Run number from `CI_PIPELINE_IID`
- Event from `CI_PIPELINE_SOURCE`

### AWS CodeBuild

Automatically detected when `CODEBUILD_BUILD_ID` is present. Extracts:

**Repository Info:**
- Owner and repository parsed from `CODEBUILD_SOURCE_REPO_URL`
- Branch from `CODEBUILD_WEBHOOK_HEAD_REF` or `CODEBUILD_SOURCE_VERSION`
- Commit hash from `CODEBUILD_RESOLVED_SOURCE_VERSION`

**Pipeline Info:**
- Job ID from `CODEBUILD_BUILD_ID`
- Job URL (automatically constructed from ARN)
- Triggered by from `CODEBUILD_INITIATOR`
- Workflow name parsed from `CODEBUILD_BUILD_ARN`
- Build number from `CODEBUILD_BUILD_NUMBER`

### Generic CI/CD

Fallback support for any CI/CD system using standard environment variables:

- `REPO_OWNER`, `REPO_NAME`, `REPOSITORY`
- `BRANCH`, `GIT_BRANCH`
- `COMMIT_HASH`, `GIT_COMMIT`
- `BUILD_ID`, `JOB_ID`
- `BUILD_URL`, `JOB_URL`
- `BUILD_USER`, `USER`
- `WORKFLOW_NAME`, `PIPELINE_NAME`

## Output

The construct adds metadata to your CloudFormation template:

```json
{
  "Metadata": {
    "Repo": {
      "provider": "github",
      "owner": "open-constructs",
      "repository": "cdk-devops",
      "branch": "main",
      "commitHash": "abc123def456789"
    },
    "Pipeline": {
      "provider": "github",
      "jobId": "12345",
      "jobUrl": "https://github.com/open-constructs/cdk-devops/actions/runs/12345",
      "triggeredBy": "developer@example.com",
      "workflowName": "CI Pipeline",
      "runNumber": "42",
      "runAttempt": "1",
      "event": "push",
      "additionalInfo": {
        "job": "build",
        "action": "build-action",
        "ref": "refs/heads/main",
        "sha": "abc123def456789"
      }
    }
  }
}
```

## Accessing Metadata in Code

You can access the extracted metadata programmatically:

```typescript
const metadata = new StackMetadata(stack, 'Metadata');

const repoInfo = metadata.repoMetadata();
console.log(`Deployed from ${repoInfo.owner}/${repoInfo.repository}@${repoInfo.commitHash}`);

const pipelineInfo = metadata.pipelineMetadata();
console.log(`Build triggered by ${pipelineInfo.triggeredBy}`);
```

## API Reference

For complete API documentation, see [API.md](./API.md).

### Main Classes

- **`StackMetadata`** - CDK construct for adding metadata to stacks
- **`RepoInfoHelper`** - Helper for extracting repository information
- **`PipelineInfoHelper`** - Helper for extracting pipeline information

### Interfaces

- **`RepoInfo`** - Repository information interface
- **`PipelineInfo`** - Pipeline information interface
- **`CustomEnvVarConfig`** - Custom environment variable configuration

### Enums

- **`CiProvider`** - CI/CD provider enumeration (GITHUB, GITLAB, CODEBUILD, UNKNOWN)
