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

		_getBindingType: function (prop) {
			var obj = lang.getObject(prop, false, this);

			if (!obj) {
				throw Error(prop + " does not exist on instance.");
			}

			return lang.isFunction(obj.get) ? "model" : "property";
		}
	});
});
