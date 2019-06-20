#!/usr/bin/env node
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { version } = require("./package.json");
async function main() {
  console.info(`Version: ${version}`);

  const { stdout, stderr } = await exec(
    `git checkout master && git branch | grep -v "master" | xargs git branch -D`
  );
  if (stderr) {
    return console.error(stderr);
  }

  console.info("\nDONE!");
  console.info("\n> git branch\n");
  console.info((await exec("git branch")).stdout);
}
main();
