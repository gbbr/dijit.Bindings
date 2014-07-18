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
	 * @description Provides the compiler with the _bindingStore. Modules
	 * can add actions to the bindings by name via createSetter method
	 */
	return declare("indium/view/bindings/BindingStore", [Destroyable], {
		/**
		 * @description Binding types can be models or instance properties
		 */
		objectType: {
			PROPERTY: "property",
			MODEL: "model"
		},

		/**
		 * @description Stores substitution data and actions
		 * @type {dojo.store.Memory}
		 */
		_bindingStore: null,

		constructor: function () {
			this._bindingStore = new Memory();
			this.own(this._bindingStore);
		},

		/**
		 * @description Creates a setter and binds a configuration to it
		 * @param name {string} Name of the binding this setter belongs too
		 * @param fn {Function} Setter function
		 */
		createSetter: function (name, fn, config) {
			if (!this._bindingStore.get(name)) {
				this._bindingStore.put(lang.mixin({
					"id": name,
					"setters": []
				}, this._detectBindingType(name)));
			}

			this._bindingStore.get(name).setters.push(fn.bind(this, config));
		},

		/**
		 * Returns the Binding Store
		 * @returns {dojo.store.Memory}
		 */
		getBindingStore: function () {
			return this._bindingStore;
		},

		/**
		 * Extends the binding store object by returning binding type
		 * and additional information
		 * @param {string} name
		 * @returns {object}
		 */
		_detectBindingType: function (name) {
			var parts = name.split("."),
				obj = lang.getObject(parts[0], false, this),
				isModel = obj && lang.isFunction(obj.get) && !!parts[1];

			if (isModel) {
				return {
					"type": this.objectType.MODEL,
					"model": obj,
					"key": parts[1]
				};
			}

			return {
				"type": this.objectType.PROPERTY
			};
		}
	});
});
