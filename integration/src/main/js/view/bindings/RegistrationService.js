define([
	"dojo/_base/declare",
	"dijit/Destroyable",
	"indium/view/bindings/BindingStore",
	"indium/base/lang"
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
	 */
	return declare("indium/view/bindings/RegistrationService", [Destroyable], {

		_compilers: null,
		_collectors: null,
		_collectorStore: null,

		constructor: function () {
			this._compilers = [];
			this._collectors = [];
			this._collectorStore = [];
		},

		/**
		 * @description Adds a compiler to be run after the gathering phase
		 * @param fn {Function} The compiler function to run
		 */
		addBuilder: function (fn) {
			this._compilers.push(fn);
		},

		/**
		 * @description Returns all the compilers
		 * @returns {Array}
		 */
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
		}
	});
});
