define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/store/Memory",
	"dijit/Destroyable"
], function (
	declare,
	lang,
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

		/**
		 * @description Attaches a setter to a binding and determines
		 * its type if it hasn't yet been registered
		 * @param name {string} Name of binding to attach too
		 * @param fn {Function} Setter function
		 */
		attachSetter: function (name, fn) {
			if (!this.$bindingStore.get(name)) {
				this.$bindingStore.put({
					id: name,
					setters: [],
					type: this._getBindingType(name)
				});
			}

			this.$bindingStore.get(name).setters.push(fn);
		},

		/**
		 * @description Determines a bindings type (model or property)
		 * by object
		 * @param prop {string} Object to check
		 * @returns {string} "model" or "property"
		 */
		_getBindingType: function (prop) {
			var parts = prop.split("."),
				obj = lang.getObject(parts[0], false, this),
				hasGet;

			if (!obj || (hasGet = lang.isFunction(obj.get)) && !parts[1]) {
				throw Error(prop + " does not exist or key is occured.");
			}

			return hasGet ? "model": "property";
		}
	});
});
