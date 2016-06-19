"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = stripAdditionalWhitespaces;
/**
 * Strips all additional whitespaces, tabs and new lines.
 * @param {String} input to be stripped
 * @returns {String} output stripped.
 */
function stripAdditionalWhitespaces(input) {
  return input.replace(/\s\s+/g, '').replace(/&nbsp;/g, " ");
}