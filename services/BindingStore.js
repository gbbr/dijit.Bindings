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
		 * along with relevant information
		 * @param name {string} Name of binding to attach too
		 * @param fn {Function} Setter function
		 */
		createSetter: function (name, fn, config) {
			if (!this.$bindingStore.get(name)) {
				this.$bindingStore.put(lang.mixin({
					id: name,
					setters: []
				}, this._getObjectInformation(name, this)));
			}

			this.$bindingStore.get(name).
				setters.push(function (scope) {
					fn.call(this, arguments);
				}.bind(this, config));
		}
	});
});
