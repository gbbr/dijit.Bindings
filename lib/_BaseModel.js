define([
	"dojo/_base/declare",
	"dojo/Deferred",
	"dojo/Evented",
	"dijit/Destroyable",
	"dojo/_base/lang",
	"dojo/topic"
], function (
	declare,
	Deferred,
	Evented,
	Destroyable,
	lang,
	topic
) {
	/**
	 * @module
	 * @extends {indium.base._Base}
	 * @extends {dojo.Evented}
	 */
	return declare("indium.model._BaseModel", [Evented, Destroyable], {
		/**
		 * @type {Object}
		 * @description The data store for all members in this model. Must be accessed through the
		 * appropriate getters and setters.
		 */
		_store: null,

		/**
		 * @type {string}
		 * @description The main REST service for this model. Used to fetch() data from the server.
		 * Note that this must use 'lang.replace' friendly string replacement to specify properties
		 * e.g. 'my/end/point/{someId}'
		 */
		service: "",

		/**
		 * @type {string=}
		 * @description App name used to retrieve the base URL.
		 */
		appId: "",

		/**
		 * @type {string}
		 * @description The default id property, can be overridden for custom identifiers.
		 */
		idProperty: "id",

		/**
		 * @type {dojo.Deferred}
		 * @description Resolves when the model initially fetches its state from the server.
		 */
		_loaded: null,

		/**
		 * @module
		 */
		constructor: function () {
			this._loaded = new Deferred();
		},

		/**
		 * @description Queues a function to be executed when the model has fetched
		 * its resource from the server for the first time. If no function is passed the
		 * loaded state of the model is returned.
		 * @param {function} fn
		 * @return {boolean|undefined}
		 */
		loaded: function (fn) {
			if (fn) {
				this._loaded.then(fn);
			} else {
				return this._loaded.isResolved();
			}
		},

		/**
		 * @description Called internally when the models state is reset.
		 */
		_onReset: function () {
			if (!this.loaded()) {
				this._loaded.resolve(this);
			}
			this.emit("reset");
		},

		/**
		 * @description Sets data on the store.
		 */
		set: function () {
			throw new Error("Not implemented");
		},

		/**
		 * @description When a key if supplied, the matching value is returned. If no key is supplied
		 * then the whole data set is returned.
		 * @param {Object=} key
		 */
		get: function (key) {
			throw new Error("Not implemented");
		},

		/**
		 * @description Clears the store of any data
		 */
		reset: function () {
			throw new Error("Not implemented");
		},

		/**
		 * @description Observes the given item and calls the supplied
		 * function when the items state changes.
		 * @param {Object} item The item to observe i.e a 'key' in a data-set
		 * @param {Function} fn The callback function when the observer fires
		 * @param {Object=} scope An optional scope bound to the callback
		 */
		observe: function (item, fn, scope) {
			throw new Error("Not implemented");
		},

		/**
		 * @param {Function} fn The callback function when the observer fires
		 * @param {Object=} scope An optional scope bound to the callback
		 * @return {Object} An ownable canceller
		 */
		observeAll: function (fn, scope) {
			throw new Error("Not implemented");
		},

		/**
		 * @description Returns this models store.
		 * @return {Object} A data store
		 */
		getStore: function () {
			return this._store;
		},

		/**
		 * @description Default implementation which returns all parameters. May be overridden.
		 * @return {Object} A hash of data.
		 */
		toJSON: function () {
			return this.get();
		},

		/**
		 * @override
		 */
		destroy: function () {
			this.inherited(arguments);
			this.emit("destroy");
		}
	});
});
