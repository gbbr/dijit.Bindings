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
		 * @return interpolationFn {Function} Returns parts, separators, expressions
		 * and Interpolation Function
		 */
		interpolateString: function (str) {
			var separators = [],
				expressions = [],
				parts = [],
				remainingString = str,
				pattern = this.EXPRESSIONS_ALL;

			if (!this._bindingCount(str)) {
				throw new Error("Interpolate received a string without expressions: " + str);
			}

			// Find expressions and separators
			str.replace(pattern, function (expression) {
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
			// Array of separators
			interpolationFn.separators = separators;
			// Array of expressions
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
			if (typeof str != "string") {
				return 0;
			}
			var matches = str.match(this.EXPRESSIONS_ALL);
			return matches ? matches.length : 0;
		}
	});
});
