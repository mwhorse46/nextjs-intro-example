"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.printAndExit = printAndExit;

function printAndExit(message) {
  var code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  if (code === 0) {
    console.log(message);
  } else {
    console.error(message);
  }

  process.exit(code);
}