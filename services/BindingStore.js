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
	/**
	 * @module BindingStore
	 * @description Allows the storing of bindings and their
	 * associated actions
	 */
	return declare("BindingStore", [Destroyable], {
		/**
		 * @description Binding types can be models or instance properties
		 */
		objectType: {
			PROPERTY: "property",
			MODEL: "model"
		},

		/**
		 * @description Stores substitution data and linking functions
		 * @type {dojo.store.Memory}
		 */
		$bindingStore: null,

		constructor: function () {
			this.$bindingStore = new Memory();
			this.own(this.$bindingStore);
		},

		/**
		 * @description Creates a setter and binds a configuration to it
		 * @param name {string} Name of the binding this setter belongs too
		 * @param fn {Function} Setter function
		 */
		createSetter: function (name, fn, config) {
			if (!this.$bindingStore.get(name)) {
				this.$bindingStore.put(lang.mixin({
					id: name,
					setters: []
				}, this._detectBindingType(name)));
			}

			this.$bindingStore.get(name).setters.push(fn.bind(this, config));
		},

		/**
		 * Extends the binding store object by returning binding type
		 * and additional information
		 * @param {string} name
		 * @returns {{type: string, model: Object, key: *}}
		 */
		_detectBindingType: function (name) {
			var parts = name.split("."),
				obj = lang.getObject(parts[0], false, this),
				isModel = obj && lang.isFunction(obj.get) && !!parts[1];

			return isModel ? {
				type: this.objectType.MODEL,
				model: obj,
				key: parts[1]
			} : {
				type: this.objectType.PROPERTY
			}
		}
	});
});
