define([
	"dojo/_base/declare",
	"dojo/_base/lang"
], function (
	declare,
	lang
) {
	return declare("Parser", [], {
		/**
		 * @description Constants for substitution matching on template
		 */
		SUBSTITUTIONS_ALL: /\{\{([^\s\|\}]+)\|?([^\s\|\}]+)?\}\}/g,
		SUBSTITUTIONS_FIRST:  /\{\{([^\s\|\}]+)\|?([^\s\|\}]+)?\}\}/,

		/**
		 * @description Counts the number of substitutions in a given string
		 * @param str {string} Template to look for substitutions in
		 * @returns {Number} Number of bindings found
		 */
		_bindingCount: function (str) {
			var matches = str.match(this.SUBSTITUTIONS_ALL);
			return matches ? matches.length : 0;
		}
	});
});
