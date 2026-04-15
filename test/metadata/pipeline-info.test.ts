import { PipelineInfoHelper } from '../../src/metadata/pipeline-info';
import { CiProvider } from '../../src/metadata/types';

describe('PipelineInfoHelper', () => {
  describe('create', () => {
    it('should create PipelineInfo with all properties', () => {
      const pipelineInfo = PipelineInfoHelper.create({
        provider: CiProvider.GITHUB,
        jobId: '12345',
        jobUrl: 'https://github.com/org/repo/actions/runs/12345',
        triggeredBy: 'user@example.com',
        runNumber: '42',
      });

      expect(pipelineInfo.provider).toBe(CiProvider.GITHUB);
      expect(pipelineInfo.jobId).toBe('12345');
      expect(pipelineInfo.jobUrl).toBe('https://github.com/org/repo/actions/runs/12345');
      expect(pipelineInfo.triggeredBy).toBe('user@example.com');
      expect(pipelineInfo.runNumber).toBe('42');
    });

    it('should create PipelineInfo with minimal properties', () => {
      const pipelineInfo = PipelineInfoHelper.create({
        provider: CiProvider.GITLAB,
      });

      expect(pipelineInfo.provider).toBe(CiProvider.GITLAB);
      expect(pipelineInfo.jobId).toBeUndefined();
      expect(pipelineInfo.jobUrl).toBeUndefined();
    });
  });

  describe('fromEnvironment - GitHub', () => {
    beforeEach(() => {
      process.env.GITHUB_ACTIONS = 'true';
    });

    it('should extract from GitHub Actions environment', () => {
      process.env.GITHUB_RUN_ID = '12345';
      process.env.GITHUB_REPOSITORY = 'my-org/my-repo';
      process.env.GITHUB_SERVER_URL = 'https://github.com';
      process.env.GITHUB_ACTOR = 'john-doe';
      process.env.GITHUB_RUN_NUMBER = '42';

      const pipelineInfo = PipelineInfoHelper.fromEnvironment();

      expect(pipelineInfo.provider).toBe(CiProvider.GITHUB);
      expect(pipelineInfo.jobId).toBe('12345');
      expect(pipelineInfo.jobUrl).toBe('https://github.com/my-org/my-repo/actions/runs/12345');
      expect(pipelineInfo.triggeredBy).toBe('john-doe');
      expect(pipelineInfo.runNumber).toBe('42');
    });

    it('should prefer GITHUB_TRIGGERING_ACTOR over GITHUB_ACTOR', () => {
      process.env.GITHUB_RUN_ID = '12345';
      process.env.GITHUB_ACTOR = 'john-doe';
      process.env.GITHUB_TRIGGERING_ACTOR = 'jane-smith';

      const pipelineInfo = PipelineInfoHelper.fromEnvironment();

      expect(pipelineInfo.triggeredBy).toBe('john-doe');
    });

    it('should use custom environment variables', () => {
      process.env.MY_CUSTOM_JOB_ID = 'custom-job-id';
      process.env.MY_CUSTOM_JOB_URL = 'https://custom.url/job/123';
      process.env.MY_CUSTOM_TRIGGERED_BY = 'custom-user';

      const pipelineInfo = PipelineInfoHelper.fromEnvironment({
        jobId: 'MY_CUSTOM_JOB_ID',
        jobUrl: 'MY_CUSTOM_JOB_URL',
        triggeredBy: 'MY_CUSTOM_TRIGGERED_BY',
      });

      expect(pipelineInfo.jobId).toBe('custom-job-id');
      expect(pipelineInfo.jobUrl).toBe('https://custom.url/job/123');
      expect(pipelineInfo.triggeredBy).toBe('custom-user');
    });
  });

  describe('fromEnvironment - GitLab', () => {
    beforeEach(() => {
      process.env.GITLAB_CI = 'true';
    });

    it('should extract from GitLab CI environment', () => {
      process.env.CI_JOB_ID = '67890';
      process.env.CI_PIPELINE_ID = '12345';
      process.env.CI_JOB_URL = 'https://gitlab.com/group/project/-/jobs/67890';
      process.env.CI_PIPELINE_URL = 'https://gitlab.com/group/project/-/pipelines/12345';
      process.env.GITLAB_USER_LOGIN = 'john.doe';
      process.env.CI_PIPELINE_IID = '42';

      const pipelineInfo = PipelineInfoHelper.fromEnvironment();

      expect(pipelineInfo.provider).toBe(CiProvider.GITLAB);
      expect(pipelineInfo.jobId).toBe('67890');
      expect(pipelineInfo.jobUrl).toBe('https://gitlab.com/group/project/-/jobs/67890');
      expect(pipelineInfo.triggeredBy).toBe('john.doe');
      expect(pipelineInfo.runNumber).toBe('42');
    });

    it('should fallback to CI_COMMIT_AUTHOR and GITLAB_USER_NAME', () => {
      process.env.CI_JOB_ID = '67890';
      process.env.CI_COMMIT_AUTHOR = 'John Doe <john@example.com>';
      process.env.GITLAB_USER_NAME = 'John Doe';

      const pipelineInfo = PipelineInfoHelper.fromEnvironment();

      expect(pipelineInfo.triggeredBy).toBe('John Doe <john@example.com>');
    });

    it('should prefer CI_JOB_ID over CI_PIPELINE_ID', () => {
      process.env.CI_JOB_ID = '67890';
      process.env.CI_PIPELINE_ID = '12345';

      const pipelineInfo = PipelineInfoHelper.fromEnvironment();

      expect(pipelineInfo.jobId).toBe('67890');
    });

    it('should use custom environment variables', () => {
      process.env.MY_CUSTOM_JOB_ID = 'custom-job-id';
      process.env.MY_CUSTOM_JOB_URL = 'https://custom.url/job/123';
      process.env.MY_CUSTOM_TRIGGERED_BY = 'custom-user';

      const pipelineInfo = PipelineInfoHelper.fromEnvironment({
        jobId: 'MY_CUSTOM_JOB_ID',
        jobUrl: 'MY_CUSTOM_JOB_URL',
        triggeredBy: 'MY_CUSTOM_TRIGGERED_BY',
      });

      expect(pipelineInfo.jobId).toBe('custom-job-id');
      expect(pipelineInfo.jobUrl).toBe('https://custom.url/job/123');
      expect(pipelineInfo.triggeredBy).toBe('custom-user');
    });
  });

  describe('fromEnvironment - CodeBuild', () => {
    beforeEach(() => {
      process.env.CODEBUILD_BUILD_ID = 'my-project:abc-123';
    });

    it('should extract from CodeBuild environment', () => {
      process.env.CODEBUILD_BUILD_ARN =
        'arn:aws:codebuild:us-east-1:123456789012:build/my-project:abc-123';
      process.env.CODEBUILD_BUILD_NUMBER = '42';
      process.env.CODEBUILD_INITIATOR = 'john-doe';

      const pipelineInfo = PipelineInfoHelper.fromEnvironment();

      expect(pipelineInfo.provider).toBe(CiProvider.CODEBUILD);
      expect(pipelineInfo.jobId).toBe('my-project:abc-123');
      expect(pipelineInfo.triggeredBy).toBe('john-doe');
      expect(pipelineInfo.runNumber).toBe('42');
    });

    it('should construct job URL from build ID and ARN', () => {
      process.env.CODEBUILD_BUILD_ID = 'my-project:abc-123';
      process.env.CODEBUILD_BUILD_ARN =
        'arn:aws:codebuild:us-west-2:123456789012:build/my-project:abc-123';

      const pipelineInfo = PipelineInfoHelper.fromEnvironment();

      expect(pipelineInfo.jobUrl).toContain('us-west-2');
      expect(pipelineInfo.jobUrl).toContain('my-project');
    });

    it('should use custom environment variables', () => {
      process.env.MY_CUSTOM_JOB_ID = 'custom-job-id';
      process.env.MY_CUSTOM_JOB_URL = 'https://custom.url/job/123';
      process.env.MY_CUSTOM_TRIGGERED_BY = 'custom-user';

      const pipelineInfo = PipelineInfoHelper.fromEnvironment({
        jobId: 'MY_CUSTOM_JOB_ID',
        jobUrl: 'MY_CUSTOM_JOB_URL',
        triggeredBy: 'MY_CUSTOM_TRIGGERED_BY',
      });

      expect(pipelineInfo.jobId).toBe('custom-job-id');
      expect(pipelineInfo.jobUrl).toBe('https://custom.url/job/123');
      expect(pipelineInfo.triggeredBy).toBe('custom-user');
    });
  });

  describe('fromEnvironment - Generic', () => {
    it('should extract from generic environment variables', () => {
      process.env.BUILD_ID = '12345';
      process.env.BUILD_URL = 'https://ci.example.com/build/12345';
      process.env.BUILD_USER = 'john-doe';
      process.env.BUILD_NUMBER = '42';

      const pipelineInfo = PipelineInfoHelper.fromEnvironment();

      expect(pipelineInfo.provider).toBe(CiProvider.UNKNOWN);
      expect(pipelineInfo.jobId).toBe('12345');
      expect(pipelineInfo.jobUrl).toBe('https://ci.example.com/build/12345');
      expect(pipelineInfo.triggeredBy).toBe('john-doe');
      expect(pipelineInfo.runNumber).toBe('42');
    });

    it('should use fallback environment variables', () => {
      process.env.JOB_ID = '67890';
      process.env.JOB_URL = 'https://jenkins.example.com/job/123';
      process.env.USER = 'jenkins-user';

      const pipelineInfo = PipelineInfoHelper.fromEnvironment();

      expect(pipelineInfo.jobId).toBe('67890');
      expect(pipelineInfo.jobUrl).toBe('https://jenkins.example.com/job/123');
      expect(pipelineInfo.triggeredBy).toBe('jenkins-user');
    });

    it('should handle missing values gracefully', () => {
      const pipelineInfo = PipelineInfoHelper.fromEnvironment();

      expect(pipelineInfo.provider).toBe(CiProvider.UNKNOWN);
      expect(pipelineInfo.jobId).toBeUndefined();
      expect(pipelineInfo.jobUrl).toBeUndefined();
      expect(pipelineInfo.triggeredBy).toBeUndefined();
    });
  });
});
