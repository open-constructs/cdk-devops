import * as cdk from 'aws-cdk-lib';
import { StackMetadata, CiProvider } from '../lib';

// Example 1: Automatically extract from environment
const app = new cdk.App();

const stack1 = new cdk.Stack(app, 'Stack1', {
  stackName: 'my-stack-auto',
});

// This will automatically extract repo and pipeline info from environment variables
new StackMetadata(stack1, 'Metadata');

// Example 2: Use custom environment variable names
const stack2 = new cdk.Stack(app, 'Stack2', {
  stackName: 'my-stack-custom',
});

new StackMetadata(stack2, 'Metadata', {
  customEnvVars: {
    repoOwner: 'MY_CUSTOM_OWNER',
    repoName: 'MY_CUSTOM_REPO',
    branch: 'MY_CUSTOM_BRANCH',
    commitHash: 'MY_CUSTOM_COMMIT',
    jobId: 'MY_CUSTOM_JOB_ID',
  },
});

// Example 3: Manually provide information
const stack3 = new cdk.Stack(app, 'Stack3', {
  stackName: 'my-stack-manual',
});

new StackMetadata(stack3, 'Metadata', {
  repoInfo: {
    provider: CiProvider.GITHUB,
    owner: 'open-constructs',
    repository: 'cdk-devops',
    branch: 'main',
    commitHash: 'abc123def456',
  },
  pipelineInfo: {
    provider: CiProvider.GITHUB,
    jobId: '12345',
    jobUrl: 'https://github.com/open-constructs/cdk-devops/actions/runs/12345',
    triggeredBy: 'developer@example.com',
    workflowName: 'CI Pipeline',
  },
});

// Example 4: Using the static fromEnvironment method
const stack4 = new cdk.Stack(app, 'Stack4', {
  stackName: 'my-stack-from-env',
});

StackMetadata.fromEnvironment(stack4, 'Metadata');

app.synth();
