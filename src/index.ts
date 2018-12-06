const token = process.env.GITHUB_API_KEY;
const octokit = require('@octokit/rest')();

octokit.authenticate({ type: 'token', token });