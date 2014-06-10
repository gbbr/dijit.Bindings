/**
 var set = s.generate(this, s.SETTER_ATTRIBUTE, { node: "htmlelem", formatFn: B })
 set(4) -> [Arguments[2]], 0 - Config object .... 1 - New Value
 */

define([
	"dojo/_base/declare"
], function (
	declare
) {
	return declare("indium/_LinkFunctionFactory", [], {

		/**
		 * @description Implemented setter types
		 */
		SETTER_REPEATER: 1,
		SETTER_ATTRIBUTE: 3,
		SETTER_TEXTNODE: 4,

		/**
		 * @description Keeps all registered setter types
		 * @type {Object}
		 */
		_setters: {},

		/**
		 * @description Creates available setters
		 */
		constructor: function () {
			this._registerSetter(this.SETTER_ATTRIBUTE, this.setNodeAttribute);
			this._registerSetter(this.SETTER_TEXTNODE, this.setNodeValue);
		},

		/**
		 * @description Generates a new setter function of the given type.
		 * Setter functions take a single value attribute and set it on the
		 * node that they have been linked to using the setting type defined.
		 * @param context {Object} The context in which the setter should run
		 * @param type {Number} The setter type (ie. SETTER_ATTRIBUTE, etc.)
		 * @param configObj {Object} Node, formatFn... depending on setter type
		 * @returns {function(value)} Return a setter function
		 */
		generate: function (context, type, configObj) {
			var setter = this._setters[type];
			return function (value) {
				setter.call(context, arguments)
			}.bind(context, configObj);
		},

		/**
		 * Registers a setter function on the object
		 * @param type {Number} Setter type (ie. SETTER_REPEATER, etc.)
		 * @param fn {Function} The function corresponding to this type
		 * of setter
		 * @private
		 */
		_registerSetter: function (type, fn) {
			this._setters[type] = fn;
		},

		/**
		 * @desription Node attribute setter function
		 * @param args {Array<mixed>} Contains two items:
		 * new value to be set on the attribute and a configuration
		 * object describing specifics set during generation
		 */
		setNodeAttribute: function(args) {
			/*
			{
				node,
				attrName,
				value,
				formatFn,
				substitution.name(?)
			}
			*/
			var value = args[1], data = args[0];
		},

		/**
		 * @description Sets a text node's value and passes it through
		 * a transform function if provided
		 * @param args {Array<mixed>} Contains two items:
		 * new value to be set on the text node and a configuration
		 * object describing specifics set during generation
		 */
		setNodeValue: function (args) {
			var value = args[1], data = args[0],
				formatFn = data.formatFn;

			data.node.nodeValue = formatFn ? formatFn.call(this, value) : value;
		}
	});
});