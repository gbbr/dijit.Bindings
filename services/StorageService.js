define([
	"dojo/_base/declare",
	"dojo/store/Memory",
	"dijit/Destroyable"
], function (
	declare,
	Memory,
	Destroyable
) {
	return declare("RegistrationService.StorageService", [Destroyable], {
		/**
		 * @description Stores substitution data and linking functions
		 * @type {dojo/store/Memory}
		 */
		$bindingStore: null,

		_collectorStore: [],

		constructor: function () {
			this.$bindingStore = new Memory();
			this.own(this.$bindingStore);
		},

		createBindingStore: function () {
			return this.$bindingStore;
		},

		attachSetter: function (name, fn) {
			if (!this.$bindingStore.hasOwnProperty(name)) {
				this.$bindingStore[name] = {};
				this.$bindingStore[name].setters = [];
			}

			this.$bindingStore[name].setters.push(fn);
		},

		/**
		 * @description Returns an existing store or creates a new one
		 * @param name {string} The name of the store to be returned
		 * @returns {Array<*>} Returns an array for storing gatherer data
		 */
		getCollectorStore: function (name) {
			if (!this._collectorStore.hasOwnProperty(name)) {
				this._collectorStore[name] = [];
			}

			return this._collectorStore[name];
		},

		/**
		 * @description Clears all gatherer data
		 */
		clearCollected: function () {
			this._collectorStore = {};
		}

		// get binding by name
		// get binding by type
		// ...
	});
});