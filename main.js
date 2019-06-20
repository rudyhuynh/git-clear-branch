#!/usr/bin/env node
const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function main() {
  const { stdout, stderr } = await exec("git branch");
  if (stderr) {
    return console.error(stderr);
  }
  const branches = stdout
    .toString()
    .replace(/\*/g, "")
    .split(/\s/)
    .filter(Boolean)
    .filter(branch => branch !== "master");

  if (branches.length < 1) {
    console.log("No local branch (except master) to be deleted\n");
    return;
  }
  await exec("git checkout master");
  console.log(
    `Deleting ${branches.length} local branch${
      branches.length > 1 ? "es" : ""
    } except 'master'...`
  );
  await Promise.all(
    branches.map(async branch => {
      await exec(`git branch -D ${branch}`);
    })
  );

  console.log("\nDONE!");
  console.log("\n> git branch\n");
  console.log((await exec("git branch")).stdout);
}
main();
