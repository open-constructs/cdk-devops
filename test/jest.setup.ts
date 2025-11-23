// Clear CI environment variables before tests to ensure isolation
const ciEnvVars = [
  // GitHub Actions
  'GITHUB_SHA',
  'GITHUB_REF',
  'GITHUB_HEAD_REF',
  'GITHUB_ACTIONS',
  // GitLab CI
  'CI_COMMIT_SHA',
  'CI_COMMIT_REF_NAME',
  'CI_COMMIT_TAG',
  'GITLAB_CI',
  // Generic CI
  'GIT_COMMIT',
  'GIT_BRANCH',
  'GIT_TAG',
  // Common
  'COMMIT_COUNT',
  'COMMITS_SINCE_TAG',
];

beforeEach(() => {
  for (const envVar of ciEnvVars) {
    delete process.env[envVar];
  }
});
