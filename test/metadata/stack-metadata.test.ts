import * as cdk from 'aws-cdk-lib';
import { StackMetadata } from '../../src/metadata/stack-metadata';
import { CiProvider } from '../../src/metadata/types';

describe('StackMetadata', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'TestStack');
  });

  describe('constructor with manual configuration', () => {
    it('should add metadata to stack with provided info', () => {
      new StackMetadata(stack, 'Metadata', {
        repoInfo: {
          provider: CiProvider.GITHUB,
          owner: 'my-org',
          repository: 'my-repo',
          branch: 'main',
          commitHash: 'abcdef1234567890',
        },
        pipelineInfo: {
          provider: CiProvider.GITHUB,
          jobId: '12345',
          jobUrl: 'https://github.com/my-org/my-repo/actions/runs/12345',
          triggeredBy: 'john-doe',
          runNumber: '42',
        },
      });

      const template = app.synth().getStackByName('TestStack').template;
      expect(template.Metadata).toBeDefined();
      expect(template.Metadata.Repo).toEqual({
        provider: 'github',
        owner: 'my-org',
        repository: 'my-repo',
        branch: 'main',
        commitHash: 'abcdef1234567890',
      });
      expect(template.Metadata.Pipeline).toEqual({
        provider: 'github',
        jobId: '12345',
        jobUrl: 'https://github.com/my-org/my-repo/actions/runs/12345',
        triggeredBy: 'john-doe',
        runNumber: '42',
      });
    });

    it('should use custom metadata keys', () => {
      new StackMetadata(stack, 'Metadata', {
        repoInfo: {
          provider: CiProvider.GITHUB,
          owner: 'my-org',
          repository: 'my-repo',
          branch: 'main',
          commitHash: 'abcdef1234567890',
        },
        pipelineInfo: {
          provider: CiProvider.GITHUB,
          jobId: '12345',
        },
        repoMetadataKey: 'CustomRepo',
        pipelineMetadataKey: 'CustomPipeline',
      });

      const template = app.synth().getStackByName('TestStack').template;
      expect(template.Metadata.CustomRepo).toBeDefined();
      expect(template.Metadata.CustomPipeline).toBeDefined();
      expect(template.Metadata.Repo).toBeUndefined();
      expect(template.Metadata.Pipeline).toBeUndefined();
    });

    it('should include all pipeline fields even when undefined', () => {
      new StackMetadata(stack, 'Metadata', {
        repoInfo: {
          provider: CiProvider.GITHUB,
          owner: 'my-org',
          repository: 'my-repo',
          branch: 'main',
          commitHash: 'abcdef1234567890',
        },
        pipelineInfo: {
          provider: CiProvider.GITHUB,
          jobId: '12345',
        },
      });

      const template = app.synth().getStackByName('TestStack').template;
      expect(template.Metadata.Pipeline.provider).toBe('github');
      expect(template.Metadata.Pipeline.jobId).toBe('12345');
    });
  });

  describe('fromEnvironment - GitHub', () => {
    beforeEach(() => {
      process.env.GITHUB_ACTIONS = 'true';
      process.env.GITHUB_REPOSITORY = 'test-org/test-repo';
      process.env.GITHUB_REF = 'refs/heads/feature-branch';
      process.env.GITHUB_SHA = 'abc123def456';
      process.env.GITHUB_RUN_ID = '98765';
      process.env.GITHUB_ACTOR = 'test-user';
      process.env.GITHUB_WORKFLOW = 'Test Workflow';
    });

    it('should extract metadata from GitHub Actions environment', () => {
      const metadata = StackMetadata.fromEnvironment(stack, 'Metadata');

      expect(metadata.repoInfo.provider).toBe(CiProvider.GITHUB);
      expect(metadata.repoInfo.repository).toBe('test-repo');
      expect(metadata.repoInfo.branch).toBe('feature-branch');
      expect(metadata.repoInfo.commitHash).toBe('abc123def456');
      expect(metadata.pipelineInfo.provider).toBe(CiProvider.GITHUB);
      expect(metadata.pipelineInfo.jobId).toBe('98765');
      expect(metadata.pipelineInfo.triggeredBy).toBe('test-user');
    });

    it('should add metadata to stack from environment', () => {
      StackMetadata.fromEnvironment(stack, 'Metadata');

      const template = app.synth().getStackByName('TestStack').template;
      expect(template.Metadata.Repo).toBeDefined();
      expect(template.Metadata.Repo.provider).toBe('github');
      expect(template.Metadata.Pipeline).toBeDefined();
      expect(template.Metadata.Pipeline.provider).toBe('github');
    });
  });

  describe('fromEnvironment - GitLab', () => {
    beforeEach(() => {
      process.env.GITLAB_CI = 'true';
      process.env.CI_PROJECT_PATH = 'test-group/test-project';
      process.env.CI_COMMIT_REF_NAME = 'main';
      process.env.CI_COMMIT_SHA = 'gitlab123abc';
      process.env.CI_JOB_ID = '54321';
      process.env.GITLAB_USER_LOGIN = 'gitlab-user';
    });

    it('should extract metadata from GitLab CI environment', () => {
      const metadata = StackMetadata.fromEnvironment(stack, 'Metadata');

      expect(metadata.repoInfo.provider).toBe(CiProvider.GITLAB);
      expect(metadata.repoInfo.repository).toBe('test-project');
      expect(metadata.repoInfo.branch).toBe('main');
      expect(metadata.repoInfo.commitHash).toBe('gitlab123abc');
      expect(metadata.pipelineInfo.provider).toBe(CiProvider.GITLAB);
      expect(metadata.pipelineInfo.jobId).toBe('54321');
      expect(metadata.pipelineInfo.triggeredBy).toBe('gitlab-user');
    });

    it('should add metadata to stack from environment', () => {
      StackMetadata.fromEnvironment(stack, 'Metadata');

      const template = app.synth().getStackByName('TestStack').template;
      expect(template.Metadata.Repo).toBeDefined();
      expect(template.Metadata.Repo.provider).toBe('gitlab');
      expect(template.Metadata.Pipeline).toBeDefined();
      expect(template.Metadata.Pipeline.provider).toBe('gitlab');
    });
  });

  describe('fromEnvironment - CodeBuild', () => {
    beforeEach(() => {
      process.env.CODEBUILD_BUILD_ID = 'codebuild-project:build-123';
      process.env.CODEBUILD_SOURCE_REPO_URL = 'https://github.com/test-org/test-repo.git';
      process.env.CODEBUILD_SOURCE_VERSION = 'develop';
      process.env.CODEBUILD_RESOLVED_SOURCE_VERSION = 'codebuild-commit-hash';
      process.env.CODEBUILD_INITIATOR = 'codebuild-user';
    });

    it('should extract metadata from CodeBuild environment', () => {
      const metadata = StackMetadata.fromEnvironment(stack, 'Metadata');

      expect(metadata.repoInfo.provider).toBe(CiProvider.CODEBUILD);
      expect(metadata.repoInfo.repository).toBe('test-repo');
      expect(metadata.repoInfo.branch).toBe('develop');
      expect(metadata.repoInfo.commitHash).toBe('codebuild-commit-hash');
      expect(metadata.pipelineInfo.provider).toBe(CiProvider.CODEBUILD);
      expect(metadata.pipelineInfo.jobId).toBe('codebuild-project:build-123');
      expect(metadata.pipelineInfo.triggeredBy).toBe('codebuild-user');
    });

    it('should add metadata to stack from environment', () => {
      StackMetadata.fromEnvironment(stack, 'Metadata');

      const template = app.synth().getStackByName('TestStack').template;
      expect(template.Metadata.Repo).toBeDefined();
      expect(template.Metadata.Repo.provider).toBe('codebuild');
      expect(template.Metadata.Pipeline).toBeDefined();
      expect(template.Metadata.Pipeline.provider).toBe('codebuild');
    });
  });

  describe('fromEnvironment with custom environment variables', () => {
    beforeEach(() => {
      process.env.GITHUB_ACTIONS = 'true';
      process.env.MY_CUSTOM_OWNER = 'custom-owner';
      process.env.MY_CUSTOM_REPO = 'custom-repo';
      process.env.MY_CUSTOM_BRANCH = 'custom-branch';
      process.env.MY_CUSTOM_COMMIT = 'custom-commit-hash';
      process.env.MY_CUSTOM_JOB_ID = 'custom-job-123';
      process.env.MY_CUSTOM_JOB_URL = 'https://custom.ci.com/job/123';
      process.env.MY_CUSTOM_USER = 'custom-user';
    });

    it('should use custom environment variables', () => {
      const metadata = StackMetadata.fromEnvironment(stack, 'Metadata', {
        repoOwner: 'MY_CUSTOM_OWNER',
        repoName: 'MY_CUSTOM_REPO',
        branch: 'MY_CUSTOM_BRANCH',
        commitHash: 'MY_CUSTOM_COMMIT',
        jobId: 'MY_CUSTOM_JOB_ID',
        jobUrl: 'MY_CUSTOM_JOB_URL',
        triggeredBy: 'MY_CUSTOM_USER',
      });

      expect(metadata.repoInfo.owner).toBe('custom-owner');
      expect(metadata.repoInfo.repository).toBe('custom-repo');
      expect(metadata.repoInfo.branch).toBe('custom-branch');
      expect(metadata.repoInfo.commitHash).toBe('custom-commit-hash');
      expect(metadata.pipelineInfo.jobId).toBe('custom-job-123');
      expect(metadata.pipelineInfo.jobUrl).toBe('https://custom.ci.com/job/123');
      expect(metadata.pipelineInfo.triggeredBy).toBe('custom-user');
    });
  });

});
