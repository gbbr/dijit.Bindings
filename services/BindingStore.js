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
		 * @description Attaches a setter to a binding
		 * @param name {string} Name of the binding this setter belongs too
		 * @param fn {Function} Setter function
		 */
		createSetter: function (name, fn, config) {
			if (!this.$bindingStore.get(name)) {
				this.$bindingStore.put(lang.mixin({
					id: name,
					setters: []
				}));
			}

			this.$bindingStore.get(name).setters.push(fn.bind(this, config));
		},

		linkBindingStore: function () {
			this.$bindingStore.query().forEach(function (binding) {
				var parts = binding.id.split("."),
					obj = lang.getObject(parts[0], false, this),
					isModel = obj && lang.isFunction(obj.get) && !!parts[1],
					invokeFn;

				if (isModel) {
					binding.type = this.objectType.MODEL;
					invokeFn = this._invokeActions.bind(this, binding.setters);
					obj.observe(parts[1], invokeFn);
					invokeFn();
				} else {
					binding.type = this.objectType.PROPERTY;
				}
			}, this);

			this.renderProperty("*");
		},


		/**
		 * @description Renders an instance property to the template
		 * @param name {=string} Property name (as per $bindingStore)
		 */
		renderProperty: function (name) {
			if (name !== "*") {
				var prop = this.$bindingStore.get(name);
				if (prop && prop.setters) {
					this._invokeActions(prop.setters);
				}
			} else {
				this.$bindingStore.query({ type: this.objectType.PROPERTY }).
					forEach(function (binding) {
						this._invokeActions(binding.setters);
					}, this);
			}
		}
	});
});
