const fs = require("fs");
const path = require("path");

const appPath = path.resolve(__dirname, "..", "app.js");
const code = fs.readFileSync(appPath, "utf8");

new Function(code);

console.log("build-smoke-test OK");
