import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { GitInfoHelper } from '../../src/versioning/git-info';
import { VersionInfo } from '../../src/versioning/version-info';
import { VersionOutputs } from '../../src/versioning/version-outputs';

describe('VersionOutputs', () => {
  let stack: cdk.Stack;
  let versionInfo: VersionInfo;

  beforeEach(() => {
    stack = new cdk.Stack();
    versionInfo = VersionInfo.create({
      version: '1.2.3',
      gitInfo: GitInfoHelper.create({
        commitHash: 'abcdef1234567890',
        branch: 'main',
        tag: 'v1.2.3',
        commitCount: 42,
      }),
      environment: 'production',
      packageVersion: '1.2.3',
      deploymentTime: '2024-01-15T10:00:00Z',
      repositoryUrl: 'https://github.com/test/repo',
    });
  });

  describe('CloudFormation outputs', () => {
    it('should create CloudFormation outputs by default', () => {
      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo,
      });

      const template = Template.fromStack(stack);
      const outputs = template.findOutputs('*');

      // Check that we have the expected number of outputs
      expect(Object.keys(outputs).length).toBe(8);

      // Check each output exists with correct properties
      const outputValues = Object.values(outputs);

      expect(outputValues).toContainEqual(
        expect.objectContaining({
          Value: '1.2.3',
          Description: 'Deployment version',
        }),
      );

      expect(outputValues).toContainEqual(
        expect.objectContaining({
          Value: 'abcdef1234567890',
          Description: 'Git commit hash',
        }),
      );

      expect(outputValues).toContainEqual(
        expect.objectContaining({
          Value: 'main',
          Description: 'Git branch',
        }),
      );

      expect(outputValues).toContainEqual(
        expect.objectContaining({
          Value: '42',
          Description: 'Git commit count',
        }),
      );

      expect(outputValues).toContainEqual(
        expect.objectContaining({
          Value: '2024-01-15T10:00:00Z',
          Description: 'Deployment timestamp',
        }),
      );

      expect(outputValues).toContainEqual(
        expect.objectContaining({
          Value: 'production',
          Description: 'Deployment environment',
        }),
      );
    });

    it('should create tag output when tag is present', () => {
      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo,
      });

      const template = Template.fromStack(stack);
      const outputs = Object.values(template.findOutputs('*'));

      expect(outputs).toContainEqual(
        expect.objectContaining({
          Value: 'v1.2.3',
          Description: 'Git tag',
        }),
      );
    });

    it('should create package version output when present', () => {
      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo,
      });

      const template = Template.fromStack(stack);
      const outputs = Object.values(template.findOutputs('*'));

      expect(outputs).toContainEqual(
        expect.objectContaining({
          Value: '1.2.3',
          Description: 'Package version from package.json',
        }),
      );
    });

    it('should not create outputs when disabled', () => {
      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo,
        cloudFormation: { enabled: false },
      });

      const template = Template.fromStack(stack);
      const outputs = template.toJSON().Outputs || {};

      expect(Object.keys(outputs).length).toBe(0);
    });

    it('should create exports when enabled', () => {
      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo,
        cloudFormation: {
          enabled: true,
          export: true,
          exportNameTemplate: '{environment}-version',
        },
      });

      const template = Template.fromStack(stack);
      const outputs = Object.values(template.findOutputs('*'));

      expect(outputs).toContainEqual(
        expect.objectContaining({
          Value: '1.2.3',
          Description: 'Deployment version',
          Export: {
            Name: 'production-version-version',
          },
        }),
      );
    });

    it('should use custom output prefix', () => {
      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo,
        outputPrefix: 'App',
      });

      const template = Template.fromStack(stack);
      const outputs = Object.values(template.findOutputs('*'));

      // Just verify that the version output exists
      expect(outputs).toContainEqual(
        expect.objectContaining({
          Value: '1.2.3',
        }),
      );
    });
  });

  describe('SSM Parameter Store outputs', () => {
    it('should not create parameters by default', () => {
      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo,
      });

      const template = Template.fromStack(stack);
      const parameters = template.findResources('AWS::SSM::Parameter');

      expect(Object.keys(parameters).length).toBe(0);
    });

    it('should create single JSON parameter when not split', () => {
      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo,
        parameterStore: {
          enabled: true,
          basePath: '/myapp/version',
        },
      });

      const template = Template.fromStack(stack);

      template.hasResourceProperties('AWS::SSM::Parameter', {
        Name: '/myapp/version',
        Type: 'String',
        Description: 'Version information (JSON)',
      });

      const parameters = template.findResources('AWS::SSM::Parameter');
      expect(Object.keys(parameters).length).toBe(1);
    });

    it('should create split parameters when enabled', () => {
      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo,
        parameterStore: {
          enabled: true,
          basePath: '/myapp/version',
          splitParameters: true,
        },
      });

      const template = Template.fromStack(stack);

      template.hasResourceProperties('AWS::SSM::Parameter', {
        Name: '/myapp/version/version',
        Value: '1.2.3',
        Description: 'Deployment version',
      });

      template.hasResourceProperties('AWS::SSM::Parameter', {
        Name: '/myapp/version/commit-hash',
        Value: 'abcdef1234567890',
        Description: 'Git commit hash',
      });

      template.hasResourceProperties('AWS::SSM::Parameter', {
        Name: '/myapp/version/branch',
        Value: 'main',
        Description: 'Git branch',
      });

      template.hasResourceProperties('AWS::SSM::Parameter', {
        Name: '/myapp/version/commit-count',
        Value: '42',
        Description: 'Git commit count',
      });

      template.hasResourceProperties('AWS::SSM::Parameter', {
        Name: '/myapp/version/deployment-time',
        Value: '2024-01-15T10:00:00Z',
        Description: 'Deployment timestamp',
      });

      template.hasResourceProperties('AWS::SSM::Parameter', {
        Name: '/myapp/version/environment',
        Value: 'production',
        Description: 'Deployment environment',
      });
    });

    it('should create tag parameter when tag is present and split', () => {
      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo,
        parameterStore: {
          enabled: true,
          basePath: '/myapp/version',
          splitParameters: true,
        },
      });

      const template = Template.fromStack(stack);

      template.hasResourceProperties('AWS::SSM::Parameter', {
        Name: '/myapp/version/tag',
        Value: 'v1.2.3',
        Description: 'Git tag',
      });
    });

    it('should use default base path', () => {
      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo,
        parameterStore: {
          enabled: true,
        },
      });

      const template = Template.fromStack(stack);

      template.hasResourceProperties('AWS::SSM::Parameter', {
        Name: '/version',
      });
    });

    it('should use custom description', () => {
      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo,
        parameterStore: {
          enabled: true,
          description: 'Custom description',
        },
      });

      const template = Template.fromStack(stack);

      template.hasResourceProperties('AWS::SSM::Parameter', {
        Description: 'Custom description',
      });
    });
  });

  describe('combined outputs', () => {
    it('should create both CloudFormation and SSM outputs', () => {
      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo,
        cloudFormation: { enabled: true },
        parameterStore: {
          enabled: true,
          basePath: '/app/version',
        },
      });

      const template = Template.fromStack(stack);

      // Check CloudFormation outputs
      const outputs = Object.values(template.findOutputs('*'));
      expect(outputs).toContainEqual(
        expect.objectContaining({
          Value: '1.2.3',
        }),
      );

      // Check SSM parameter
      template.hasResourceProperties('AWS::SSM::Parameter', {
        Name: '/app/version',
      });
    });
  });

  describe('version info without optional fields', () => {
    it('should handle version info without tag', () => {
      const versionInfoNoTag = VersionInfo.create({
        version: '1.2.3-dev',
        gitInfo: GitInfoHelper.create({
          commitHash: 'abc123',
          branch: 'develop',
          commitCount: 42,
        }),
        environment: 'development',
      });

      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo: versionInfoNoTag,
      });

      const template = Template.fromStack(stack);
      const outputs = template.toJSON().Outputs || {};

      expect(outputs.VersionTag).toBeUndefined();
    });

    it('should handle version info without package version', () => {
      const versionInfoNoPackage = VersionInfo.create({
        version: '1.2.3',
        gitInfo: GitInfoHelper.create({
          commitHash: 'abc123',
          branch: 'main',
          commitCount: 42,
        }),
        environment: 'production',
      });

      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo: versionInfoNoPackage,
      });

      const template = Template.fromStack(stack);
      const outputs = template.toJSON().Outputs || {};

      expect(outputs.VersionPackageVersion).toBeUndefined();
    });
  });

  describe('stack metadata', () => {
    it('should add version info as stack metadata with default key', () => {
      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo,
      });

      const template = Template.fromStack(stack);
      const metadata = template.toJSON().Metadata;

      expect(metadata).toBeDefined();
      expect(metadata.Version).toBeDefined();
      expect(metadata.Version).toMatchObject({
        version: '1.2.3',
        commitHash: 'abcdef1234567890',
        branch: 'main',
        tag: 'v1.2.3',
        commitCount: 42,
        environment: 'production',
        packageVersion: '1.2.3',
        deploymentTime: '2024-01-15T10:00:00Z',
      });
    });

    it('should use custom metadataKey when provided', () => {
      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo,
        metadataKey: 'CustomVersion',
      });

      const template = Template.fromStack(stack);
      const metadata = template.toJSON().Metadata;

      expect(metadata).toBeDefined();
      expect(metadata.CustomVersion).toBeDefined();
      expect(metadata.CustomVersion.version).toBe('1.2.3');
      expect(metadata.Version).toBeUndefined();
    });

    it('should fallback to outputPrefix when metadataKey is not provided', () => {
      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo,
        outputPrefix: 'App',
      });

      const template = Template.fromStack(stack);
      const metadata = template.toJSON().Metadata;

      expect(metadata).toBeDefined();
      expect(metadata.App).toBeDefined();
      expect(metadata.App.version).toBe('1.2.3');
    });

    it('should prefer metadataKey over outputPrefix', () => {
      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo,
        metadataKey: 'SpecificKey',
        outputPrefix: 'App',
      });

      const template = Template.fromStack(stack);
      const metadata = template.toJSON().Metadata;

      expect(metadata).toBeDefined();
      expect(metadata.SpecificKey).toBeDefined();
      expect(metadata.App).toBeUndefined();
      expect(metadata.Version).toBeUndefined();
    });

    it('should include all version info fields in metadata', () => {
      const fullVersionInfo = VersionInfo.create({
        version: '2.0.0',
        gitInfo: GitInfoHelper.create({
          commitHash: 'def4567890123456',
          branch: 'release/2.0',
          tag: 'v2.0.0',
          commitCount: 100,
        }),
        environment: 'staging',
        packageVersion: '2.0.0',
        deploymentTime: '2024-02-01T15:30:00Z',
        repositoryUrl: 'https://github.com/example/repo',
        buildNumber: '123',
        pipelineVersion: 'pipeline-v1',
      });

      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo: fullVersionInfo,
      });

      const template = Template.fromStack(stack);
      const metadata = template.toJSON().Metadata;

      expect(metadata.Version).toMatchObject({
        version: '2.0.0',
        commitHash: 'def4567890123456',
        shortCommitHash: 'def45678',
        branch: 'release/2.0',
        tag: 'v2.0.0',
        commitCount: 100,
        environment: 'staging',
        packageVersion: '2.0.0',
        deploymentTime: '2024-02-01T15:30:00Z',
        repositoryUrl: 'https://github.com/example/repo',
        buildNumber: '123',
        pipelineVersion: 'pipeline-v1',
      });
    });

    it('should handle version info without optional fields in metadata', () => {
      const minimalVersionInfo = VersionInfo.create({
        version: '1.0.0',
        gitInfo: GitInfoHelper.create({
          commitHash: 'abc123',
          branch: 'main',
          commitCount: 10,
        }),
        environment: 'dev',
      });

      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo: minimalVersionInfo,
      });

      const template = Template.fromStack(stack);
      const metadata = template.toJSON().Metadata;

      expect(metadata.Version).toBeDefined();
      expect(metadata.Version.version).toBe('1.0.0');
      expect(metadata.Version.tag).toBeUndefined();
      expect(metadata.Version.packageVersion).toBeUndefined();
      expect(metadata.Version.repositoryUrl).toBeUndefined();
    });

    it('should add metadata even when CloudFormation outputs are disabled', () => {
      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo,
        cloudFormation: { enabled: false },
      });

      const template = Template.fromStack(stack);
      const metadata = template.toJSON().Metadata;
      const outputs = template.toJSON().Outputs || {};

      // No CloudFormation outputs
      expect(Object.keys(outputs).length).toBe(0);

      // But metadata should still exist
      expect(metadata.Version).toBeDefined();
      expect(metadata.Version.version).toBe('1.2.3');
    });

    it('should add metadata even when only SSM parameters are enabled', () => {
      new VersionOutputs(stack, 'VersionOutputs', {
        versionInfo,
        cloudFormation: { enabled: false },
        parameterStore: {
          enabled: true,
          basePath: '/app/version',
        },
      });

      const template = Template.fromStack(stack);
      const metadata = template.toJSON().Metadata;

      // Metadata should exist regardless of output configuration
      expect(metadata.Version).toBeDefined();
      expect(metadata.Version.version).toBe('1.2.3');
    });
  });
});
