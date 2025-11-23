import { awscdk, javascript, github, ReleasableCommits } from 'projen';
import { ReleaseTrigger } from 'projen/lib/release';
import { GitHubAssignApprover } from 'projen-pipelines';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'The Open Construct Foundation',
  authorAddress: 'info@taimos.de',
  authorOrganization: true,
  copyrightOwner: 'The Open Construct Foundation',
  copyrightPeriod: '2024',
  cdkVersion: '2.222.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.9.0',
  constructsVersion: '10.4.2',
  name: 'cdk-devops',
  packageManager: javascript.NodePackageManager.NPM,
  licensed: true,
  license: 'Apache-2.0',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/open-constructs/cdk-devops.git',
  autoApproveUpgrades: true,
  autoApproveOptions: { allowedUsernames: ['hoegertn', 'Lock128', 'open-constructs-projen[bot]'], secret: 'GITHUB_TOKEN' },
  depsUpgradeOptions: { workflowOptions: { schedule: javascript.UpgradeDependenciesSchedule.WEEKLY } },
  githubOptions: {
    projenCredentials: github.GithubCredentials.fromApp(),
    pullRequestLintOptions: {
      semanticTitleOptions: {
        types: ['feat', 'fix', 'chore', 'ci', 'docs', 'style', 'refactor', 'test', 'revert', 'Revert'],
      },
    },
  },
  releasableCommits: ReleasableCommits.ofType(['feat', 'fix', 'revert', 'Revert', 'docs']),
  releaseTrigger: ReleaseTrigger.manual(),
  devDeps: [
    'projen-pipelines'
  ]
  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});

project.jest?.addSetupFileAfterEnv('<rootDir>/test/jest.setup.ts');

new GitHubAssignApprover(project, {
  approverMapping: [
    { author: 'hoegertn', approvers: ['Lock128'] },
    { author: 'Lock128', approvers: ['hoegertn'] },
  ],
  defaultApprovers: ['hoegertn', 'Lock128'],
});

project.synth();