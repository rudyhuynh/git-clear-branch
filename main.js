#!/usr/bin/env node
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const { version } = require("./package.json");

async function getCurrentBranch() {
  const { stdout } = await exec("git rev-parse --abbrev-ref HEAD");
  return stdout.toString().trim();
}

async function main() {
  console.info(`Version: ${version}`);
  const { stdout, stderr } = await exec("git branch");
  if (stderr) {
    return console.error(stderr);
  }

  const currentBranch = await getCurrentBranch();

  const branches = stdout
    .toString()
    .replace(/\*/g, "")
    .split(/\s/)
    .filter(Boolean)
    .filter(
      (branch) =>
        branch !== "master" && branch !== "main" && branch !== currentBranch
    );

  if (branches.length < 1) {
    console.info(
      "No local branch (except `master` and `main`) to be deleted\n"
    );
    return;
  }

  const deleteBranchCmd = `git branch -D ${branches.join(" ")}`;
  console.info(deleteBranchCmd);
  await exec(deleteBranchCmd);

  console.info("\nDONE!");
  console.info("\n> git branch\n");
  console.info((await exec("git branch")).stdout);
}
main();
