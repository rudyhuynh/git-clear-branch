var spawn = require("child_process").spawn;
var child = spawn("git branch");

child.stdout.on("data", function(chunk) {
  console.log("chunk:", chunk);
});
