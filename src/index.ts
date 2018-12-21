const octokit = require('@octokit/rest')();
const dotenv = require('dotenv');

dotenv.config();

const token = process.env.GITHUB_TOKEN;

const flags: { [key:string]: string } = {
  preview: 'aio: preview',
  docs: 'comp: docs',
  effort: 'effort1: hours',
  cleanup: 'PR action: cleanup',
  review: 'PR action: review',
  targets: 'PR target: master & patch',
  blocked: 'PR state: blocked',
  low: 'risk: low',
  comm: 'state: community',
  edit: 'subtype: docs-edit',
  fix: 'type: bug/fix',
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
 * PR action: cleanup
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

function getLabels(args: { [key: string]: any}) {
  let labels = [];

  // common flag
  if (args.common) {
    labels.push(...[
      flags.docs,
      flags.effort,
      flags.low,
      flags.targets,
      flags.comm,
      args.ref ? flags.ref : (args.feat ? flags.feat : flags.fix)
    ]);
  }

  // get additional labels
  const flagLabels = Object.entries(args).reduce((currentLabels: string[], [key, value]: [string, any]) => {
    if (flags[key]) {
      currentLabels.push(flags[key]);
    }

    return currentLabels;
  }, []);

  return [...labels, ...flagLabels];
}

function main() {
  const cliArgs = require('yargs').argv;
  const prNumber = cliArgs._[0];

  console.log('authenticate');
  octokit.authenticate({ type: 'token', token });

  const labels = getLabels(cliArgs);
  console.log('add labels', prNumber, labels);
  addLabels(prNumber, labels);
}

main();