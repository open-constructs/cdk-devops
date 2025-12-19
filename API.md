# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### StackMetadata <a name="StackMetadata" id="cdk-devops.StackMetadata"></a>

Construct for adding repository and pipeline metadata to a CloudFormation stack.

This construct adds metadata to the stack containing information about the
repository (provider, owner, repository name, branch, commit) and the
CI/CD pipeline (job ID, job URL, triggered by, workflow name).

*Example*

```typescript
// Automatically extract from environment variables
new StackMetadata(this, 'Metadata');

// Use custom environment variable names
new StackMetadata(this, 'Metadata', {
  customEnvVars: {
    repoOwner: 'MY_REPO_OWNER',
    repoName: 'MY_REPO_NAME',
    branch: 'MY_BRANCH',
    commitHash: 'MY_COMMIT_HASH',
  },
});

// Manually provide information
new StackMetadata(this, 'Metadata', {
  repoInfo: {
    provider: CiProvider.GITHUB,
    owner: 'my-org',
    repository: 'my-repo',
    branch: 'main',
    commitHash: 'abc123',
  },
  pipelineInfo: {
    provider: CiProvider.GITHUB,
    jobId: '12345',
    jobUrl: 'https://github.com/my-org/my-repo/actions/runs/12345',
    triggeredBy: 'user@example.com',
  },
});
```


#### Initializers <a name="Initializers" id="cdk-devops.StackMetadata.Initializer"></a>

```typescript
import { StackMetadata } from 'cdk-devops'

new StackMetadata(scope: Construct, id: string, props?: StackMetadataProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.StackMetadata.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-devops.StackMetadata.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-devops.StackMetadata.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-devops.StackMetadataProps">StackMetadataProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-devops.StackMetadata.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-devops.StackMetadata.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Optional</sup> <a name="props" id="cdk-devops.StackMetadata.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-devops.StackMetadataProps">StackMetadataProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-devops.StackMetadata.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#cdk-devops.StackMetadata.pipelineMetadata">pipelineMetadata</a></code> | Get the pipeline information as a plain object. |
| <code><a href="#cdk-devops.StackMetadata.repoMetadata">repoMetadata</a></code> | Get the repository information as a plain object. |

---

##### `toString` <a name="toString" id="cdk-devops.StackMetadata.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `pipelineMetadata` <a name="pipelineMetadata" id="cdk-devops.StackMetadata.pipelineMetadata"></a>

```typescript
public pipelineMetadata(): PipelineInfo
```

Get the pipeline information as a plain object.

##### `repoMetadata` <a name="repoMetadata" id="cdk-devops.StackMetadata.repoMetadata"></a>

```typescript
public repoMetadata(): RepoInfo
```

Get the repository information as a plain object.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-devops.StackMetadata.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#cdk-devops.StackMetadata.fromEnvironment">fromEnvironment</a></code> | Create a new StackMetadata construct that extracts information from environment variables. |

---

##### `isConstruct` <a name="isConstruct" id="cdk-devops.StackMetadata.isConstruct"></a>

```typescript
import { StackMetadata } from 'cdk-devops'

StackMetadata.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="cdk-devops.StackMetadata.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `fromEnvironment` <a name="fromEnvironment" id="cdk-devops.StackMetadata.fromEnvironment"></a>

```typescript
import { StackMetadata } from 'cdk-devops'

StackMetadata.fromEnvironment(scope: Construct, id: string, customEnvVars?: CustomEnvVarConfig)
```

Create a new StackMetadata construct that extracts information from environment variables.

###### `scope`<sup>Required</sup> <a name="scope" id="cdk-devops.StackMetadata.fromEnvironment.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="cdk-devops.StackMetadata.fromEnvironment.parameter.id"></a>

- *Type:* string

---

###### `customEnvVars`<sup>Optional</sup> <a name="customEnvVars" id="cdk-devops.StackMetadata.fromEnvironment.parameter.customEnvVars"></a>

- *Type:* <a href="#cdk-devops.CustomEnvVarConfig">CustomEnvVarConfig</a>

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.StackMetadata.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-devops.StackMetadata.property.pipelineInfo">pipelineInfo</a></code> | <code><a href="#cdk-devops.PipelineInfo">PipelineInfo</a></code> | The pipeline information. |
| <code><a href="#cdk-devops.StackMetadata.property.repoInfo">repoInfo</a></code> | <code><a href="#cdk-devops.RepoInfo">RepoInfo</a></code> | The repository information. |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-devops.StackMetadata.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `pipelineInfo`<sup>Required</sup> <a name="pipelineInfo" id="cdk-devops.StackMetadata.property.pipelineInfo"></a>

```typescript
public readonly pipelineInfo: PipelineInfo;
```

- *Type:* <a href="#cdk-devops.PipelineInfo">PipelineInfo</a>

The pipeline information.

---

##### `repoInfo`<sup>Required</sup> <a name="repoInfo" id="cdk-devops.StackMetadata.property.repoInfo"></a>

```typescript
public readonly repoInfo: RepoInfo;
```

- *Type:* <a href="#cdk-devops.RepoInfo">RepoInfo</a>

The repository information.

---


### VersionOutputs <a name="VersionOutputs" id="cdk-devops.VersionOutputs"></a>

Construct for creating version outputs in CloudFormation and SSM Parameter Store.

#### Initializers <a name="Initializers" id="cdk-devops.VersionOutputs.Initializer"></a>

```typescript
import { VersionOutputs } from 'cdk-devops'

new VersionOutputs(scope: Construct, id: string, props: VersionOutputsProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.VersionOutputs.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#cdk-devops.VersionOutputs.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-devops.VersionOutputs.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-devops.VersionOutputsProps">VersionOutputsProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-devops.VersionOutputs.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-devops.VersionOutputs.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-devops.VersionOutputs.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-devops.VersionOutputsProps">VersionOutputsProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-devops.VersionOutputs.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cdk-devops.VersionOutputs.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-devops.VersionOutputs.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### `isConstruct` <a name="isConstruct" id="cdk-devops.VersionOutputs.isConstruct"></a>

```typescript
import { VersionOutputs } from 'cdk-devops'

VersionOutputs.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

###### `x`<sup>Required</sup> <a name="x" id="cdk-devops.VersionOutputs.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.VersionOutputs.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-devops.VersionOutputs.property.versionInfo">versionInfo</a></code> | <code><a href="#cdk-devops.VersionInfo">VersionInfo</a></code> | The version information. |
| <code><a href="#cdk-devops.VersionOutputs.property.outputs">outputs</a></code> | <code>{[ key: string ]: aws-cdk-lib.CfnOutput}</code> | CloudFormation outputs (if enabled). |
| <code><a href="#cdk-devops.VersionOutputs.property.parameters">parameters</a></code> | <code>{[ key: string ]: aws-cdk-lib.aws_ssm.StringParameter}</code> | SSM Parameters (if enabled). |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-devops.VersionOutputs.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `versionInfo`<sup>Required</sup> <a name="versionInfo" id="cdk-devops.VersionOutputs.property.versionInfo"></a>

```typescript
public readonly versionInfo: VersionInfo;
```

- *Type:* <a href="#cdk-devops.VersionInfo">VersionInfo</a>

The version information.

---

##### `outputs`<sup>Optional</sup> <a name="outputs" id="cdk-devops.VersionOutputs.property.outputs"></a>

```typescript
public readonly outputs: {[ key: string ]: CfnOutput};
```

- *Type:* {[ key: string ]: aws-cdk-lib.CfnOutput}

CloudFormation outputs (if enabled).

---

##### `parameters`<sup>Optional</sup> <a name="parameters" id="cdk-devops.VersionOutputs.property.parameters"></a>

```typescript
public readonly parameters: {[ key: string ]: StringParameter};
```

- *Type:* {[ key: string ]: aws-cdk-lib.aws_ssm.StringParameter}

SSM Parameters (if enabled).

---


## Structs <a name="Structs" id="Structs"></a>

### BuildNumberConfig <a name="BuildNumberConfig" id="cdk-devops.BuildNumberConfig"></a>

Build number configuration.

#### Initializer <a name="Initializer" id="cdk-devops.BuildNumberConfig.Initializer"></a>

```typescript
import { BuildNumberConfig } from 'cdk-devops'

const buildNumberConfig: BuildNumberConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.BuildNumberConfig.property.envVar">envVar</a></code> | <code>string</code> | Environment variable to read build number from. |

---

##### `envVar`<sup>Optional</sup> <a name="envVar" id="cdk-devops.BuildNumberConfig.property.envVar"></a>

```typescript
public readonly envVar: string;
```

- *Type:* string
- *Default:* 'BUILD_NUMBER'

Environment variable to read build number from.

---

### CloudFormationOnlyOptions <a name="CloudFormationOnlyOptions" id="cdk-devops.CloudFormationOnlyOptions"></a>

Options for CloudFormation-only output configuration.

#### Initializer <a name="Initializer" id="cdk-devops.CloudFormationOnlyOptions.Initializer"></a>

```typescript
import { CloudFormationOnlyOptions } from 'cdk-devops'

const cloudFormationOnlyOptions: CloudFormationOnlyOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.CloudFormationOnlyOptions.property.exportName">exportName</a></code> | <code>string</code> | Export name for cross-stack references. |
| <code><a href="#cdk-devops.CloudFormationOnlyOptions.property.format">format</a></code> | <code>string</code> | Output format. |
| <code><a href="#cdk-devops.CloudFormationOnlyOptions.property.stackOutputName">stackOutputName</a></code> | <code>string</code> | Stack output name. |

---

##### `exportName`<sup>Optional</sup> <a name="exportName" id="cdk-devops.CloudFormationOnlyOptions.property.exportName"></a>

```typescript
public readonly exportName: string;
```

- *Type:* string

Export name for cross-stack references.

---

##### `format`<sup>Optional</sup> <a name="format" id="cdk-devops.CloudFormationOnlyOptions.property.format"></a>

```typescript
public readonly format: string;
```

- *Type:* string
- *Default:* 'plain'

Output format.

---

##### `stackOutputName`<sup>Optional</sup> <a name="stackOutputName" id="cdk-devops.CloudFormationOnlyOptions.property.stackOutputName"></a>

```typescript
public readonly stackOutputName: string;
```

- *Type:* string

Stack output name.

---

### CloudFormationOutputConfig <a name="CloudFormationOutputConfig" id="cdk-devops.CloudFormationOutputConfig"></a>

CloudFormation output configuration.

#### Initializer <a name="Initializer" id="cdk-devops.CloudFormationOutputConfig.Initializer"></a>

```typescript
import { CloudFormationOutputConfig } from 'cdk-devops'

const cloudFormationOutputConfig: CloudFormationOutputConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.CloudFormationOutputConfig.property.enabled">enabled</a></code> | <code>boolean</code> | Whether to create CloudFormation outputs. |
| <code><a href="#cdk-devops.CloudFormationOutputConfig.property.export">export</a></code> | <code>boolean</code> | Whether to export the outputs for cross-stack references. |
| <code><a href="#cdk-devops.CloudFormationOutputConfig.property.exportNameTemplate">exportNameTemplate</a></code> | <code>string</code> | Export name template (supports {version}, {environment}, etc.). |

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="cdk-devops.CloudFormationOutputConfig.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean
- *Default:* true

Whether to create CloudFormation outputs.

---

##### `export`<sup>Optional</sup> <a name="export" id="cdk-devops.CloudFormationOutputConfig.property.export"></a>

```typescript
public readonly export: boolean;
```

- *Type:* boolean
- *Default:* false

Whether to export the outputs for cross-stack references.

---

##### `exportNameTemplate`<sup>Optional</sup> <a name="exportNameTemplate" id="cdk-devops.CloudFormationOutputConfig.property.exportNameTemplate"></a>

```typescript
public readonly exportNameTemplate: string;
```

- *Type:* string

Export name template (supports {version}, {environment}, etc.).

---

### CommitCountConfig <a name="CommitCountConfig" id="cdk-devops.CommitCountConfig"></a>

Commit count configuration.

#### Initializer <a name="Initializer" id="cdk-devops.CommitCountConfig.Initializer"></a>

```typescript
import { CommitCountConfig } from 'cdk-devops'

const commitCountConfig: CommitCountConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.CommitCountConfig.property.mode">mode</a></code> | <code>string</code> | Commit counting mode - 'all': Count all commits - 'branch': Count commits on current branch - 'since-tag': Count commits since last tag. |
| <code><a href="#cdk-devops.CommitCountConfig.property.padding">padding</a></code> | <code>number</code> | Padding for commit count (e.g., 5 means '00042'). |

---

##### `mode`<sup>Optional</sup> <a name="mode" id="cdk-devops.CommitCountConfig.property.mode"></a>

```typescript
public readonly mode: string;
```

- *Type:* string
- *Default:* 'all'

Commit counting mode - 'all': Count all commits - 'branch': Count commits on current branch - 'since-tag': Count commits since last tag.

---

##### `padding`<sup>Optional</sup> <a name="padding" id="cdk-devops.CommitCountConfig.property.padding"></a>

```typescript
public readonly padding: number;
```

- *Type:* number
- *Default:* 0

Padding for commit count (e.g., 5 means '00042').

---

### ComputationContext <a name="ComputationContext" id="cdk-devops.ComputationContext"></a>

Context for version computation.

#### Initializer <a name="Initializer" id="cdk-devops.ComputationContext.Initializer"></a>

```typescript
import { ComputationContext } from 'cdk-devops'

const computationContext: ComputationContext = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.ComputationContext.property.environment">environment</a></code> | <code>string</code> | Environment/stage name. |
| <code><a href="#cdk-devops.ComputationContext.property.gitInfo">gitInfo</a></code> | <code><a href="#cdk-devops.GitInfo">GitInfo</a></code> | Git information. |
| <code><a href="#cdk-devops.ComputationContext.property.buildNumber">buildNumber</a></code> | <code>string</code> | Build number. |
| <code><a href="#cdk-devops.ComputationContext.property.deploymentTime">deploymentTime</a></code> | <code>string</code> | Deployment timestamp. |
| <code><a href="#cdk-devops.ComputationContext.property.packageVersion">packageVersion</a></code> | <code>string</code> | Package version from package.json. |
| <code><a href="#cdk-devops.ComputationContext.property.pipelineVersion">pipelineVersion</a></code> | <code>string</code> | Pipeline version/execution ID. |
| <code><a href="#cdk-devops.ComputationContext.property.repositoryUrl">repositoryUrl</a></code> | <code>string</code> | Repository URL. |

---

##### `environment`<sup>Required</sup> <a name="environment" id="cdk-devops.ComputationContext.property.environment"></a>

```typescript
public readonly environment: string;
```

- *Type:* string

Environment/stage name.

---

##### `gitInfo`<sup>Required</sup> <a name="gitInfo" id="cdk-devops.ComputationContext.property.gitInfo"></a>

```typescript
public readonly gitInfo: GitInfo;
```

- *Type:* <a href="#cdk-devops.GitInfo">GitInfo</a>

Git information.

---

##### `buildNumber`<sup>Optional</sup> <a name="buildNumber" id="cdk-devops.ComputationContext.property.buildNumber"></a>

```typescript
public readonly buildNumber: string;
```

- *Type:* string

Build number.

---

##### `deploymentTime`<sup>Optional</sup> <a name="deploymentTime" id="cdk-devops.ComputationContext.property.deploymentTime"></a>

```typescript
public readonly deploymentTime: string;
```

- *Type:* string

Deployment timestamp.

---

##### `packageVersion`<sup>Optional</sup> <a name="packageVersion" id="cdk-devops.ComputationContext.property.packageVersion"></a>

```typescript
public readonly packageVersion: string;
```

- *Type:* string

Package version from package.json.

---

##### `pipelineVersion`<sup>Optional</sup> <a name="pipelineVersion" id="cdk-devops.ComputationContext.property.pipelineVersion"></a>

```typescript
public readonly pipelineVersion: string;
```

- *Type:* string

Pipeline version/execution ID.

---

##### `repositoryUrl`<sup>Optional</sup> <a name="repositoryUrl" id="cdk-devops.ComputationContext.property.repositoryUrl"></a>

```typescript
public readonly repositoryUrl: string;
```

- *Type:* string

Repository URL.

---

### CustomEnvVarConfig <a name="CustomEnvVarConfig" id="cdk-devops.CustomEnvVarConfig"></a>

Custom environment variable names for overriding defaults.

#### Initializer <a name="Initializer" id="cdk-devops.CustomEnvVarConfig.Initializer"></a>

```typescript
import { CustomEnvVarConfig } from 'cdk-devops'

const customEnvVarConfig: CustomEnvVarConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.CustomEnvVarConfig.property.branch">branch</a></code> | <code>string</code> | Custom environment variable for branch name. |
| <code><a href="#cdk-devops.CustomEnvVarConfig.property.commitHash">commitHash</a></code> | <code>string</code> | Custom environment variable for commit hash. |
| <code><a href="#cdk-devops.CustomEnvVarConfig.property.jobId">jobId</a></code> | <code>string</code> | Custom environment variable for job ID. |
| <code><a href="#cdk-devops.CustomEnvVarConfig.property.jobUrl">jobUrl</a></code> | <code>string</code> | Custom environment variable for job URL. |
| <code><a href="#cdk-devops.CustomEnvVarConfig.property.repoName">repoName</a></code> | <code>string</code> | Custom environment variable for repository name. |
| <code><a href="#cdk-devops.CustomEnvVarConfig.property.repoOwner">repoOwner</a></code> | <code>string</code> | Custom environment variable for repository owner. |
| <code><a href="#cdk-devops.CustomEnvVarConfig.property.triggeredBy">triggeredBy</a></code> | <code>string</code> | Custom environment variable for triggered by user. |
| <code><a href="#cdk-devops.CustomEnvVarConfig.property.workflowName">workflowName</a></code> | <code>string</code> | Custom environment variable for workflow name. |

---

##### `branch`<sup>Optional</sup> <a name="branch" id="cdk-devops.CustomEnvVarConfig.property.branch"></a>

```typescript
public readonly branch: string;
```

- *Type:* string

Custom environment variable for branch name.

---

##### `commitHash`<sup>Optional</sup> <a name="commitHash" id="cdk-devops.CustomEnvVarConfig.property.commitHash"></a>

```typescript
public readonly commitHash: string;
```

- *Type:* string

Custom environment variable for commit hash.

---

##### `jobId`<sup>Optional</sup> <a name="jobId" id="cdk-devops.CustomEnvVarConfig.property.jobId"></a>

```typescript
public readonly jobId: string;
```

- *Type:* string

Custom environment variable for job ID.

---

##### `jobUrl`<sup>Optional</sup> <a name="jobUrl" id="cdk-devops.CustomEnvVarConfig.property.jobUrl"></a>

```typescript
public readonly jobUrl: string;
```

- *Type:* string

Custom environment variable for job URL.

---

##### `repoName`<sup>Optional</sup> <a name="repoName" id="cdk-devops.CustomEnvVarConfig.property.repoName"></a>

```typescript
public readonly repoName: string;
```

- *Type:* string

Custom environment variable for repository name.

---

##### `repoOwner`<sup>Optional</sup> <a name="repoOwner" id="cdk-devops.CustomEnvVarConfig.property.repoOwner"></a>

```typescript
public readonly repoOwner: string;
```

- *Type:* string

Custom environment variable for repository owner.

---

##### `triggeredBy`<sup>Optional</sup> <a name="triggeredBy" id="cdk-devops.CustomEnvVarConfig.property.triggeredBy"></a>

```typescript
public readonly triggeredBy: string;
```

- *Type:* string

Custom environment variable for triggered by user.

---

##### `workflowName`<sup>Optional</sup> <a name="workflowName" id="cdk-devops.CustomEnvVarConfig.property.workflowName"></a>

```typescript
public readonly workflowName: string;
```

- *Type:* string

Custom environment variable for workflow name.

---

### GitInfo <a name="GitInfo" id="cdk-devops.GitInfo"></a>

Git repository information.

#### Initializer <a name="Initializer" id="cdk-devops.GitInfo.Initializer"></a>

```typescript
import { GitInfo } from 'cdk-devops'

const gitInfo: GitInfo = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.GitInfo.property.branch">branch</a></code> | <code>string</code> | Current branch name. |
| <code><a href="#cdk-devops.GitInfo.property.commitCount">commitCount</a></code> | <code>number</code> | Total commit count. |
| <code><a href="#cdk-devops.GitInfo.property.commitHash">commitHash</a></code> | <code>string</code> | Full commit hash. |
| <code><a href="#cdk-devops.GitInfo.property.shortCommitHash">shortCommitHash</a></code> | <code>string</code> | Short commit hash (typically 8 characters). |
| <code><a href="#cdk-devops.GitInfo.property.commitsSinceTag">commitsSinceTag</a></code> | <code>number</code> | Commit count since last tag. |
| <code><a href="#cdk-devops.GitInfo.property.tag">tag</a></code> | <code>string</code> | Git tag (if on a tagged commit). |

---

##### `branch`<sup>Required</sup> <a name="branch" id="cdk-devops.GitInfo.property.branch"></a>

```typescript
public readonly branch: string;
```

- *Type:* string

Current branch name.

---

##### `commitCount`<sup>Required</sup> <a name="commitCount" id="cdk-devops.GitInfo.property.commitCount"></a>

```typescript
public readonly commitCount: number;
```

- *Type:* number

Total commit count.

---

##### `commitHash`<sup>Required</sup> <a name="commitHash" id="cdk-devops.GitInfo.property.commitHash"></a>

```typescript
public readonly commitHash: string;
```

- *Type:* string

Full commit hash.

---

##### `shortCommitHash`<sup>Required</sup> <a name="shortCommitHash" id="cdk-devops.GitInfo.property.shortCommitHash"></a>

```typescript
public readonly shortCommitHash: string;
```

- *Type:* string

Short commit hash (typically 8 characters).

---

##### `commitsSinceTag`<sup>Optional</sup> <a name="commitsSinceTag" id="cdk-devops.GitInfo.property.commitsSinceTag"></a>

```typescript
public readonly commitsSinceTag: number;
```

- *Type:* number

Commit count since last tag.

---

##### `tag`<sup>Optional</sup> <a name="tag" id="cdk-devops.GitInfo.property.tag"></a>

```typescript
public readonly tag: string;
```

- *Type:* string

Git tag (if on a tagged commit).

---

### GitInfoProps <a name="GitInfoProps" id="cdk-devops.GitInfoProps"></a>

Props for creating GitInfo.

#### Initializer <a name="Initializer" id="cdk-devops.GitInfoProps.Initializer"></a>

```typescript
import { GitInfoProps } from 'cdk-devops'

const gitInfoProps: GitInfoProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.GitInfoProps.property.branch">branch</a></code> | <code>string</code> | Current branch name. |
| <code><a href="#cdk-devops.GitInfoProps.property.commitCount">commitCount</a></code> | <code>number</code> | Total commit count. |
| <code><a href="#cdk-devops.GitInfoProps.property.commitHash">commitHash</a></code> | <code>string</code> | Full commit hash. |
| <code><a href="#cdk-devops.GitInfoProps.property.commitsSinceTag">commitsSinceTag</a></code> | <code>number</code> | Commit count since last tag. |
| <code><a href="#cdk-devops.GitInfoProps.property.tag">tag</a></code> | <code>string</code> | Git tag (if on a tagged commit). |

---

##### `branch`<sup>Required</sup> <a name="branch" id="cdk-devops.GitInfoProps.property.branch"></a>

```typescript
public readonly branch: string;
```

- *Type:* string

Current branch name.

---

##### `commitCount`<sup>Required</sup> <a name="commitCount" id="cdk-devops.GitInfoProps.property.commitCount"></a>

```typescript
public readonly commitCount: number;
```

- *Type:* number

Total commit count.

---

##### `commitHash`<sup>Required</sup> <a name="commitHash" id="cdk-devops.GitInfoProps.property.commitHash"></a>

```typescript
public readonly commitHash: string;
```

- *Type:* string

Full commit hash.

---

##### `commitsSinceTag`<sup>Optional</sup> <a name="commitsSinceTag" id="cdk-devops.GitInfoProps.property.commitsSinceTag"></a>

```typescript
public readonly commitsSinceTag: number;
```

- *Type:* number

Commit count since last tag.

---

##### `tag`<sup>Optional</sup> <a name="tag" id="cdk-devops.GitInfoProps.property.tag"></a>

```typescript
public readonly tag: string;
```

- *Type:* string

Git tag (if on a tagged commit).

---

### GitTagConfig <a name="GitTagConfig" id="cdk-devops.GitTagConfig"></a>

Git tag configuration for version extraction.

#### Initializer <a name="Initializer" id="cdk-devops.GitTagConfig.Initializer"></a>

```typescript
import { GitTagConfig } from 'cdk-devops'

const gitTagConfig: GitTagConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.GitTagConfig.property.countCommitsSince">countCommitsSince</a></code> | <code>boolean</code> | Whether to count commits since the last tag. |
| <code><a href="#cdk-devops.GitTagConfig.property.pattern">pattern</a></code> | <code>string</code> | Pattern to match git tags. |
| <code><a href="#cdk-devops.GitTagConfig.property.prefix">prefix</a></code> | <code>string</code> | Prefix to strip from git tags (e.g., 'v' for tags like 'v1.2.3'). |

---

##### `countCommitsSince`<sup>Optional</sup> <a name="countCommitsSince" id="cdk-devops.GitTagConfig.property.countCommitsSince"></a>

```typescript
public readonly countCommitsSince: boolean;
```

- *Type:* boolean
- *Default:* true

Whether to count commits since the last tag.

---

##### `pattern`<sup>Optional</sup> <a name="pattern" id="cdk-devops.GitTagConfig.property.pattern"></a>

```typescript
public readonly pattern: string;
```

- *Type:* string
- *Default:* '*.*.*'

Pattern to match git tags.

---

##### `prefix`<sup>Optional</sup> <a name="prefix" id="cdk-devops.GitTagConfig.property.prefix"></a>

```typescript
public readonly prefix: string;
```

- *Type:* string
- *Default:* 'v'

Prefix to strip from git tags (e.g., 'v' for tags like 'v1.2.3').

---

### HierarchicalParametersOptions <a name="HierarchicalParametersOptions" id="cdk-devops.HierarchicalParametersOptions"></a>

Options for hierarchical parameter configuration.

#### Initializer <a name="Initializer" id="cdk-devops.HierarchicalParametersOptions.Initializer"></a>

```typescript
import { HierarchicalParametersOptions } from 'cdk-devops'

const hierarchicalParametersOptions: HierarchicalParametersOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.HierarchicalParametersOptions.property.format">format</a></code> | <code>string</code> | Output format. |
| <code><a href="#cdk-devops.HierarchicalParametersOptions.property.includeCloudFormation">includeCloudFormation</a></code> | <code>boolean</code> | Whether to include CloudFormation outputs. |

---

##### `format`<sup>Optional</sup> <a name="format" id="cdk-devops.HierarchicalParametersOptions.property.format"></a>

```typescript
public readonly format: string;
```

- *Type:* string
- *Default:* 'plain'

Output format.

---

##### `includeCloudFormation`<sup>Optional</sup> <a name="includeCloudFormation" id="cdk-devops.HierarchicalParametersOptions.property.includeCloudFormation"></a>

```typescript
public readonly includeCloudFormation: boolean;
```

- *Type:* boolean
- *Default:* false

Whether to include CloudFormation outputs.

---

### PackageJsonConfig <a name="PackageJsonConfig" id="cdk-devops.PackageJsonConfig"></a>

Package.json version configuration.

#### Initializer <a name="Initializer" id="cdk-devops.PackageJsonConfig.Initializer"></a>

```typescript
import { PackageJsonConfig } from 'cdk-devops'

const packageJsonConfig: PackageJsonConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.PackageJsonConfig.property.includePrerelease">includePrerelease</a></code> | <code>boolean</code> | Whether to include prerelease identifiers. |

---

##### `includePrerelease`<sup>Optional</sup> <a name="includePrerelease" id="cdk-devops.PackageJsonConfig.property.includePrerelease"></a>

```typescript
public readonly includePrerelease: boolean;
```

- *Type:* boolean
- *Default:* true

Whether to include prerelease identifiers.

---

### ParameterStoreOutputConfig <a name="ParameterStoreOutputConfig" id="cdk-devops.ParameterStoreOutputConfig"></a>

SSM Parameter Store output configuration.

#### Initializer <a name="Initializer" id="cdk-devops.ParameterStoreOutputConfig.Initializer"></a>

```typescript
import { ParameterStoreOutputConfig } from 'cdk-devops'

const parameterStoreOutputConfig: ParameterStoreOutputConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.ParameterStoreOutputConfig.property.basePath">basePath</a></code> | <code>string</code> | Base path for parameters (e.g., '/myapp/version'). |
| <code><a href="#cdk-devops.ParameterStoreOutputConfig.property.description">description</a></code> | <code>string</code> | Description for the parameter. |
| <code><a href="#cdk-devops.ParameterStoreOutputConfig.property.enabled">enabled</a></code> | <code>boolean</code> | Whether to create SSM parameters. |
| <code><a href="#cdk-devops.ParameterStoreOutputConfig.property.splitParameters">splitParameters</a></code> | <code>boolean</code> | Whether to split version info into separate parameters. |

---

##### `basePath`<sup>Optional</sup> <a name="basePath" id="cdk-devops.ParameterStoreOutputConfig.property.basePath"></a>

```typescript
public readonly basePath: string;
```

- *Type:* string

Base path for parameters (e.g., '/myapp/version').

---

##### `description`<sup>Optional</sup> <a name="description" id="cdk-devops.ParameterStoreOutputConfig.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string

Description for the parameter.

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="cdk-devops.ParameterStoreOutputConfig.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean
- *Default:* true

Whether to create SSM parameters.

---

##### `splitParameters`<sup>Optional</sup> <a name="splitParameters" id="cdk-devops.ParameterStoreOutputConfig.property.splitParameters"></a>

```typescript
public readonly splitParameters: boolean;
```

- *Type:* boolean
- *Default:* false

Whether to split version info into separate parameters.

---

### PipelineInfo <a name="PipelineInfo" id="cdk-devops.PipelineInfo"></a>

Pipeline execution information.

#### Initializer <a name="Initializer" id="cdk-devops.PipelineInfo.Initializer"></a>

```typescript
import { PipelineInfo } from 'cdk-devops'

const pipelineInfo: PipelineInfo = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.PipelineInfo.property.provider">provider</a></code> | <code><a href="#cdk-devops.CiProvider">CiProvider</a></code> | CI/CD provider. |
| <code><a href="#cdk-devops.PipelineInfo.property.additionalInfo">additionalInfo</a></code> | <code>{[ key: string ]: string}</code> | Additional provider-specific information. |
| <code><a href="#cdk-devops.PipelineInfo.property.event">event</a></code> | <code>string</code> | Event that triggered the workflow. |
| <code><a href="#cdk-devops.PipelineInfo.property.jobId">jobId</a></code> | <code>string</code> | Job/build ID. |
| <code><a href="#cdk-devops.PipelineInfo.property.jobUrl">jobUrl</a></code> | <code>string</code> | Job/build URL. |
| <code><a href="#cdk-devops.PipelineInfo.property.runAttempt">runAttempt</a></code> | <code>string</code> | Run attempt (for retries). |
| <code><a href="#cdk-devops.PipelineInfo.property.runNumber">runNumber</a></code> | <code>string</code> | Run number. |
| <code><a href="#cdk-devops.PipelineInfo.property.triggeredBy">triggeredBy</a></code> | <code>string</code> | User who triggered the job. |
| <code><a href="#cdk-devops.PipelineInfo.property.workflowName">workflowName</a></code> | <code>string</code> | Workflow/pipeline name. |

---

##### `provider`<sup>Required</sup> <a name="provider" id="cdk-devops.PipelineInfo.property.provider"></a>

```typescript
public readonly provider: CiProvider;
```

- *Type:* <a href="#cdk-devops.CiProvider">CiProvider</a>

CI/CD provider.

---

##### `additionalInfo`<sup>Optional</sup> <a name="additionalInfo" id="cdk-devops.PipelineInfo.property.additionalInfo"></a>

```typescript
public readonly additionalInfo: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

Additional provider-specific information.

---

##### `event`<sup>Optional</sup> <a name="event" id="cdk-devops.PipelineInfo.property.event"></a>

```typescript
public readonly event: string;
```

- *Type:* string

Event that triggered the workflow.

---

##### `jobId`<sup>Optional</sup> <a name="jobId" id="cdk-devops.PipelineInfo.property.jobId"></a>

```typescript
public readonly jobId: string;
```

- *Type:* string

Job/build ID.

---

##### `jobUrl`<sup>Optional</sup> <a name="jobUrl" id="cdk-devops.PipelineInfo.property.jobUrl"></a>

```typescript
public readonly jobUrl: string;
```

- *Type:* string

Job/build URL.

---

##### `runAttempt`<sup>Optional</sup> <a name="runAttempt" id="cdk-devops.PipelineInfo.property.runAttempt"></a>

```typescript
public readonly runAttempt: string;
```

- *Type:* string

Run attempt (for retries).

---

##### `runNumber`<sup>Optional</sup> <a name="runNumber" id="cdk-devops.PipelineInfo.property.runNumber"></a>

```typescript
public readonly runNumber: string;
```

- *Type:* string

Run number.

---

##### `triggeredBy`<sup>Optional</sup> <a name="triggeredBy" id="cdk-devops.PipelineInfo.property.triggeredBy"></a>

```typescript
public readonly triggeredBy: string;
```

- *Type:* string

User who triggered the job.

---

##### `workflowName`<sup>Optional</sup> <a name="workflowName" id="cdk-devops.PipelineInfo.property.workflowName"></a>

```typescript
public readonly workflowName: string;
```

- *Type:* string

Workflow/pipeline name.

---

### PipelineInfoProps <a name="PipelineInfoProps" id="cdk-devops.PipelineInfoProps"></a>

Props for creating PipelineInfo.

#### Initializer <a name="Initializer" id="cdk-devops.PipelineInfoProps.Initializer"></a>

```typescript
import { PipelineInfoProps } from 'cdk-devops'

const pipelineInfoProps: PipelineInfoProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.PipelineInfoProps.property.provider">provider</a></code> | <code><a href="#cdk-devops.CiProvider">CiProvider</a></code> | CI/CD provider. |
| <code><a href="#cdk-devops.PipelineInfoProps.property.additionalInfo">additionalInfo</a></code> | <code>{[ key: string ]: string}</code> | Additional provider-specific information. |
| <code><a href="#cdk-devops.PipelineInfoProps.property.event">event</a></code> | <code>string</code> | Event that triggered the workflow. |
| <code><a href="#cdk-devops.PipelineInfoProps.property.jobId">jobId</a></code> | <code>string</code> | Job/build ID. |
| <code><a href="#cdk-devops.PipelineInfoProps.property.jobUrl">jobUrl</a></code> | <code>string</code> | Job/build URL. |
| <code><a href="#cdk-devops.PipelineInfoProps.property.runAttempt">runAttempt</a></code> | <code>string</code> | Run attempt (for retries). |
| <code><a href="#cdk-devops.PipelineInfoProps.property.runNumber">runNumber</a></code> | <code>string</code> | Run number. |
| <code><a href="#cdk-devops.PipelineInfoProps.property.triggeredBy">triggeredBy</a></code> | <code>string</code> | User who triggered the job. |
| <code><a href="#cdk-devops.PipelineInfoProps.property.workflowName">workflowName</a></code> | <code>string</code> | Workflow/pipeline name. |

---

##### `provider`<sup>Required</sup> <a name="provider" id="cdk-devops.PipelineInfoProps.property.provider"></a>

```typescript
public readonly provider: CiProvider;
```

- *Type:* <a href="#cdk-devops.CiProvider">CiProvider</a>

CI/CD provider.

---

##### `additionalInfo`<sup>Optional</sup> <a name="additionalInfo" id="cdk-devops.PipelineInfoProps.property.additionalInfo"></a>

```typescript
public readonly additionalInfo: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}

Additional provider-specific information.

---

##### `event`<sup>Optional</sup> <a name="event" id="cdk-devops.PipelineInfoProps.property.event"></a>

```typescript
public readonly event: string;
```

- *Type:* string

Event that triggered the workflow.

---

##### `jobId`<sup>Optional</sup> <a name="jobId" id="cdk-devops.PipelineInfoProps.property.jobId"></a>

```typescript
public readonly jobId: string;
```

- *Type:* string

Job/build ID.

---

##### `jobUrl`<sup>Optional</sup> <a name="jobUrl" id="cdk-devops.PipelineInfoProps.property.jobUrl"></a>

```typescript
public readonly jobUrl: string;
```

- *Type:* string

Job/build URL.

---

##### `runAttempt`<sup>Optional</sup> <a name="runAttempt" id="cdk-devops.PipelineInfoProps.property.runAttempt"></a>

```typescript
public readonly runAttempt: string;
```

- *Type:* string

Run attempt (for retries).

---

##### `runNumber`<sup>Optional</sup> <a name="runNumber" id="cdk-devops.PipelineInfoProps.property.runNumber"></a>

```typescript
public readonly runNumber: string;
```

- *Type:* string

Run number.

---

##### `triggeredBy`<sup>Optional</sup> <a name="triggeredBy" id="cdk-devops.PipelineInfoProps.property.triggeredBy"></a>

```typescript
public readonly triggeredBy: string;
```

- *Type:* string

User who triggered the job.

---

##### `workflowName`<sup>Optional</sup> <a name="workflowName" id="cdk-devops.PipelineInfoProps.property.workflowName"></a>

```typescript
public readonly workflowName: string;
```

- *Type:* string

Workflow/pipeline name.

---

### RepoInfo <a name="RepoInfo" id="cdk-devops.RepoInfo"></a>

Repository information.

#### Initializer <a name="Initializer" id="cdk-devops.RepoInfo.Initializer"></a>

```typescript
import { RepoInfo } from 'cdk-devops'

const repoInfo: RepoInfo = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.RepoInfo.property.branch">branch</a></code> | <code>string</code> | Branch name. |
| <code><a href="#cdk-devops.RepoInfo.property.commitHash">commitHash</a></code> | <code>string</code> | Commit hash. |
| <code><a href="#cdk-devops.RepoInfo.property.provider">provider</a></code> | <code><a href="#cdk-devops.CiProvider">CiProvider</a></code> | CI/CD provider (github/gitlab/codebuild). |
| <code><a href="#cdk-devops.RepoInfo.property.repository">repository</a></code> | <code>string</code> | Repository name. |
| <code><a href="#cdk-devops.RepoInfo.property.owner">owner</a></code> | <code>string</code> | Repository owner/organization. |

---

##### `branch`<sup>Required</sup> <a name="branch" id="cdk-devops.RepoInfo.property.branch"></a>

```typescript
public readonly branch: string;
```

- *Type:* string

Branch name.

---

##### `commitHash`<sup>Required</sup> <a name="commitHash" id="cdk-devops.RepoInfo.property.commitHash"></a>

```typescript
public readonly commitHash: string;
```

- *Type:* string

Commit hash.

---

##### `provider`<sup>Required</sup> <a name="provider" id="cdk-devops.RepoInfo.property.provider"></a>

```typescript
public readonly provider: CiProvider;
```

- *Type:* <a href="#cdk-devops.CiProvider">CiProvider</a>

CI/CD provider (github/gitlab/codebuild).

---

##### `repository`<sup>Required</sup> <a name="repository" id="cdk-devops.RepoInfo.property.repository"></a>

```typescript
public readonly repository: string;
```

- *Type:* string

Repository name.

---

##### `owner`<sup>Optional</sup> <a name="owner" id="cdk-devops.RepoInfo.property.owner"></a>

```typescript
public readonly owner: string;
```

- *Type:* string

Repository owner/organization.

---

### RepoInfoProps <a name="RepoInfoProps" id="cdk-devops.RepoInfoProps"></a>

Props for creating RepoInfo.

#### Initializer <a name="Initializer" id="cdk-devops.RepoInfoProps.Initializer"></a>

```typescript
import { RepoInfoProps } from 'cdk-devops'

const repoInfoProps: RepoInfoProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.RepoInfoProps.property.branch">branch</a></code> | <code>string</code> | Branch name. |
| <code><a href="#cdk-devops.RepoInfoProps.property.commitHash">commitHash</a></code> | <code>string</code> | Commit hash. |
| <code><a href="#cdk-devops.RepoInfoProps.property.provider">provider</a></code> | <code><a href="#cdk-devops.CiProvider">CiProvider</a></code> | CI/CD provider. |
| <code><a href="#cdk-devops.RepoInfoProps.property.repository">repository</a></code> | <code>string</code> | Repository name. |
| <code><a href="#cdk-devops.RepoInfoProps.property.owner">owner</a></code> | <code>string</code> | Repository owner/organization. |

---

##### `branch`<sup>Required</sup> <a name="branch" id="cdk-devops.RepoInfoProps.property.branch"></a>

```typescript
public readonly branch: string;
```

- *Type:* string

Branch name.

---

##### `commitHash`<sup>Required</sup> <a name="commitHash" id="cdk-devops.RepoInfoProps.property.commitHash"></a>

```typescript
public readonly commitHash: string;
```

- *Type:* string

Commit hash.

---

##### `provider`<sup>Required</sup> <a name="provider" id="cdk-devops.RepoInfoProps.property.provider"></a>

```typescript
public readonly provider: CiProvider;
```

- *Type:* <a href="#cdk-devops.CiProvider">CiProvider</a>

CI/CD provider.

---

##### `repository`<sup>Required</sup> <a name="repository" id="cdk-devops.RepoInfoProps.property.repository"></a>

```typescript
public readonly repository: string;
```

- *Type:* string

Repository name.

---

##### `owner`<sup>Optional</sup> <a name="owner" id="cdk-devops.RepoInfoProps.property.owner"></a>

```typescript
public readonly owner: string;
```

- *Type:* string

Repository owner/organization.

---

### StackMetadataProps <a name="StackMetadataProps" id="cdk-devops.StackMetadataProps"></a>

Props for StackMetadata construct.

#### Initializer <a name="Initializer" id="cdk-devops.StackMetadataProps.Initializer"></a>

```typescript
import { StackMetadataProps } from 'cdk-devops'

const stackMetadataProps: StackMetadataProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.StackMetadataProps.property.customEnvVars">customEnvVars</a></code> | <code><a href="#cdk-devops.CustomEnvVarConfig">CustomEnvVarConfig</a></code> | Custom environment variable names for overriding defaults Only used when repoInfo and pipelineInfo are not provided. |
| <code><a href="#cdk-devops.StackMetadataProps.property.pipelineInfo">pipelineInfo</a></code> | <code><a href="#cdk-devops.PipelineInfo">PipelineInfo</a></code> | Pipeline information If not provided, will be extracted from environment variables. |
| <code><a href="#cdk-devops.StackMetadataProps.property.pipelineMetadataKey">pipelineMetadataKey</a></code> | <code>string</code> | Metadata key for pipeline information. |
| <code><a href="#cdk-devops.StackMetadataProps.property.repoInfo">repoInfo</a></code> | <code><a href="#cdk-devops.RepoInfo">RepoInfo</a></code> | Repository information If not provided, will be extracted from environment variables. |
| <code><a href="#cdk-devops.StackMetadataProps.property.repoMetadataKey">repoMetadataKey</a></code> | <code>string</code> | Metadata key for repository information. |

---

##### `customEnvVars`<sup>Optional</sup> <a name="customEnvVars" id="cdk-devops.StackMetadataProps.property.customEnvVars"></a>

```typescript
public readonly customEnvVars: CustomEnvVarConfig;
```

- *Type:* <a href="#cdk-devops.CustomEnvVarConfig">CustomEnvVarConfig</a>

Custom environment variable names for overriding defaults Only used when repoInfo and pipelineInfo are not provided.

---

##### `pipelineInfo`<sup>Optional</sup> <a name="pipelineInfo" id="cdk-devops.StackMetadataProps.property.pipelineInfo"></a>

```typescript
public readonly pipelineInfo: PipelineInfo;
```

- *Type:* <a href="#cdk-devops.PipelineInfo">PipelineInfo</a>

Pipeline information If not provided, will be extracted from environment variables.

---

##### `pipelineMetadataKey`<sup>Optional</sup> <a name="pipelineMetadataKey" id="cdk-devops.StackMetadataProps.property.pipelineMetadataKey"></a>

```typescript
public readonly pipelineMetadataKey: string;
```

- *Type:* string
- *Default:* 'Pipeline'

Metadata key for pipeline information.

---

##### `repoInfo`<sup>Optional</sup> <a name="repoInfo" id="cdk-devops.StackMetadataProps.property.repoInfo"></a>

```typescript
public readonly repoInfo: RepoInfo;
```

- *Type:* <a href="#cdk-devops.RepoInfo">RepoInfo</a>

Repository information If not provided, will be extracted from environment variables.

---

##### `repoMetadataKey`<sup>Optional</sup> <a name="repoMetadataKey" id="cdk-devops.StackMetadataProps.property.repoMetadataKey"></a>

```typescript
public readonly repoMetadataKey: string;
```

- *Type:* string
- *Default:* 'Repo'

Metadata key for repository information.

---

### StandardOutputOptions <a name="StandardOutputOptions" id="cdk-devops.StandardOutputOptions"></a>

Options for standard output configuration.

#### Initializer <a name="Initializer" id="cdk-devops.StandardOutputOptions.Initializer"></a>

```typescript
import { StandardOutputOptions } from 'cdk-devops'

const standardOutputOptions: StandardOutputOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.StandardOutputOptions.property.format">format</a></code> | <code>string</code> | Output format. |
| <code><a href="#cdk-devops.StandardOutputOptions.property.parameterName">parameterName</a></code> | <code>string</code> | Parameter name template. |

---

##### `format`<sup>Optional</sup> <a name="format" id="cdk-devops.StandardOutputOptions.property.format"></a>

```typescript
public readonly format: string;
```

- *Type:* string
- *Default:* 'plain'

Output format.

---

##### `parameterName`<sup>Optional</sup> <a name="parameterName" id="cdk-devops.StandardOutputOptions.property.parameterName"></a>

```typescript
public readonly parameterName: string;
```

- *Type:* string
- *Default:* '/{stackName}/version'

Parameter name template.

---

### VersionInfoProps <a name="VersionInfoProps" id="cdk-devops.VersionInfoProps"></a>

Props for creating VersionInfo.

#### Initializer <a name="Initializer" id="cdk-devops.VersionInfoProps.Initializer"></a>

```typescript
import { VersionInfoProps } from 'cdk-devops'

const versionInfoProps: VersionInfoProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.VersionInfoProps.property.environment">environment</a></code> | <code>string</code> | Environment/stage name. |
| <code><a href="#cdk-devops.VersionInfoProps.property.gitInfo">gitInfo</a></code> | <code><a href="#cdk-devops.GitInfo">GitInfo</a></code> | Git information. |
| <code><a href="#cdk-devops.VersionInfoProps.property.version">version</a></code> | <code>string</code> | Computed version string. |
| <code><a href="#cdk-devops.VersionInfoProps.property.buildNumber">buildNumber</a></code> | <code>string</code> | Build number. |
| <code><a href="#cdk-devops.VersionInfoProps.property.deploymentTime">deploymentTime</a></code> | <code>string</code> | Deployment timestamp. |
| <code><a href="#cdk-devops.VersionInfoProps.property.deploymentUser">deploymentUser</a></code> | <code>string</code> | Deployment username. |
| <code><a href="#cdk-devops.VersionInfoProps.property.packageVersion">packageVersion</a></code> | <code>string</code> | Package version from package.json. |
| <code><a href="#cdk-devops.VersionInfoProps.property.pipelineVersion">pipelineVersion</a></code> | <code>string</code> | Pipeline version/execution ID. |
| <code><a href="#cdk-devops.VersionInfoProps.property.repositoryUrl">repositoryUrl</a></code> | <code>string</code> | Repository URL. |

---

##### `environment`<sup>Required</sup> <a name="environment" id="cdk-devops.VersionInfoProps.property.environment"></a>

```typescript
public readonly environment: string;
```

- *Type:* string

Environment/stage name.

---

##### `gitInfo`<sup>Required</sup> <a name="gitInfo" id="cdk-devops.VersionInfoProps.property.gitInfo"></a>

```typescript
public readonly gitInfo: GitInfo;
```

- *Type:* <a href="#cdk-devops.GitInfo">GitInfo</a>

Git information.

---

##### `version`<sup>Required</sup> <a name="version" id="cdk-devops.VersionInfoProps.property.version"></a>

```typescript
public readonly version: string;
```

- *Type:* string

Computed version string.

---

##### `buildNumber`<sup>Optional</sup> <a name="buildNumber" id="cdk-devops.VersionInfoProps.property.buildNumber"></a>

```typescript
public readonly buildNumber: string;
```

- *Type:* string

Build number.

---

##### `deploymentTime`<sup>Optional</sup> <a name="deploymentTime" id="cdk-devops.VersionInfoProps.property.deploymentTime"></a>

```typescript
public readonly deploymentTime: string;
```

- *Type:* string

Deployment timestamp.

---

##### `deploymentUser`<sup>Optional</sup> <a name="deploymentUser" id="cdk-devops.VersionInfoProps.property.deploymentUser"></a>

```typescript
public readonly deploymentUser: string;
```

- *Type:* string

Deployment username.

---

##### `packageVersion`<sup>Optional</sup> <a name="packageVersion" id="cdk-devops.VersionInfoProps.property.packageVersion"></a>

```typescript
public readonly packageVersion: string;
```

- *Type:* string

Package version from package.json.

---

##### `pipelineVersion`<sup>Optional</sup> <a name="pipelineVersion" id="cdk-devops.VersionInfoProps.property.pipelineVersion"></a>

```typescript
public readonly pipelineVersion: string;
```

- *Type:* string

Pipeline version/execution ID.

---

##### `repositoryUrl`<sup>Optional</sup> <a name="repositoryUrl" id="cdk-devops.VersionInfoProps.property.repositoryUrl"></a>

```typescript
public readonly repositoryUrl: string;
```

- *Type:* string

Repository URL.

---

### VersioningConfig <a name="VersioningConfig" id="cdk-devops.VersioningConfig"></a>

Versioning configuration.

#### Initializer <a name="Initializer" id="cdk-devops.VersioningConfig.Initializer"></a>

```typescript
import { VersioningConfig } from 'cdk-devops'

const versioningConfig: VersioningConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.VersioningConfig.property.outputs">outputs</a></code> | <code><a href="#cdk-devops.VersioningOutputsConfig">VersioningOutputsConfig</a></code> | Output configuration. |
| <code><a href="#cdk-devops.VersioningConfig.property.strategy">strategy</a></code> | <code><a href="#cdk-devops.IVersioningStrategy">IVersioningStrategy</a></code> | Versioning strategy. |
| <code><a href="#cdk-devops.VersioningConfig.property.enabled">enabled</a></code> | <code>boolean</code> | Whether versioning is enabled. |
| <code><a href="#cdk-devops.VersioningConfig.property.stageOverrides">stageOverrides</a></code> | <code>{[ key: string ]: <a href="#cdk-devops.VersioningConfig">VersioningConfig</a>}</code> | Stage-specific configuration overrides. |

---

##### `outputs`<sup>Required</sup> <a name="outputs" id="cdk-devops.VersioningConfig.property.outputs"></a>

```typescript
public readonly outputs: VersioningOutputsConfig;
```

- *Type:* <a href="#cdk-devops.VersioningOutputsConfig">VersioningOutputsConfig</a>

Output configuration.

---

##### `strategy`<sup>Required</sup> <a name="strategy" id="cdk-devops.VersioningConfig.property.strategy"></a>

```typescript
public readonly strategy: IVersioningStrategy;
```

- *Type:* <a href="#cdk-devops.IVersioningStrategy">IVersioningStrategy</a>

Versioning strategy.

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="cdk-devops.VersioningConfig.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean
- *Default:* true

Whether versioning is enabled.

---

##### `stageOverrides`<sup>Optional</sup> <a name="stageOverrides" id="cdk-devops.VersioningConfig.property.stageOverrides"></a>

```typescript
public readonly stageOverrides: {[ key: string ]: VersioningConfig};
```

- *Type:* {[ key: string ]: <a href="#cdk-devops.VersioningConfig">VersioningConfig</a>}

Stage-specific configuration overrides.

---

### VersioningOutputsConfig <a name="VersioningOutputsConfig" id="cdk-devops.VersioningOutputsConfig"></a>

Output configuration for version information.

#### Initializer <a name="Initializer" id="cdk-devops.VersioningOutputsConfig.Initializer"></a>

```typescript
import { VersioningOutputsConfig } from 'cdk-devops'

const versioningOutputsConfig: VersioningOutputsConfig = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.VersioningOutputsConfig.property.cloudFormation">cloudFormation</a></code> | <code><a href="#cdk-devops.CloudFormationOutputConfig">CloudFormationOutputConfig</a></code> | CloudFormation output configuration. |
| <code><a href="#cdk-devops.VersioningOutputsConfig.property.parameterStore">parameterStore</a></code> | <code><a href="#cdk-devops.ParameterStoreOutputConfig">ParameterStoreOutputConfig</a></code> | SSM Parameter Store configuration. |

---

##### `cloudFormation`<sup>Optional</sup> <a name="cloudFormation" id="cdk-devops.VersioningOutputsConfig.property.cloudFormation"></a>

```typescript
public readonly cloudFormation: CloudFormationOutputConfig;
```

- *Type:* <a href="#cdk-devops.CloudFormationOutputConfig">CloudFormationOutputConfig</a>

CloudFormation output configuration.

---

##### `parameterStore`<sup>Optional</sup> <a name="parameterStore" id="cdk-devops.VersioningOutputsConfig.property.parameterStore"></a>

```typescript
public readonly parameterStore: ParameterStoreOutputConfig;
```

- *Type:* <a href="#cdk-devops.ParameterStoreOutputConfig">ParameterStoreOutputConfig</a>

SSM Parameter Store configuration.

---

### VersioningStrategyComponents <a name="VersioningStrategyComponents" id="cdk-devops.VersioningStrategyComponents"></a>

Components that can be included in a versioning strategy.

#### Initializer <a name="Initializer" id="cdk-devops.VersioningStrategyComponents.Initializer"></a>

```typescript
import { VersioningStrategyComponents } from 'cdk-devops'

const versioningStrategyComponents: VersioningStrategyComponents = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.VersioningStrategyComponents.property.buildNumber">buildNumber</a></code> | <code><a href="#cdk-devops.BuildNumberConfig">BuildNumberConfig</a></code> | Build number configuration. |
| <code><a href="#cdk-devops.VersioningStrategyComponents.property.commitCount">commitCount</a></code> | <code><a href="#cdk-devops.CommitCountConfig">CommitCountConfig</a></code> | Commit count configuration. |
| <code><a href="#cdk-devops.VersioningStrategyComponents.property.gitTag">gitTag</a></code> | <code><a href="#cdk-devops.GitTagConfig">GitTagConfig</a></code> | Git tag configuration. |
| <code><a href="#cdk-devops.VersioningStrategyComponents.property.packageJson">packageJson</a></code> | <code><a href="#cdk-devops.PackageJsonConfig">PackageJsonConfig</a></code> | Package.json version configuration. |

---

##### `buildNumber`<sup>Optional</sup> <a name="buildNumber" id="cdk-devops.VersioningStrategyComponents.property.buildNumber"></a>

```typescript
public readonly buildNumber: BuildNumberConfig;
```

- *Type:* <a href="#cdk-devops.BuildNumberConfig">BuildNumberConfig</a>

Build number configuration.

---

##### `commitCount`<sup>Optional</sup> <a name="commitCount" id="cdk-devops.VersioningStrategyComponents.property.commitCount"></a>

```typescript
public readonly commitCount: CommitCountConfig;
```

- *Type:* <a href="#cdk-devops.CommitCountConfig">CommitCountConfig</a>

Commit count configuration.

---

##### `gitTag`<sup>Optional</sup> <a name="gitTag" id="cdk-devops.VersioningStrategyComponents.property.gitTag"></a>

```typescript
public readonly gitTag: GitTagConfig;
```

- *Type:* <a href="#cdk-devops.GitTagConfig">GitTagConfig</a>

Git tag configuration.

---

##### `packageJson`<sup>Optional</sup> <a name="packageJson" id="cdk-devops.VersioningStrategyComponents.property.packageJson"></a>

```typescript
public readonly packageJson: PackageJsonConfig;
```

- *Type:* <a href="#cdk-devops.PackageJsonConfig">PackageJsonConfig</a>

Package.json version configuration.

---

### VersionOutputsProps <a name="VersionOutputsProps" id="cdk-devops.VersionOutputsProps"></a>

Props for VersionOutputs construct.

#### Initializer <a name="Initializer" id="cdk-devops.VersionOutputsProps.Initializer"></a>

```typescript
import { VersionOutputsProps } from 'cdk-devops'

const versionOutputsProps: VersionOutputsProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.VersionOutputsProps.property.versionInfo">versionInfo</a></code> | <code><a href="#cdk-devops.VersionInfo">VersionInfo</a></code> | Version information to output. |
| <code><a href="#cdk-devops.VersionOutputsProps.property.cloudFormation">cloudFormation</a></code> | <code><a href="#cdk-devops.CloudFormationOutputConfig">CloudFormationOutputConfig</a></code> | CloudFormation output configuration. |
| <code><a href="#cdk-devops.VersionOutputsProps.property.metadataKey">metadataKey</a></code> | <code>string</code> | Metadata key. |
| <code><a href="#cdk-devops.VersionOutputsProps.property.outputPrefix">outputPrefix</a></code> | <code>string</code> | Prefix for output names. |
| <code><a href="#cdk-devops.VersionOutputsProps.property.parameterStore">parameterStore</a></code> | <code><a href="#cdk-devops.ParameterStoreOutputConfig">ParameterStoreOutputConfig</a></code> | SSM Parameter Store configuration. |

---

##### `versionInfo`<sup>Required</sup> <a name="versionInfo" id="cdk-devops.VersionOutputsProps.property.versionInfo"></a>

```typescript
public readonly versionInfo: VersionInfo;
```

- *Type:* <a href="#cdk-devops.VersionInfo">VersionInfo</a>

Version information to output.

---

##### `cloudFormation`<sup>Optional</sup> <a name="cloudFormation" id="cdk-devops.VersionOutputsProps.property.cloudFormation"></a>

```typescript
public readonly cloudFormation: CloudFormationOutputConfig;
```

- *Type:* <a href="#cdk-devops.CloudFormationOutputConfig">CloudFormationOutputConfig</a>
- *Default:* CloudFormation outputs enabled

CloudFormation output configuration.

---

##### `metadataKey`<sup>Optional</sup> <a name="metadataKey" id="cdk-devops.VersionOutputsProps.property.metadataKey"></a>

```typescript
public readonly metadataKey: string;
```

- *Type:* string
- *Default:* 'Version'

Metadata key.

---

##### `outputPrefix`<sup>Optional</sup> <a name="outputPrefix" id="cdk-devops.VersionOutputsProps.property.outputPrefix"></a>

```typescript
public readonly outputPrefix: string;
```

- *Type:* string
- *Default:* 'Version'

Prefix for output names.

---

##### `parameterStore`<sup>Optional</sup> <a name="parameterStore" id="cdk-devops.VersionOutputsProps.property.parameterStore"></a>

```typescript
public readonly parameterStore: ParameterStoreOutputConfig;
```

- *Type:* <a href="#cdk-devops.ParameterStoreOutputConfig">ParameterStoreOutputConfig</a>
- *Default:* Parameter Store disabled

SSM Parameter Store configuration.

---

## Classes <a name="Classes" id="Classes"></a>

### CompositeComputation <a name="CompositeComputation" id="cdk-devops.CompositeComputation"></a>

Composite computation strategy that replaces template variables.

#### Initializers <a name="Initializers" id="cdk-devops.CompositeComputation.Initializer"></a>

```typescript
import { CompositeComputation } from 'cdk-devops'

new CompositeComputation(strategy: IVersioningStrategy)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.CompositeComputation.Initializer.parameter.strategy">strategy</a></code> | <code><a href="#cdk-devops.IVersioningStrategy">IVersioningStrategy</a></code> | *No description.* |

---

##### `strategy`<sup>Required</sup> <a name="strategy" id="cdk-devops.CompositeComputation.Initializer.parameter.strategy"></a>

- *Type:* <a href="#cdk-devops.IVersioningStrategy">IVersioningStrategy</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-devops.CompositeComputation.compute">compute</a></code> | Compute version by replacing template variables in format string. |

---

##### `compute` <a name="compute" id="cdk-devops.CompositeComputation.compute"></a>

```typescript
public compute(context: ComputationContext): string
```

Compute version by replacing template variables in format string.

###### `context`<sup>Required</sup> <a name="context" id="cdk-devops.CompositeComputation.compute.parameter.context"></a>

- *Type:* <a href="#cdk-devops.ComputationContext">ComputationContext</a>

---




### GitInfoHelper <a name="GitInfoHelper" id="cdk-devops.GitInfoHelper"></a>

Helper class for working with Git information.

#### Initializers <a name="Initializers" id="cdk-devops.GitInfoHelper.Initializer"></a>

```typescript
import { GitInfoHelper } from 'cdk-devops'

new GitInfoHelper()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-devops.GitInfoHelper.create">create</a></code> | Create GitInfo from individual components. |
| <code><a href="#cdk-devops.GitInfoHelper.fromEnvironment">fromEnvironment</a></code> | Create GitInfo from environment variables (CI/CD context). |
| <code><a href="#cdk-devops.GitInfoHelper.isMainBranch">isMainBranch</a></code> | Check if on a main branch. |
| <code><a href="#cdk-devops.GitInfoHelper.isTaggedRelease">isTaggedRelease</a></code> | Check if on a tagged release. |
| <code><a href="#cdk-devops.GitInfoHelper.shortenHash">shortenHash</a></code> | Shorten a git commit hash to 8 characters. |

---

##### `create` <a name="create" id="cdk-devops.GitInfoHelper.create"></a>

```typescript
import { GitInfoHelper } from 'cdk-devops'

GitInfoHelper.create(props: GitInfoProps)
```

Create GitInfo from individual components.

###### `props`<sup>Required</sup> <a name="props" id="cdk-devops.GitInfoHelper.create.parameter.props"></a>

- *Type:* <a href="#cdk-devops.GitInfoProps">GitInfoProps</a>

---

##### `fromEnvironment` <a name="fromEnvironment" id="cdk-devops.GitInfoHelper.fromEnvironment"></a>

```typescript
import { GitInfoHelper } from 'cdk-devops'

GitInfoHelper.fromEnvironment()
```

Create GitInfo from environment variables (CI/CD context).

##### `isMainBranch` <a name="isMainBranch" id="cdk-devops.GitInfoHelper.isMainBranch"></a>

```typescript
import { GitInfoHelper } from 'cdk-devops'

GitInfoHelper.isMainBranch(branch: string)
```

Check if on a main branch.

###### `branch`<sup>Required</sup> <a name="branch" id="cdk-devops.GitInfoHelper.isMainBranch.parameter.branch"></a>

- *Type:* string

---

##### `isTaggedRelease` <a name="isTaggedRelease" id="cdk-devops.GitInfoHelper.isTaggedRelease"></a>

```typescript
import { GitInfoHelper } from 'cdk-devops'

GitInfoHelper.isTaggedRelease(gitInfo: GitInfo)
```

Check if on a tagged release.

###### `gitInfo`<sup>Required</sup> <a name="gitInfo" id="cdk-devops.GitInfoHelper.isTaggedRelease.parameter.gitInfo"></a>

- *Type:* <a href="#cdk-devops.GitInfo">GitInfo</a>

---

##### `shortenHash` <a name="shortenHash" id="cdk-devops.GitInfoHelper.shortenHash"></a>

```typescript
import { GitInfoHelper } from 'cdk-devops'

GitInfoHelper.shortenHash(hash: string, length?: number)
```

Shorten a git commit hash to 8 characters.

###### `hash`<sup>Required</sup> <a name="hash" id="cdk-devops.GitInfoHelper.shortenHash.parameter.hash"></a>

- *Type:* string

---

###### `length`<sup>Optional</sup> <a name="length" id="cdk-devops.GitInfoHelper.shortenHash.parameter.length"></a>

- *Type:* number

---



### PipelineInfoHelper <a name="PipelineInfoHelper" id="cdk-devops.PipelineInfoHelper"></a>

Helper class for working with pipeline information.

#### Initializers <a name="Initializers" id="cdk-devops.PipelineInfoHelper.Initializer"></a>

```typescript
import { PipelineInfoHelper } from 'cdk-devops'

new PipelineInfoHelper()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-devops.PipelineInfoHelper.create">create</a></code> | Create PipelineInfo from individual components. |
| <code><a href="#cdk-devops.PipelineInfoHelper.fromEnvironment">fromEnvironment</a></code> | Create PipelineInfo from environment variables (CI/CD context). |

---

##### `create` <a name="create" id="cdk-devops.PipelineInfoHelper.create"></a>

```typescript
import { PipelineInfoHelper } from 'cdk-devops'

PipelineInfoHelper.create(props: PipelineInfoProps)
```

Create PipelineInfo from individual components.

###### `props`<sup>Required</sup> <a name="props" id="cdk-devops.PipelineInfoHelper.create.parameter.props"></a>

- *Type:* <a href="#cdk-devops.PipelineInfoProps">PipelineInfoProps</a>

---

##### `fromEnvironment` <a name="fromEnvironment" id="cdk-devops.PipelineInfoHelper.fromEnvironment"></a>

```typescript
import { PipelineInfoHelper } from 'cdk-devops'

PipelineInfoHelper.fromEnvironment(customEnvVars?: CustomEnvVarConfig)
```

Create PipelineInfo from environment variables (CI/CD context).

###### `customEnvVars`<sup>Optional</sup> <a name="customEnvVars" id="cdk-devops.PipelineInfoHelper.fromEnvironment.parameter.customEnvVars"></a>

- *Type:* <a href="#cdk-devops.CustomEnvVarConfig">CustomEnvVarConfig</a>

---



### RepoInfoHelper <a name="RepoInfoHelper" id="cdk-devops.RepoInfoHelper"></a>

Helper class for working with repository information.

#### Initializers <a name="Initializers" id="cdk-devops.RepoInfoHelper.Initializer"></a>

```typescript
import { RepoInfoHelper } from 'cdk-devops'

new RepoInfoHelper()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-devops.RepoInfoHelper.create">create</a></code> | Create RepoInfo from individual components. |
| <code><a href="#cdk-devops.RepoInfoHelper.detectProvider">detectProvider</a></code> | Detect CI/CD provider from environment variables. |
| <code><a href="#cdk-devops.RepoInfoHelper.fromEnvironment">fromEnvironment</a></code> | Create RepoInfo from environment variables (CI/CD context). |

---

##### `create` <a name="create" id="cdk-devops.RepoInfoHelper.create"></a>

```typescript
import { RepoInfoHelper } from 'cdk-devops'

RepoInfoHelper.create(props: RepoInfoProps)
```

Create RepoInfo from individual components.

###### `props`<sup>Required</sup> <a name="props" id="cdk-devops.RepoInfoHelper.create.parameter.props"></a>

- *Type:* <a href="#cdk-devops.RepoInfoProps">RepoInfoProps</a>

---

##### `detectProvider` <a name="detectProvider" id="cdk-devops.RepoInfoHelper.detectProvider"></a>

```typescript
import { RepoInfoHelper } from 'cdk-devops'

RepoInfoHelper.detectProvider()
```

Detect CI/CD provider from environment variables.

##### `fromEnvironment` <a name="fromEnvironment" id="cdk-devops.RepoInfoHelper.fromEnvironment"></a>

```typescript
import { RepoInfoHelper } from 'cdk-devops'

RepoInfoHelper.fromEnvironment(customEnvVars?: CustomEnvVarConfig)
```

Create RepoInfo from environment variables (CI/CD context).

###### `customEnvVars`<sup>Optional</sup> <a name="customEnvVars" id="cdk-devops.RepoInfoHelper.fromEnvironment.parameter.customEnvVars"></a>

- *Type:* <a href="#cdk-devops.CustomEnvVarConfig">CustomEnvVarConfig</a>

---



### VersionComputationStrategy <a name="VersionComputationStrategy" id="cdk-devops.VersionComputationStrategy"></a>

Abstract base class for version computation strategies.

#### Initializers <a name="Initializers" id="cdk-devops.VersionComputationStrategy.Initializer"></a>

```typescript
import { VersionComputationStrategy } from 'cdk-devops'

new VersionComputationStrategy()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-devops.VersionComputationStrategy.compute">compute</a></code> | Compute version string from context. |

---

##### `compute` <a name="compute" id="cdk-devops.VersionComputationStrategy.compute"></a>

```typescript
public compute(context: ComputationContext): string
```

Compute version string from context.

###### `context`<sup>Required</sup> <a name="context" id="cdk-devops.VersionComputationStrategy.compute.parameter.context"></a>

- *Type:* <a href="#cdk-devops.ComputationContext">ComputationContext</a>

---




### VersionComputer <a name="VersionComputer" id="cdk-devops.VersionComputer"></a>

Main version computer class.

#### Initializers <a name="Initializers" id="cdk-devops.VersionComputer.Initializer"></a>

```typescript
import { VersionComputer } from 'cdk-devops'

new VersionComputer(strategy: IVersioningStrategy)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.VersionComputer.Initializer.parameter.strategy">strategy</a></code> | <code><a href="#cdk-devops.IVersioningStrategy">IVersioningStrategy</a></code> | *No description.* |

---

##### `strategy`<sup>Required</sup> <a name="strategy" id="cdk-devops.VersionComputer.Initializer.parameter.strategy"></a>

- *Type:* <a href="#cdk-devops.IVersioningStrategy">IVersioningStrategy</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-devops.VersionComputer.compute">compute</a></code> | Compute version from context. |
| <code><a href="#cdk-devops.VersionComputer.computeVersionString">computeVersionString</a></code> | Compute version string only (without creating VersionInfo). |

---

##### `compute` <a name="compute" id="cdk-devops.VersionComputer.compute"></a>

```typescript
public compute(context: ComputationContext): VersionInfo
```

Compute version from context.

###### `context`<sup>Required</sup> <a name="context" id="cdk-devops.VersionComputer.compute.parameter.context"></a>

- *Type:* <a href="#cdk-devops.ComputationContext">ComputationContext</a>

---

##### `computeVersionString` <a name="computeVersionString" id="cdk-devops.VersionComputer.computeVersionString"></a>

```typescript
public computeVersionString(context: ComputationContext): string
```

Compute version string only (without creating VersionInfo).

###### `context`<sup>Required</sup> <a name="context" id="cdk-devops.VersionComputer.computeVersionString.parameter.context"></a>

- *Type:* <a href="#cdk-devops.ComputationContext">ComputationContext</a>

---




### VersionInfo <a name="VersionInfo" id="cdk-devops.VersionInfo"></a>

- *Implements:* <a href="#cdk-devops.IVersionInfo">IVersionInfo</a>

Version information for deployments.

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-devops.VersionInfo.displayVersion">displayVersion</a></code> | Get display version (prefers tag if available). |
| <code><a href="#cdk-devops.VersionInfo.exportName">exportName</a></code> | Get export name from template. |
| <code><a href="#cdk-devops.VersionInfo.isMainBranch">isMainBranch</a></code> | Check if deployed from main branch. |
| <code><a href="#cdk-devops.VersionInfo.isTaggedRelease">isTaggedRelease</a></code> | Check if this is a tagged release. |
| <code><a href="#cdk-devops.VersionInfo.parameterName">parameterName</a></code> | Get SSM parameter name from template. |
| <code><a href="#cdk-devops.VersionInfo.toJson">toJson</a></code> | Convert to JSON string. |
| <code><a href="#cdk-devops.VersionInfo.toObject">toObject</a></code> | Convert to plain object. |

---

##### `displayVersion` <a name="displayVersion" id="cdk-devops.VersionInfo.displayVersion"></a>

```typescript
public displayVersion(): string
```

Get display version (prefers tag if available).

##### `exportName` <a name="exportName" id="cdk-devops.VersionInfo.exportName"></a>

```typescript
public exportName(template: string): string
```

Get export name from template.

###### `template`<sup>Required</sup> <a name="template" id="cdk-devops.VersionInfo.exportName.parameter.template"></a>

- *Type:* string

---

##### `isMainBranch` <a name="isMainBranch" id="cdk-devops.VersionInfo.isMainBranch"></a>

```typescript
public isMainBranch(): boolean
```

Check if deployed from main branch.

##### `isTaggedRelease` <a name="isTaggedRelease" id="cdk-devops.VersionInfo.isTaggedRelease"></a>

```typescript
public isTaggedRelease(): boolean
```

Check if this is a tagged release.

##### `parameterName` <a name="parameterName" id="cdk-devops.VersionInfo.parameterName"></a>

```typescript
public parameterName(template: string): string
```

Get SSM parameter name from template.

###### `template`<sup>Required</sup> <a name="template" id="cdk-devops.VersionInfo.parameterName.parameter.template"></a>

- *Type:* string

---

##### `toJson` <a name="toJson" id="cdk-devops.VersionInfo.toJson"></a>

```typescript
public toJson(): string
```

Convert to JSON string.

##### `toObject` <a name="toObject" id="cdk-devops.VersionInfo.toObject"></a>

```typescript
public toObject(): IVersionInfo
```

Convert to plain object.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-devops.VersionInfo.compare">compare</a></code> | Compare two version infos. |
| <code><a href="#cdk-devops.VersionInfo.create">create</a></code> | Create VersionInfo from props. |
| <code><a href="#cdk-devops.VersionInfo.fromEnvironment">fromEnvironment</a></code> | Create VersionInfo from environment variables. |
| <code><a href="#cdk-devops.VersionInfo.fromJson">fromJson</a></code> | Create VersionInfo from JSON string. |

---

##### `compare` <a name="compare" id="cdk-devops.VersionInfo.compare"></a>

```typescript
import { VersionInfo } from 'cdk-devops'

VersionInfo.compare(a: VersionInfo, b: VersionInfo)
```

Compare two version infos.

###### `a`<sup>Required</sup> <a name="a" id="cdk-devops.VersionInfo.compare.parameter.a"></a>

- *Type:* <a href="#cdk-devops.VersionInfo">VersionInfo</a>

---

###### `b`<sup>Required</sup> <a name="b" id="cdk-devops.VersionInfo.compare.parameter.b"></a>

- *Type:* <a href="#cdk-devops.VersionInfo">VersionInfo</a>

---

##### `create` <a name="create" id="cdk-devops.VersionInfo.create"></a>

```typescript
import { VersionInfo } from 'cdk-devops'

VersionInfo.create(props: VersionInfoProps)
```

Create VersionInfo from props.

###### `props`<sup>Required</sup> <a name="props" id="cdk-devops.VersionInfo.create.parameter.props"></a>

- *Type:* <a href="#cdk-devops.VersionInfoProps">VersionInfoProps</a>

---

##### `fromEnvironment` <a name="fromEnvironment" id="cdk-devops.VersionInfo.fromEnvironment"></a>

```typescript
import { VersionInfo } from 'cdk-devops'

VersionInfo.fromEnvironment(version: string, environment: string)
```

Create VersionInfo from environment variables.

###### `version`<sup>Required</sup> <a name="version" id="cdk-devops.VersionInfo.fromEnvironment.parameter.version"></a>

- *Type:* string

---

###### `environment`<sup>Required</sup> <a name="environment" id="cdk-devops.VersionInfo.fromEnvironment.parameter.environment"></a>

- *Type:* string

---

##### `fromJson` <a name="fromJson" id="cdk-devops.VersionInfo.fromJson"></a>

```typescript
import { VersionInfo } from 'cdk-devops'

VersionInfo.fromJson(json: string)
```

Create VersionInfo from JSON string.

###### `json`<sup>Required</sup> <a name="json" id="cdk-devops.VersionInfo.fromJson.parameter.json"></a>

- *Type:* string

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.VersionInfo.property.branch">branch</a></code> | <code>string</code> | Git branch name. |
| <code><a href="#cdk-devops.VersionInfo.property.commitCount">commitCount</a></code> | <code>number</code> | Total commit count. |
| <code><a href="#cdk-devops.VersionInfo.property.commitHash">commitHash</a></code> | <code>string</code> | Git commit hash. |
| <code><a href="#cdk-devops.VersionInfo.property.deploymentTime">deploymentTime</a></code> | <code>string</code> | Deployment timestamp. |
| <code><a href="#cdk-devops.VersionInfo.property.deploymentUser">deploymentUser</a></code> | <code>string</code> | Deployment username. |
| <code><a href="#cdk-devops.VersionInfo.property.environment">environment</a></code> | <code>string</code> | Environment/stage name. |
| <code><a href="#cdk-devops.VersionInfo.property.shortCommitHash">shortCommitHash</a></code> | <code>string</code> | Git commit hash (short form, typically 8 characters). |
| <code><a href="#cdk-devops.VersionInfo.property.version">version</a></code> | <code>string</code> | Computed version string. |
| <code><a href="#cdk-devops.VersionInfo.property.buildNumber">buildNumber</a></code> | <code>string</code> | Build number (if available). |
| <code><a href="#cdk-devops.VersionInfo.property.packageVersion">packageVersion</a></code> | <code>string</code> | Package version from package.json (if available). |
| <code><a href="#cdk-devops.VersionInfo.property.pipelineVersion">pipelineVersion</a></code> | <code>string</code> | Pipeline version/execution ID. |
| <code><a href="#cdk-devops.VersionInfo.property.repositoryUrl">repositoryUrl</a></code> | <code>string</code> | Repository URL. |
| <code><a href="#cdk-devops.VersionInfo.property.tag">tag</a></code> | <code>string</code> | Git tag (if available). |

---

##### `branch`<sup>Required</sup> <a name="branch" id="cdk-devops.VersionInfo.property.branch"></a>

```typescript
public readonly branch: string;
```

- *Type:* string

Git branch name.

---

##### `commitCount`<sup>Required</sup> <a name="commitCount" id="cdk-devops.VersionInfo.property.commitCount"></a>

```typescript
public readonly commitCount: number;
```

- *Type:* number

Total commit count.

---

##### `commitHash`<sup>Required</sup> <a name="commitHash" id="cdk-devops.VersionInfo.property.commitHash"></a>

```typescript
public readonly commitHash: string;
```

- *Type:* string

Git commit hash.

---

##### `deploymentTime`<sup>Required</sup> <a name="deploymentTime" id="cdk-devops.VersionInfo.property.deploymentTime"></a>

```typescript
public readonly deploymentTime: string;
```

- *Type:* string

Deployment timestamp.

---

##### `deploymentUser`<sup>Required</sup> <a name="deploymentUser" id="cdk-devops.VersionInfo.property.deploymentUser"></a>

```typescript
public readonly deploymentUser: string;
```

- *Type:* string

Deployment username.

---

##### `environment`<sup>Required</sup> <a name="environment" id="cdk-devops.VersionInfo.property.environment"></a>

```typescript
public readonly environment: string;
```

- *Type:* string

Environment/stage name.

---

##### `shortCommitHash`<sup>Required</sup> <a name="shortCommitHash" id="cdk-devops.VersionInfo.property.shortCommitHash"></a>

```typescript
public readonly shortCommitHash: string;
```

- *Type:* string

Git commit hash (short form, typically 8 characters).

---

##### `version`<sup>Required</sup> <a name="version" id="cdk-devops.VersionInfo.property.version"></a>

```typescript
public readonly version: string;
```

- *Type:* string

Computed version string.

---

##### `buildNumber`<sup>Optional</sup> <a name="buildNumber" id="cdk-devops.VersionInfo.property.buildNumber"></a>

```typescript
public readonly buildNumber: string;
```

- *Type:* string

Build number (if available).

---

##### `packageVersion`<sup>Optional</sup> <a name="packageVersion" id="cdk-devops.VersionInfo.property.packageVersion"></a>

```typescript
public readonly packageVersion: string;
```

- *Type:* string

Package version from package.json (if available).

---

##### `pipelineVersion`<sup>Optional</sup> <a name="pipelineVersion" id="cdk-devops.VersionInfo.property.pipelineVersion"></a>

```typescript
public readonly pipelineVersion: string;
```

- *Type:* string

Pipeline version/execution ID.

---

##### `repositoryUrl`<sup>Optional</sup> <a name="repositoryUrl" id="cdk-devops.VersionInfo.property.repositoryUrl"></a>

```typescript
public readonly repositoryUrl: string;
```

- *Type:* string

Repository URL.

---

##### `tag`<sup>Optional</sup> <a name="tag" id="cdk-devops.VersionInfo.property.tag"></a>

```typescript
public readonly tag: string;
```

- *Type:* string

Git tag (if available).

---


### VersionInfoBuilder <a name="VersionInfoBuilder" id="cdk-devops.VersionInfoBuilder"></a>

Builder for VersionInfo.

#### Initializers <a name="Initializers" id="cdk-devops.VersionInfoBuilder.Initializer"></a>

```typescript
import { VersionInfoBuilder } from 'cdk-devops'

new VersionInfoBuilder()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-devops.VersionInfoBuilder.buildVersionInfo">buildVersionInfo</a></code> | Build the VersionInfo instance. |
| <code><a href="#cdk-devops.VersionInfoBuilder.withBuildNumber">withBuildNumber</a></code> | Set build number. |
| <code><a href="#cdk-devops.VersionInfoBuilder.withDeploymentTime">withDeploymentTime</a></code> | Set deployment time. |
| <code><a href="#cdk-devops.VersionInfoBuilder.withDeploymentUser">withDeploymentUser</a></code> | Set deployment username. |
| <code><a href="#cdk-devops.VersionInfoBuilder.withEnvironment">withEnvironment</a></code> | Set environment. |
| <code><a href="#cdk-devops.VersionInfoBuilder.withGitInfo">withGitInfo</a></code> | Set git information. |
| <code><a href="#cdk-devops.VersionInfoBuilder.withPackageVersion">withPackageVersion</a></code> | Set package version. |
| <code><a href="#cdk-devops.VersionInfoBuilder.withPipelineVersion">withPipelineVersion</a></code> | Set pipeline version. |
| <code><a href="#cdk-devops.VersionInfoBuilder.withRepositoryUrl">withRepositoryUrl</a></code> | Set repository URL. |
| <code><a href="#cdk-devops.VersionInfoBuilder.withVersion">withVersion</a></code> | Set version string. |

---

##### `buildVersionInfo` <a name="buildVersionInfo" id="cdk-devops.VersionInfoBuilder.buildVersionInfo"></a>

```typescript
public buildVersionInfo(): VersionInfo
```

Build the VersionInfo instance.

##### `withBuildNumber` <a name="withBuildNumber" id="cdk-devops.VersionInfoBuilder.withBuildNumber"></a>

```typescript
public withBuildNumber(buildNumber?: string): VersionInfoBuilder
```

Set build number.

###### `buildNumber`<sup>Optional</sup> <a name="buildNumber" id="cdk-devops.VersionInfoBuilder.withBuildNumber.parameter.buildNumber"></a>

- *Type:* string

---

##### `withDeploymentTime` <a name="withDeploymentTime" id="cdk-devops.VersionInfoBuilder.withDeploymentTime"></a>

```typescript
public withDeploymentTime(deploymentTime?: string): VersionInfoBuilder
```

Set deployment time.

###### `deploymentTime`<sup>Optional</sup> <a name="deploymentTime" id="cdk-devops.VersionInfoBuilder.withDeploymentTime.parameter.deploymentTime"></a>

- *Type:* string

---

##### `withDeploymentUser` <a name="withDeploymentUser" id="cdk-devops.VersionInfoBuilder.withDeploymentUser"></a>

```typescript
public withDeploymentUser(deploymentUser?: string): VersionInfoBuilder
```

Set deployment username.

###### `deploymentUser`<sup>Optional</sup> <a name="deploymentUser" id="cdk-devops.VersionInfoBuilder.withDeploymentUser.parameter.deploymentUser"></a>

- *Type:* string

---

##### `withEnvironment` <a name="withEnvironment" id="cdk-devops.VersionInfoBuilder.withEnvironment"></a>

```typescript
public withEnvironment(environment: string): VersionInfoBuilder
```

Set environment.

###### `environment`<sup>Required</sup> <a name="environment" id="cdk-devops.VersionInfoBuilder.withEnvironment.parameter.environment"></a>

- *Type:* string

---

##### `withGitInfo` <a name="withGitInfo" id="cdk-devops.VersionInfoBuilder.withGitInfo"></a>

```typescript
public withGitInfo(gitInfo: GitInfo): VersionInfoBuilder
```

Set git information.

###### `gitInfo`<sup>Required</sup> <a name="gitInfo" id="cdk-devops.VersionInfoBuilder.withGitInfo.parameter.gitInfo"></a>

- *Type:* <a href="#cdk-devops.GitInfo">GitInfo</a>

---

##### `withPackageVersion` <a name="withPackageVersion" id="cdk-devops.VersionInfoBuilder.withPackageVersion"></a>

```typescript
public withPackageVersion(packageVersion?: string): VersionInfoBuilder
```

Set package version.

###### `packageVersion`<sup>Optional</sup> <a name="packageVersion" id="cdk-devops.VersionInfoBuilder.withPackageVersion.parameter.packageVersion"></a>

- *Type:* string

---

##### `withPipelineVersion` <a name="withPipelineVersion" id="cdk-devops.VersionInfoBuilder.withPipelineVersion"></a>

```typescript
public withPipelineVersion(pipelineVersion?: string): VersionInfoBuilder
```

Set pipeline version.

###### `pipelineVersion`<sup>Optional</sup> <a name="pipelineVersion" id="cdk-devops.VersionInfoBuilder.withPipelineVersion.parameter.pipelineVersion"></a>

- *Type:* string

---

##### `withRepositoryUrl` <a name="withRepositoryUrl" id="cdk-devops.VersionInfoBuilder.withRepositoryUrl"></a>

```typescript
public withRepositoryUrl(repositoryUrl?: string): VersionInfoBuilder
```

Set repository URL.

###### `repositoryUrl`<sup>Optional</sup> <a name="repositoryUrl" id="cdk-devops.VersionInfoBuilder.withRepositoryUrl.parameter.repositoryUrl"></a>

- *Type:* string

---

##### `withVersion` <a name="withVersion" id="cdk-devops.VersionInfoBuilder.withVersion"></a>

```typescript
public withVersion(version: string): VersionInfoBuilder
```

Set version string.

###### `version`<sup>Required</sup> <a name="version" id="cdk-devops.VersionInfoBuilder.withVersion.parameter.version"></a>

- *Type:* string

---




### VersioningOutputsFactory <a name="VersioningOutputsFactory" id="cdk-devops.VersioningOutputsFactory"></a>

Factory class for creating versioning output configurations.

#### Initializers <a name="Initializers" id="cdk-devops.VersioningOutputsFactory.Initializer"></a>

```typescript
import { VersioningOutputsFactory } from 'cdk-devops'

new VersioningOutputsFactory()
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |

---


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-devops.VersioningOutputsFactory.cloudFormationOnly">cloudFormationOnly</a></code> | CloudFormation-only output configuration. |
| <code><a href="#cdk-devops.VersioningOutputsFactory.hierarchicalParameters">hierarchicalParameters</a></code> | Hierarchical Parameter Store configuration. |
| <code><a href="#cdk-devops.VersioningOutputsFactory.minimal">minimal</a></code> | Minimal output configuration with only CloudFormation outputs. |
| <code><a href="#cdk-devops.VersioningOutputsFactory.standard">standard</a></code> | Standard output configuration with CloudFormation and Parameter Store. |

---

##### `cloudFormationOnly` <a name="cloudFormationOnly" id="cdk-devops.VersioningOutputsFactory.cloudFormationOnly"></a>

```typescript
import { VersioningOutputsFactory } from 'cdk-devops'

VersioningOutputsFactory.cloudFormationOnly(options?: CloudFormationOnlyOptions)
```

CloudFormation-only output configuration.

###### `options`<sup>Optional</sup> <a name="options" id="cdk-devops.VersioningOutputsFactory.cloudFormationOnly.parameter.options"></a>

- *Type:* <a href="#cdk-devops.CloudFormationOnlyOptions">CloudFormationOnlyOptions</a>

---

##### `hierarchicalParameters` <a name="hierarchicalParameters" id="cdk-devops.VersioningOutputsFactory.hierarchicalParameters"></a>

```typescript
import { VersioningOutputsFactory } from 'cdk-devops'

VersioningOutputsFactory.hierarchicalParameters(basePath: string, options?: HierarchicalParametersOptions)
```

Hierarchical Parameter Store configuration.

###### `basePath`<sup>Required</sup> <a name="basePath" id="cdk-devops.VersioningOutputsFactory.hierarchicalParameters.parameter.basePath"></a>

- *Type:* string

---

###### `options`<sup>Optional</sup> <a name="options" id="cdk-devops.VersioningOutputsFactory.hierarchicalParameters.parameter.options"></a>

- *Type:* <a href="#cdk-devops.HierarchicalParametersOptions">HierarchicalParametersOptions</a>

---

##### `minimal` <a name="minimal" id="cdk-devops.VersioningOutputsFactory.minimal"></a>

```typescript
import { VersioningOutputsFactory } from 'cdk-devops'

VersioningOutputsFactory.minimal()
```

Minimal output configuration with only CloudFormation outputs.

##### `standard` <a name="standard" id="cdk-devops.VersioningOutputsFactory.standard"></a>

```typescript
import { VersioningOutputsFactory } from 'cdk-devops'

VersioningOutputsFactory.standard(options?: StandardOutputOptions)
```

Standard output configuration with CloudFormation and Parameter Store.

###### `options`<sup>Optional</sup> <a name="options" id="cdk-devops.VersioningOutputsFactory.standard.parameter.options"></a>

- *Type:* <a href="#cdk-devops.StandardOutputOptions">StandardOutputOptions</a>

---



### VersioningStrategy <a name="VersioningStrategy" id="cdk-devops.VersioningStrategy"></a>

- *Implements:* <a href="#cdk-devops.IVersioningStrategy">IVersioningStrategy</a>

Versioning strategy implementation.


#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-devops.VersioningStrategy.buildNumber">buildNumber</a></code> | Strategy using build number and commit information Format: build-{commit-count}-{commit-hash:8}. |
| <code><a href="#cdk-devops.VersioningStrategy.commitCount">commitCount</a></code> | Strategy using commit count Format: 0.0.{commit-count}. |
| <code><a href="#cdk-devops.VersioningStrategy.commitHash">commitHash</a></code> | Strategy using commit hash Format: {commit-hash:8}. |
| <code><a href="#cdk-devops.VersioningStrategy.create">create</a></code> | Create a custom versioning strategy. |
| <code><a href="#cdk-devops.VersioningStrategy.gitTag">gitTag</a></code> | Strategy using git tags as version source Format: {git-tag} or {git-tag}-{commit-count} if not on a tag. |
| <code><a href="#cdk-devops.VersioningStrategy.gitTagWithDevVersions">gitTagWithDevVersions</a></code> | Strategy combining git tag with commit count for non-tagged commits Format: {git-tag} or {git-tag}-dev.{commit-count}. |
| <code><a href="#cdk-devops.VersioningStrategy.packageJson">packageJson</a></code> | Strategy using package.json version Format: {package-version}. |
| <code><a href="#cdk-devops.VersioningStrategy.packageWithBranch">packageWithBranch</a></code> | Strategy combining package version with branch and commit info Format: {package-version}-{branch}.{commit-count}. |
| <code><a href="#cdk-devops.VersioningStrategy.semanticWithPatch">semanticWithPatch</a></code> | Semantic versioning strategy with automatic patch increment Format: {package-version}.{commit-count}. |

---

##### `buildNumber` <a name="buildNumber" id="cdk-devops.VersioningStrategy.buildNumber"></a>

```typescript
import { VersioningStrategy } from 'cdk-devops'

VersioningStrategy.buildNumber(config?: BuildNumberConfig)
```

Strategy using build number and commit information Format: build-{commit-count}-{commit-hash:8}.

###### `config`<sup>Optional</sup> <a name="config" id="cdk-devops.VersioningStrategy.buildNumber.parameter.config"></a>

- *Type:* <a href="#cdk-devops.BuildNumberConfig">BuildNumberConfig</a>

---

##### `commitCount` <a name="commitCount" id="cdk-devops.VersioningStrategy.commitCount"></a>

```typescript
import { VersioningStrategy } from 'cdk-devops'

VersioningStrategy.commitCount(config?: CommitCountConfig)
```

Strategy using commit count Format: 0.0.{commit-count}.

###### `config`<sup>Optional</sup> <a name="config" id="cdk-devops.VersioningStrategy.commitCount.parameter.config"></a>

- *Type:* <a href="#cdk-devops.CommitCountConfig">CommitCountConfig</a>

---

##### `commitHash` <a name="commitHash" id="cdk-devops.VersioningStrategy.commitHash"></a>

```typescript
import { VersioningStrategy } from 'cdk-devops'

VersioningStrategy.commitHash()
```

Strategy using commit hash Format: {commit-hash:8}.

##### `create` <a name="create" id="cdk-devops.VersioningStrategy.create"></a>

```typescript
import { VersioningStrategy } from 'cdk-devops'

VersioningStrategy.create(format: string, components?: VersioningStrategyComponents)
```

Create a custom versioning strategy.

###### `format`<sup>Required</sup> <a name="format" id="cdk-devops.VersioningStrategy.create.parameter.format"></a>

- *Type:* string

---

###### `components`<sup>Optional</sup> <a name="components" id="cdk-devops.VersioningStrategy.create.parameter.components"></a>

- *Type:* <a href="#cdk-devops.VersioningStrategyComponents">VersioningStrategyComponents</a>

---

##### `gitTag` <a name="gitTag" id="cdk-devops.VersioningStrategy.gitTag"></a>

```typescript
import { VersioningStrategy } from 'cdk-devops'

VersioningStrategy.gitTag(config?: GitTagConfig)
```

Strategy using git tags as version source Format: {git-tag} or {git-tag}-{commit-count} if not on a tag.

###### `config`<sup>Optional</sup> <a name="config" id="cdk-devops.VersioningStrategy.gitTag.parameter.config"></a>

- *Type:* <a href="#cdk-devops.GitTagConfig">GitTagConfig</a>

---

##### `gitTagWithDevVersions` <a name="gitTagWithDevVersions" id="cdk-devops.VersioningStrategy.gitTagWithDevVersions"></a>

```typescript
import { VersioningStrategy } from 'cdk-devops'

VersioningStrategy.gitTagWithDevVersions(config?: GitTagConfig)
```

Strategy combining git tag with commit count for non-tagged commits Format: {git-tag} or {git-tag}-dev.{commit-count}.

###### `config`<sup>Optional</sup> <a name="config" id="cdk-devops.VersioningStrategy.gitTagWithDevVersions.parameter.config"></a>

- *Type:* <a href="#cdk-devops.GitTagConfig">GitTagConfig</a>

---

##### `packageJson` <a name="packageJson" id="cdk-devops.VersioningStrategy.packageJson"></a>

```typescript
import { VersioningStrategy } from 'cdk-devops'

VersioningStrategy.packageJson(config?: PackageJsonConfig)
```

Strategy using package.json version Format: {package-version}.

###### `config`<sup>Optional</sup> <a name="config" id="cdk-devops.VersioningStrategy.packageJson.parameter.config"></a>

- *Type:* <a href="#cdk-devops.PackageJsonConfig">PackageJsonConfig</a>

---

##### `packageWithBranch` <a name="packageWithBranch" id="cdk-devops.VersioningStrategy.packageWithBranch"></a>

```typescript
import { VersioningStrategy } from 'cdk-devops'

VersioningStrategy.packageWithBranch(config?: PackageJsonConfig)
```

Strategy combining package version with branch and commit info Format: {package-version}-{branch}.{commit-count}.

###### `config`<sup>Optional</sup> <a name="config" id="cdk-devops.VersioningStrategy.packageWithBranch.parameter.config"></a>

- *Type:* <a href="#cdk-devops.PackageJsonConfig">PackageJsonConfig</a>

---

##### `semanticWithPatch` <a name="semanticWithPatch" id="cdk-devops.VersioningStrategy.semanticWithPatch"></a>

```typescript
import { VersioningStrategy } from 'cdk-devops'

VersioningStrategy.semanticWithPatch(config?: PackageJsonConfig)
```

Semantic versioning strategy with automatic patch increment Format: {package-version}.{commit-count}.

###### `config`<sup>Optional</sup> <a name="config" id="cdk-devops.VersioningStrategy.semanticWithPatch.parameter.config"></a>

- *Type:* <a href="#cdk-devops.PackageJsonConfig">PackageJsonConfig</a>

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.VersioningStrategy.property.components">components</a></code> | <code><a href="#cdk-devops.VersioningStrategyComponents">VersioningStrategyComponents</a></code> | Strategy components configuration. |
| <code><a href="#cdk-devops.VersioningStrategy.property.format">format</a></code> | <code>string</code> | Format string for version computation Supports placeholders: {git-tag}, {package-version}, {commit-count}, {commit-hash}, {branch}, {build-number}. |

---

##### `components`<sup>Required</sup> <a name="components" id="cdk-devops.VersioningStrategy.property.components"></a>

```typescript
public readonly components: VersioningStrategyComponents;
```

- *Type:* <a href="#cdk-devops.VersioningStrategyComponents">VersioningStrategyComponents</a>

Strategy components configuration.

---

##### `format`<sup>Required</sup> <a name="format" id="cdk-devops.VersioningStrategy.property.format"></a>

```typescript
public readonly format: string;
```

- *Type:* string

Format string for version computation Supports placeholders: {git-tag}, {package-version}, {commit-count}, {commit-hash}, {branch}, {build-number}.

---


## Protocols <a name="Protocols" id="Protocols"></a>

### IVersionInfo <a name="IVersionInfo" id="cdk-devops.IVersionInfo"></a>

- *Implemented By:* <a href="#cdk-devops.VersionInfo">VersionInfo</a>, <a href="#cdk-devops.IVersionInfo">IVersionInfo</a>

Version information interface.


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.IVersionInfo.property.branch">branch</a></code> | <code>string</code> | Git branch name. |
| <code><a href="#cdk-devops.IVersionInfo.property.commitCount">commitCount</a></code> | <code>number</code> | Total commit count. |
| <code><a href="#cdk-devops.IVersionInfo.property.commitHash">commitHash</a></code> | <code>string</code> | Git commit hash. |
| <code><a href="#cdk-devops.IVersionInfo.property.deploymentTime">deploymentTime</a></code> | <code>string</code> | Deployment timestamp. |
| <code><a href="#cdk-devops.IVersionInfo.property.deploymentUser">deploymentUser</a></code> | <code>string</code> | Deployment username. |
| <code><a href="#cdk-devops.IVersionInfo.property.environment">environment</a></code> | <code>string</code> | Environment/stage name. |
| <code><a href="#cdk-devops.IVersionInfo.property.shortCommitHash">shortCommitHash</a></code> | <code>string</code> | Git commit hash (short form, typically 8 characters). |
| <code><a href="#cdk-devops.IVersionInfo.property.version">version</a></code> | <code>string</code> | Computed version string. |
| <code><a href="#cdk-devops.IVersionInfo.property.buildNumber">buildNumber</a></code> | <code>string</code> | Build number (if available). |
| <code><a href="#cdk-devops.IVersionInfo.property.packageVersion">packageVersion</a></code> | <code>string</code> | Package version from package.json (if available). |
| <code><a href="#cdk-devops.IVersionInfo.property.pipelineVersion">pipelineVersion</a></code> | <code>string</code> | Pipeline version/execution ID. |
| <code><a href="#cdk-devops.IVersionInfo.property.repositoryUrl">repositoryUrl</a></code> | <code>string</code> | Repository URL. |
| <code><a href="#cdk-devops.IVersionInfo.property.tag">tag</a></code> | <code>string</code> | Git tag (if available). |

---

##### `branch`<sup>Required</sup> <a name="branch" id="cdk-devops.IVersionInfo.property.branch"></a>

```typescript
public readonly branch: string;
```

- *Type:* string

Git branch name.

---

##### `commitCount`<sup>Required</sup> <a name="commitCount" id="cdk-devops.IVersionInfo.property.commitCount"></a>

```typescript
public readonly commitCount: number;
```

- *Type:* number

Total commit count.

---

##### `commitHash`<sup>Required</sup> <a name="commitHash" id="cdk-devops.IVersionInfo.property.commitHash"></a>

```typescript
public readonly commitHash: string;
```

- *Type:* string

Git commit hash.

---

##### `deploymentTime`<sup>Required</sup> <a name="deploymentTime" id="cdk-devops.IVersionInfo.property.deploymentTime"></a>

```typescript
public readonly deploymentTime: string;
```

- *Type:* string

Deployment timestamp.

---

##### `deploymentUser`<sup>Required</sup> <a name="deploymentUser" id="cdk-devops.IVersionInfo.property.deploymentUser"></a>

```typescript
public readonly deploymentUser: string;
```

- *Type:* string

Deployment username.

---

##### `environment`<sup>Required</sup> <a name="environment" id="cdk-devops.IVersionInfo.property.environment"></a>

```typescript
public readonly environment: string;
```

- *Type:* string

Environment/stage name.

---

##### `shortCommitHash`<sup>Required</sup> <a name="shortCommitHash" id="cdk-devops.IVersionInfo.property.shortCommitHash"></a>

```typescript
public readonly shortCommitHash: string;
```

- *Type:* string

Git commit hash (short form, typically 8 characters).

---

##### `version`<sup>Required</sup> <a name="version" id="cdk-devops.IVersionInfo.property.version"></a>

```typescript
public readonly version: string;
```

- *Type:* string

Computed version string.

---

##### `buildNumber`<sup>Optional</sup> <a name="buildNumber" id="cdk-devops.IVersionInfo.property.buildNumber"></a>

```typescript
public readonly buildNumber: string;
```

- *Type:* string

Build number (if available).

---

##### `packageVersion`<sup>Optional</sup> <a name="packageVersion" id="cdk-devops.IVersionInfo.property.packageVersion"></a>

```typescript
public readonly packageVersion: string;
```

- *Type:* string

Package version from package.json (if available).

---

##### `pipelineVersion`<sup>Optional</sup> <a name="pipelineVersion" id="cdk-devops.IVersionInfo.property.pipelineVersion"></a>

```typescript
public readonly pipelineVersion: string;
```

- *Type:* string

Pipeline version/execution ID.

---

##### `repositoryUrl`<sup>Optional</sup> <a name="repositoryUrl" id="cdk-devops.IVersionInfo.property.repositoryUrl"></a>

```typescript
public readonly repositoryUrl: string;
```

- *Type:* string

Repository URL.

---

##### `tag`<sup>Optional</sup> <a name="tag" id="cdk-devops.IVersionInfo.property.tag"></a>

```typescript
public readonly tag: string;
```

- *Type:* string

Git tag (if available).

---

### IVersioningStrategy <a name="IVersioningStrategy" id="cdk-devops.IVersioningStrategy"></a>

- *Implemented By:* <a href="#cdk-devops.VersioningStrategy">VersioningStrategy</a>, <a href="#cdk-devops.IVersioningStrategy">IVersioningStrategy</a>

Versioning strategy interface.


#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-devops.IVersioningStrategy.property.components">components</a></code> | <code><a href="#cdk-devops.VersioningStrategyComponents">VersioningStrategyComponents</a></code> | Strategy components configuration. |
| <code><a href="#cdk-devops.IVersioningStrategy.property.format">format</a></code> | <code>string</code> | Format string for version computation Supports placeholders: {git-tag}, {package-version}, {commit-count}, {commit-hash}, {branch}, {build-number}. |

---

##### `components`<sup>Required</sup> <a name="components" id="cdk-devops.IVersioningStrategy.property.components"></a>

```typescript
public readonly components: VersioningStrategyComponents;
```

- *Type:* <a href="#cdk-devops.VersioningStrategyComponents">VersioningStrategyComponents</a>

Strategy components configuration.

---

##### `format`<sup>Required</sup> <a name="format" id="cdk-devops.IVersioningStrategy.property.format"></a>

```typescript
public readonly format: string;
```

- *Type:* string

Format string for version computation Supports placeholders: {git-tag}, {package-version}, {commit-count}, {commit-hash}, {branch}, {build-number}.

---

## Enums <a name="Enums" id="Enums"></a>

### CiProvider <a name="CiProvider" id="cdk-devops.CiProvider"></a>

CI/CD provider type.

#### Members <a name="Members" id="Members"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-devops.CiProvider.GITHUB">GITHUB</a></code> | *No description.* |
| <code><a href="#cdk-devops.CiProvider.GITLAB">GITLAB</a></code> | *No description.* |
| <code><a href="#cdk-devops.CiProvider.CODEBUILD">CODEBUILD</a></code> | *No description.* |
| <code><a href="#cdk-devops.CiProvider.UNKNOWN">UNKNOWN</a></code> | *No description.* |

---

##### `GITHUB` <a name="GITHUB" id="cdk-devops.CiProvider.GITHUB"></a>

---


##### `GITLAB` <a name="GITLAB" id="cdk-devops.CiProvider.GITLAB"></a>

---


##### `CODEBUILD` <a name="CODEBUILD" id="cdk-devops.CiProvider.CODEBUILD"></a>

---


##### `UNKNOWN` <a name="UNKNOWN" id="cdk-devops.CiProvider.UNKNOWN"></a>

---

