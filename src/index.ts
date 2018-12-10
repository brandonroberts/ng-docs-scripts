const octokit = require('@octokit/rest')();
const dotenv = require('dotenv');
const args = require('yargs').argv;

dotenv.config();

const token = process.env.GITHUB_TOKEN;

const flags = {
  preview: 'aio: preview',
  docs: 'comp: docs',
  effort: 'effort1: hours',
  review: 'PR action: review',
  targets: 'PR target: master & patch',
  blocked: 'PR state: blocked',
  low: 'risk: low',
  comm: 'state: community',
  edit: 'subtype: docs-edit',
  fix: 'type: bugfix',
  feat: 'type: feature',
  ref: 'type: refactor'
};

/**
 * @description
 * Adds labels to the provided PR in the angular/angular repo for docs
 * 
 * Frequently used labels:
 * aio: preview
 * comp: docs
 * effort1: hours
 * PR action: review
 * PR target: master & patch
 * PR state: blocked
 * risk: low
 * state: community
 * subtype: docs-edit
 * type: bugfix
 * type: feature
 * type: refactor
 * 
 * @param prNumber 
 * @param labels 
 * @param owner 
 * @param repo 
 */
async function addLabels(prNumber: number, labels: string[], owner = 'angular', repo = 'angular') {
  // look for common flags
  const result = await octokit.issues.addLabels({owner, repo, number: prNumber, labels});

  console.log('Result', result);
}

function getFlags() {
  let labels = [];

  // common flag
  if (args.common) {
    labels.push(...[
      flags.preview,
      flags.docs,
      flags.effort,
      flags.low,
      flags.targets,
      flags.comm,
      flags.fix
    ]);
  }
}

function main() {
  console.log('authenticate');
  octokit.authenticate({ type: 'token', token });

  console.log('add label');
  addLabels(1, ['enhancement']);
}

main();