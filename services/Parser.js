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
		 * @description Returns and interpolation function along with separators
		 * and expressions. The interpolation function takes a context as argument
		 * and returns the interpolated string
		 * @param str {string} String to be interpolated
		 * @return interpolationFn {Function} Returns parts, separators, expressions
		 * and Interpolation Function
		 */
		interpolateString: function (str) {
			var parts, pattern = this.EXPRESSIONS_ALL;

			if (!this._bindingCount(str)) {
				throw new Error("Interpolate received a string without expressions: " + str);
			}

			parts = this._getStringParts(str);

			var interpolationFn = function (context) {
				return str.replace(pattern, function (match, binding, formatFn) {
					// get binding from context via .get if model
					if (context.hasOwnProperty(binding)) {
						return lang.isFunction(context[formatFn]) ?
							context[formatFn](context[binding]) : context[binding];
					} else {
						return match;
					}
				});
			};

			interpolationFn.parts = parts.parts;
			interpolationFn.separators = parts.separators;
			interpolationFn.expressions = parts.expressions;

			return interpolationFn;
		},

		/**
		 * @description Splits a string and returns its parts, expressions and
		 * expression separators
		 * @param str {string} The string to split
		 * @returns {{parts: Array, expressions: Array, separators: Array}}
		 */
		_getStringParts: function (str) {
			var parts = [],
				separators = [],
				expressions = [],
				remainingString = str;

			str.replace(this.EXPRESSIONS_ALL, function (expression) {
				var remainingParts = remainingString.split(expression),
					leftSide = remainingParts[0],
					rightSide = remainingParts[1];

				if (leftSide.length > 0) {
					separators.push(leftSide);
					parts.push(leftSide);
				}

				expressions.push(expression);
				parts.push(expression);

				remainingString = rightSide;
			});

			if (remainingString.length > 0) {
				separators.push(remainingString);
				parts.push(remainingString);
			}

			return {
				parts: parts,
				expressions: expressions,
				separators: separators
			};
		},

		parseExpression: function (expression) {
			var data;

			expression.replace(this.EXPRESSION_ONCE, function (match, binding, formatFn) {
				data = {
					binding: binding,
					formatFn: formatFn
				};
			});

			return data;
		},

		/**
		 * @description Counts the number of substitutions in a given string
		 * @param str {string} Template to look for substitutions in
		 * @returns {Number} Number of bindings found
		 */
		_bindingCount: function (str) {
			if (typeof str !== "string") {
				return 0;
			}
			var matches = str.match(this.EXPRESSIONS_ALL);
			return matches ? matches.length : 0;
		}
	});
});
