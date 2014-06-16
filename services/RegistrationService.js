define([
	"dojo/_base/declare",
	"dijit/Destroyable",
	"indium/services/BindingStore",
	"lib/lang"
], function (
	declare,
	Destroyable,
	BindingStore,
	indiumLang
) {
	/**
	 * @module RegistrationService
	 * @description Provides an interface for mixins to communicate with the compiler.
	 * It allows adding Collectors, Builders, Setters and subscribing to Collector Stores.
	 * It also extends and provides the BindingStore
	 */
	return declare("RegistrationService", [BindingStore, Destroyable], {

		_compilers: null,
		_collectors: null,
		_collectorStore: null,
		_setters: null,

		constructor: function () {
			this._compilers = [];
			this._collectors = [];
			this._collectorStore = [];
			this._setters = [];
		},

		/**
		 * @description Adds a compiler to be run after the gathering phase
		 * @param fn {Function} The compiler function to run
		 */
		addBuilder: function (fn) {
			this._compilers.push(fn);
		},

		getBuilders: function () {
			return this._compilers;
		},

		/**
		 * @description Adds a gatherer function to be applied to nodes at traversal
		 * @param fn {Function} The gatherer function
		 */
		addCollector: function (fn) {
			this._collectors.push(fn);
		},

		/**
		 * @description Return all collector actions
		 * @returns {Array<Function>} List of functions
		 */
		getCollectors: function () {
			return this._collectors;
		},

		/**
		 * @description Creates and returns a new collector store
		 * @param name {string} The name of the store to be returned
		 * @returns {Array<*>} Returns an array for storing gatherer data
		 */
		getCollectorStore: function (name) {
			if(!this._collectorStore.hasOwnProperty(name)) {
				this._collectorStore[name] = [];
			}
			return this._collectorStore[name];
		},

		/**
		 * @description Clears all gathered data
		 */
		clearCollected: function () {
			indiumLang.forEach(this._collectorStore, function (store, key) {
				delete this._collectorStore[key];
			}, this);
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
		 * Resulting setter functions take a scope attribute to use for interpolation
		 * @param context {Object} The context in which the setter should run
		 * @param type {string} The setter type (ie. SETTER_ATTRIBUTE, etc.)
		 * @param configObj {Object} Node, formatFn... depending on setter type
		 * @returns {function(value)} Return a setter function
		 */
		getSetter: function (context, type, configObj) {
			var setter = this._setters[type];
			return function (scope) {
				setter.call(context, arguments);
			}.bind(context, configObj);
		}
	});
});
