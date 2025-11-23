import * as cdk from 'aws-cdk-lib';
import { Stack } from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { CloudFormationOutputConfig, ParameterStoreOutputConfig } from './types';
import { VersionInfo } from './version-info';

/**
 * Props for VersionOutputs construct
 */
export interface VersionOutputsProps {
  /**
   * Version information to output
   */
  readonly versionInfo: VersionInfo;

  /**
   * CloudFormation output configuration
   * @default - CloudFormation outputs enabled
   */
  readonly cloudFormation?: CloudFormationOutputConfig;

  /**
   * SSM Parameter Store configuration
   * @default - Parameter Store disabled
   */
  readonly parameterStore?: ParameterStoreOutputConfig;

  /**
   * Prefix for output names
   * @default 'Version'
   */
  readonly outputPrefix?: string;

  /**
   * Metadata key
   * @default 'Version'
   */
  readonly metadataKey?: string;
}

/**
 * Construct for creating version outputs in CloudFormation and SSM Parameter Store
 */
export class VersionOutputs extends Construct {
  /**
   * The version information
   */
  public readonly versionInfo: VersionInfo;

  /**
   * CloudFormation outputs (if enabled)
   */
  public readonly outputs?: { [key: string]: cdk.CfnOutput };

  /**
   * SSM Parameters (if enabled)
   */
  public readonly parameters?: { [key: string]: ssm.StringParameter };

  constructor(scope: Construct, id: string, props: VersionOutputsProps) {
    super(scope, id);

    this.versionInfo = props.versionInfo;

    // Create CloudFormation outputs if enabled
    if (props.cloudFormation?.enabled !== false) {
      this.outputs = this.createCloudFormationOutputs(props);
    }

    // Create SSM parameters if enabled
    if (props.parameterStore?.enabled === true) {
      this.parameters = this.createParameterStoreOutputs(props);
    }

    this.createStackMetadataOutputs(props);
  }

  /**
   * Create stack metadata outputs
   */
  private createStackMetadataOutputs(props: VersionOutputsProps): void {
    const metadataKey = props.metadataKey || props.outputPrefix || 'Version';

    Stack.of(this).addMetadata(metadataKey, this.versionInfo.toObject());
  }

  /**
   * Create CloudFormation outputs
   */
  private createCloudFormationOutputs(props: VersionOutputsProps): { [key: string]: cdk.CfnOutput } {
    const prefix = props.outputPrefix || 'Version';
    const outputs: { [key: string]: cdk.CfnOutput } = {};

    // Main version output
    outputs.version = new cdk.CfnOutput(this, `${prefix}String`, {
      value: this.versionInfo.version,
      description: 'Deployment version',
      exportName: this.getExportName(props.cloudFormation, 'version'),
    });

    // Commit hash
    outputs.commitHash = new cdk.CfnOutput(this, `${prefix}CommitHash`, {
      value: this.versionInfo.commitHash,
      description: 'Git commit hash',
      exportName: this.getExportName(props.cloudFormation, 'commit-hash'),
    });

    // Branch
    outputs.branch = new cdk.CfnOutput(this, `${prefix}Branch`, {
      value: this.versionInfo.branch,
      description: 'Git branch',
      exportName: this.getExportName(props.cloudFormation, 'branch'),
    });

    // Commit count
    outputs.commitCount = new cdk.CfnOutput(this, `${prefix}CommitCount`, {
      value: this.versionInfo.commitCount.toString(),
      description: 'Git commit count',
      exportName: this.getExportName(props.cloudFormation, 'commit-count'),
    });

    // Deployment time
    outputs.deploymentTime = new cdk.CfnOutput(this, `${prefix}DeploymentTime`, {
      value: this.versionInfo.deploymentTime,
      description: 'Deployment timestamp',
      exportName: this.getExportName(props.cloudFormation, 'deployment-time'),
    });

    // Environment
    outputs.environment = new cdk.CfnOutput(this, `${prefix}Environment`, {
      value: this.versionInfo.environment,
      description: 'Deployment environment',
      exportName: this.getExportName(props.cloudFormation, 'environment'),
    });

    // Optional outputs
    if (this.versionInfo.tag) {
      outputs.tag = new cdk.CfnOutput(this, `${prefix}Tag`, {
        value: this.versionInfo.tag,
        description: 'Git tag',
        exportName: this.getExportName(props.cloudFormation, 'tag'),
      });
    }

    if (this.versionInfo.packageVersion) {
      outputs.packageVersion = new cdk.CfnOutput(this, `${prefix}PackageVersion`, {
        value: this.versionInfo.packageVersion,
        description: 'Package version from package.json',
        exportName: this.getExportName(props.cloudFormation, 'package-version'),
      });
    }

    return outputs;
  }

  /**
   * Create SSM Parameter Store outputs
   */
  private createParameterStoreOutputs(props: VersionOutputsProps): { [key: string]: ssm.StringParameter } {
    const basePath = props.parameterStore?.basePath || '/version';
    const parameters: { [key: string]: ssm.StringParameter } = {};

    if (props.parameterStore?.splitParameters) {
      // Create individual parameters for each field
      parameters.version = this.createParameter(
        'Version',
        `${basePath}/version`,
        this.versionInfo.version,
        'Deployment version',
      );

      parameters.commitHash = this.createParameter(
        'CommitHash',
        `${basePath}/commit-hash`,
        this.versionInfo.commitHash,
        'Git commit hash',
      );

      parameters.branch = this.createParameter(
        'Branch',
        `${basePath}/branch`,
        this.versionInfo.branch,
        'Git branch',
      );

      parameters.commitCount = this.createParameter(
        'CommitCount',
        `${basePath}/commit-count`,
        this.versionInfo.commitCount.toString(),
        'Git commit count',
      );

      parameters.deploymentTime = this.createParameter(
        'DeploymentTime',
        `${basePath}/deployment-time`,
        this.versionInfo.deploymentTime,
        'Deployment timestamp',
      );

      parameters.environment = this.createParameter(
        'Environment',
        `${basePath}/environment`,
        this.versionInfo.environment,
        'Deployment environment',
      );

      // Optional parameters
      if (this.versionInfo.tag) {
        parameters.tag = this.createParameter(
          'Tag',
          `${basePath}/tag`,
          this.versionInfo.tag,
          'Git tag',
        );
      }

      if (this.versionInfo.packageVersion) {
        parameters.packageVersion = this.createParameter(
          'PackageVersion',
          `${basePath}/package-version`,
          this.versionInfo.packageVersion,
          'Package version from package.json',
        );
      }
    } else {
      // Create single parameter with JSON
      parameters.versionInfo = this.createParameter(
        'VersionInfo',
        basePath,
        this.versionInfo.toJson(),
        props.parameterStore?.description || 'Version information (JSON)',
      );
    }

    return parameters;
  }

  /**
   * Create SSM parameter
   */
  private createParameter(
    id: string,
    parameterName: string,
    value: string,
    description: string,
  ): ssm.StringParameter {
    return new ssm.StringParameter(this, id, {
      parameterName,
      stringValue: value,
      description,
      tier: ssm.ParameterTier.STANDARD,
    });
  }

  /**
   * Get export name for CloudFormation output
   */
  private getExportName(config?: CloudFormationOutputConfig, suffix?: string): string | undefined {
    if (!config?.export) {
      return undefined;
    }

    if (config.exportNameTemplate) {
      let name = this.versionInfo.exportName(config.exportNameTemplate);
      if (suffix) {
        name = `${name}-${suffix}`;
      }
      return name;
    }

    return undefined;
  }
}
