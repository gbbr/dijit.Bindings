define([
	"dojo/_base/declare"
], function (
	declare
) {
	return declare("indium/_IndiumViewHelpers", [], {
		/**
		 * @description Calls all functions in an array
		 * @param fnList {Array<Function>} Array of functions to be called
		 * @param context {Object} Context to call the function in
		 * @param argument {*} A single argument to pass to the function
		 */
		_callFunctions: function(fnList, context, argument) {
			fnList.forEach(function (fn) {
				fn.call(context, argument);
			}, this);
		},

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