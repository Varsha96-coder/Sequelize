var getArgs = process.argv.slice(2);
console.log("myArgs: ", getArgs[0]);

if (myArgs == "load") {
  console.log(" write command -> 'node load.js' ");
} else if (myArgs == "analyze") {
  console.log(" write command -> 'node analyze.js' ");
} else {
  console.log("Invalid function name");
}
