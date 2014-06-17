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

		createBindingStore: function () {
			return this.$bindingStore;
		},

		attachSetter: function (name, fn) {
			var parts = name.split("."),
				bindingId = parts[0];

			if (parts[1]) {
				bindingId += "." + parts[1];
			}

			if (!this.$bindingStore.get(bindingId)) {
				this.$bindingStore.put({
					id: bindingId,
					setters: []
				});
			}

			this.$bindingStore.get(bindingId).setters.push(fn);
			this.$bindingStore.get(bindingId).type = this._getBindingType(parts[0]);
		},

		_getBindingType: function (prop) {
			var obj = lang.getObject(prop, false, this);

			if (!obj) {
				throw Error(obj + " does not exist on instance.");
			}

			return lang.isFunction(obj.get) ? "model" : "property";
		}
	});
});
