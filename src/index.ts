const octokit = require('@octokit/rest')();
const dotenv = require('dotenv');

dotenv.config();

const token = process.env.GITHUB_TOKEN;

async function addLabels(prNumber: number, labels: string[], owner = 'brandonroberts', repo = 'angular') {
  const result = await octokit.issues.addLabels({owner, repo, number: prNumber, labels});

  console.log('Result', result);
}

function main() {
  console.log('authenticate');
  octokit.authenticate({ type: 'token', token });

  console.log('add label');
  addLabels(1, ['enhancement']);
}

main();