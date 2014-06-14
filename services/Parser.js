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
		EXPRESSIONS_ALL: /\{\{([^\s\|\}]+)\|?([^\s\|\}]+)?\}\}/g,
		EXPRESSION_ONCE:  /\{\{([^\s\|\}]+)\|?([^\s\|\}]+)?\}\}/,

		/**
		 * @description Returns and interpolation function along
		 * with separators and expressions
		 * @param str {string} String to be processed
		 * @return interpolationFn {Object} Returns text, separators, expressions
		 * and Interpolation Function
		 */
		interpolateString: function (str) {
			var separators = [],
				expressions = [],
				parts = [],
				remainingString = str,
				remainingParts,
				pattern = this.EXPRESSIONS_ALL;

			if (!this._bindingCount(str)) {
				throw new Error("Interpolate received a string without expressions: " + str);
			}

			// Find expressions and separators
			str.replace(pattern, function (match) {
				remainingParts = remainingString.split(match);

				if (remainingParts[0].length > 0) {
					separators.push(remainingParts[0]);
					parts.push(remainingParts[0]);
				}

				expressions.push(match);
				parts.push(match);

				remainingString = remainingParts[1];
			});

			if (remainingString.length > 0) {
				separators.push(remainingString);
				parts.push(remainingString);
			}

			// Interpolation function
			var interpolationFn = function (context) {
				return str.replace(pattern, function (match, binding, formatFn) {
					if (context.hasOwnProperty(binding)) {
						return lang.isFunction(context[formatFn]) ?
							context[formatFn](context[binding]) : context[binding];
					} else {
						return match;
					}
				});
			};

			// All expressions and separators in an array, under
			// their original order
			interpolationFn.parts = parts;
			// Array of separators in their original order
			interpolationFn.separators = separators;
			// Array of expressions found in the string
			interpolationFn.expressions = expressions;

			return interpolationFn;
		},

		parseExpression: function (expression) {
			var data;

			expression.replace(this.EXPRESSION_ONCE, function (match, binding, formatFn) {
				data = {
					binding: binding,
					formatFn: formatFn
				}
			});

			return data;
		},

		/**
		 * @description Counts the number of substitutions in a given string
		 * @param str {string} Template to look for substitutions in
		 * @returns {Number} Number of bindings found
		 */
		_bindingCount: function (str) {
			var matches = str.match(this.EXPRESSIONS_ALL);
			return matches ? matches.length : 0;
		}
	});
});
