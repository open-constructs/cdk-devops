import { awscdk, javascript } from 'projen';
import { ReleaseTrigger } from 'projen/lib/release';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Thorsten Hoeger',
  authorAddress: 'thorsten.hoeger@taimos.de',
  cdkVersion: '2.222.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.9.0',
  constructsVersion: '10.4.2',
  name: 'cdk-devops',
  packageManager: javascript.NodePackageManager.NPM,
  projenrcTs: true,
  repositoryUrl: 'https://github.com/open-constructs/cdk-devops.git',
  releaseTrigger: ReleaseTrigger.manual(),
  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});

project.jest?.addSetupFileAfterEnv('<rootDir>/test/jest.setup.ts');

project.synth();