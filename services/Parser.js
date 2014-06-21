define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"indium/services/BindingStore"
], function (
	declare,
	lang,
	BindingStore
) {
	/**
	 * @module Parser
	 * @description Provides the compiler with string interpolating and expression
	 * parsing capabilities
	 */
	return declare("Parser", [BindingStore], {
		/**
		 * @description Constants for substitution matching on template
		 */
		EXPRESSIONS_ALL: /\{\{([^\s\|\}]+)\|?([^\s\|\}]+)?\}\}/g,
		EXPRESSION_ONCE:  /\{\{([^\s\|\}]+)\|?([^\s\|\}]+)?\}\}/,

		/**
		 * @description Returns and interpolation function along with separators
		 * and expressions. The interpolation function takes a context as an argument
		 * and returns the interpolated string
		 * @param str {string} String to be interpolated
		 * @return interpolationFn {Function} Returns parts, separators, expressions
		 * and Interpolation Function
		 */
		interpolateString: function (str) {
			var parts, pattern = this.EXPRESSIONS_ALL,
				getValue = this._getObjectByName.bind(this);

			if (!this._bindingCount(str)) {
				throw new Error("Interpolate received a string without expressions: " + str);
			}

			parts = this._getStringParts(str);

			var interpolationFn = function (context) {
				return str.replace(pattern, function (match, binding, formatFn) {
					var value = getValue(binding, context);
					if (typeof value !== "undefined") {
						return lang.isFunction(context[formatFn]) ?
							context[formatFn](value) : value;
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
		 * Returns the binding's value according to its type. Results in undefined
		 * if value is not found
		 * @param name {string} name of binding as per $bindingStore
		 * @param context {Object} Context to search for the object in
		 * @returns {*} Value of the object
		 */
		_getObjectByName: function (name, context) {
			var parts = name.split("."),
				obj = lang.getObject(parts[0], false, context);

			if (obj && lang.isFunction(obj.get) && parts[1]) {
				return obj.get(parts[1]);
			} else {
				return lang.getObject(name, false, context);
			}
		},

		/**
		 * @description Splits a string and returns its parts, expressions and
		 * expression separators
		 * @param str {string} The string to split
		 * @returns {{parts: Array, expressions: Array, separators: Array}}
		 */
		_getStringParts: function (str) {
			var parts = [], separators = [], expressions = [],
				remainingString = str;

			str.replace(this.EXPRESSIONS_ALL, function (expression) {
				var remainingParts = remainingString.split(expression),
					leftSide = remainingParts.shift(),
					rightSide = remainingParts.join(expression);

				if (leftSide.length > 0) {
					separators.push(leftSide);
					parts.push(leftSide);
				}

				expressions.push(expression);
				parts.push(expression);

				remainingString = rightSide;
			});

			if (remainingString && remainingString.length > 0) {
				separators.push(remainingString);
				parts.push(remainingString);
			}

			return {
				parts: parts,
				expressions: expressions,
				separators: separators
			};
		},

		/**
		 * Takes an expression and returns the binding name and formatting
		 * function
		 * @param expression {string} The expression to evaluate
		 * @returns {{binding: *, formatFn: *}}
		 */
		parseExpression: function (expression) {
			var data = expression.match(this.EXPRESSION_ONCE);
			if (data) {
				return {
					binding: data[1],
					formatFn: data[2]
				};
			}
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
