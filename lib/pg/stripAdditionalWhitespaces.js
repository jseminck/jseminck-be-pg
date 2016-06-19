/**
 * Strips all additional whitespaces, tabs and new lines.
 * @param {String} input to be stripped
 * @returns {String} output stripped.
 */
export default function stripAdditionalWhitespaces(input) {
    return input.replace(/\s\s+/g, '').replace(/&nbsp;/g, " ");
}