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
		 * @description Keeps all registered setter types
		 * @type {Object}
		 */
		_setters: {},

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
				setter.call(context, arguments);
			}.bind(context, configObj);
		},

		/**
		 * Registers a setter function on the object
		 * @param type {Number} Setter type (ie. SETTER_REPEATER, etc.)
		 * @param fn {Function} The function corresponding to this type
		 * of setter
		 */
		_registerSetter: function (type, fn) {
			this._setters[type] = fn;
		}
	});
});
