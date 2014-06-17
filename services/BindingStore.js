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
			var parts = name.split(".");

			if (!this.$bindingStore.get(name)) {
				this.$bindingStore.put({
					id: name,
					setters: [],
					type: this._getBindingType(parts[0])
				});
			}

			this.$bindingStore.get(name).setters.push(fn);
		},

		/**
		 * @description Determines a bindings type (model or property)
		 * by object root
		 * @param prop {string} Object to check
		 * @returns {string} "model" or "property"
		 */
		_getBindingType: function (prop) {
			var obj = lang.getObject(prop, false, this);

			if (!obj) {
				throw Error(prop + " does not exist on instance.");
			}

			return lang.isFunction(obj.get) ? "model" : "property";
		}
	});
});
