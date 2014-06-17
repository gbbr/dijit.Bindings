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

		/**
		 * @description Binding types can be models or instance properties
		 */
		bindingType: {
			PROPERTY: "property",
			MODEL: "model"
		},

		constructor: function () {
			this.$bindingStore = new Memory();
			this.own(this.$bindingStore);
		},

		/**
		 * @description Attaches a setter to a binding and determines
		 * along with relevant information
		 * @param name {string} Name of binding to attach too
		 * @param fn {Function} Setter function
		 */
		attachSetter: function (name, fn) {
			if (!this.$bindingStore.get(name)) {
				this.$bindingStore.put(lang.mixin({
					id: name,
					setters: []
				}, this._extendBindingInformation(name)));
			}

			this.$bindingStore.get(name).setters.push(fn);
		},

		/**
		 * @description Determines a bindings type (model or property)
		 * by object name, as well as its corresponding model and key
		 * @param prop {string} Object to check
		 * @returns {object} An object containing a `type`, as well
		 * as a model & property if necessary
		 */
		_extendBindingInformation: function (prop) {
			var parts = prop.split("."),
				obj = lang.getObject(parts[0], false, this),
				hasGet;

			if (!obj || (hasGet = lang.isFunction(obj.get)) && !parts[1]) {
				throw Error(prop + " does not exist or key is occured.");
			}

			return hasGet ? {
				type: this.bindingType.MODEL,
				model: obj,
				property: parts[1]
			} : {
				type: this.bindingType.PROPERTY
			};
		}
	});
});
