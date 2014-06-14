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
		}

		// get binding by name
		// get binding by type
		// ...
	});
});