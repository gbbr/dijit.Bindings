define([
	"dojo/_base/declare"
], function (
	declare
) {
	return declare("indium/_IndiumViewHelpers", [], {

		_gatherers: [],
		_compilers: [],
		_gathererData: {},

		/**
		 * @description Calls all functions in an array
		 * @param fnList {Array<Function>} Array of functions to be called
		 * @param context {=Object} Context to call the function in
		 * @param argument {=*} A single argument to pass to the function
		 */
		_callFunctions: function(fnList, context, argument) {
			fnList.forEach(function (fn) {
				fn.call(context || this, argument);
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
		},

		/**
		 * @description Adds a gatherer function to be applied to nodes at traversal
		 * @param name {string} Name of the store to intialize for this gatherer
		 * @param fn {Function} The gatherer function
		 */
		_registerGatherer: function (name, fn) {
			this._gathererStore(name);
			this._gatherers.push(fn);
		},

		/**
		 * @description Adds a compiler to be run after the gathering phase
		 * @param fn {Function} The compiler function to run
		 */
		_registerCompiler: function (fn) {
			this._compilers.push(fn);
		},

		/**
		 * @description Returns an existing store or creates a new one
		 * @param name {string} The name of the store to be returned
		 * @returns {Array<*>} Returns an array for storing gatherer data
		 */
		_gathererStore: function (name) {
			if (!this._gathererData.hasOwnProperty(name)) {
				this._gathererData[name] = [];
			}

			return this._gathererData[name];
		},

		/**
		 * @description Clears all gatherer data
		 */
		_clearGathererStore: function () {
			this._gathererData = {};
		}
	});
});
