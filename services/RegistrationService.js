// LinkingService ?

define([
	"dojo/_base/declare",
	"dojo/store/Memory",
	"dijit/Destroyable",
	"indium/services/StorageService"
], function (
	declare,
	Memory,
	Destroyable,
	StorageService
) {
	return declare("RegistrationService", [StorageService, Destroyable], {

		_compilers: [],
		_collectors: [],
		_setters: {},

		constructor: function () {
			this.own(
				this._compilers,
				this._collectors,
				this._setters
			)
		},

		/**
		 * @description Adds a compiler to be run after the gathering phase
		 * @param fn {Function} The compiler function to run
		 */
		addCompiler: function (fn) {
			this._compilers.push(fn);
		},

		getCompilers: function () {
			return this._compilers;
		},

		/**
		 * @description Adds a gatherer function to be applied to nodes at traversal
		 * @param name {string} Name of the store to intialize for this gatherer
		 * @param fn {Function} The gatherer function
		 */
		addCollector: function (name, fn) {
			this.getCollectorStore(name);
			this._collectors.push(fn);
		},

		getCollectors: function () {
			return this._collectors;
		},

		/**
		 * Registers a setter function on the object
		 * @param type {string} Setter type (ie. SETTER_REPEATER, etc.)
		 * @param fn {Function} The function corresponding to this type
		 * of setter
		 */
		addSetter: function (type, fn) {
			this._setters[type] = fn;
		},

		/**
		 * @description Generates a new setter function of the given type.
		 * Setter functions take a single value attribute and set it on the
		 * node that they have been linked to using the setting type defined.
		 * @param context {Object} The context in which the setter should run
		 * @param type {string} The setter type (ie. SETTER_ATTRIBUTE, etc.)
		 * @param configObj {Object} Node, formatFn... depending on setter type
		 * @returns {function(value)} Return a setter function
		 */
		getSetter: function (context, type, configObj) {
			console.log(configObj);
			var setter = this._setters[type];
			return function (value) {
				setter.call(context, arguments);
			}.bind(context, configObj);
		}
	});
});
