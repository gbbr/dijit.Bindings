define([
	"doh/runner",
	"indium/view/bindings/BindingStore",
	"indium/tests/testSuite"
], function (
	doh,
	BindingStore,
	testSuite
) {
	testSuite("indium/view/bindings/BindingStore", {
		beforeEach: function () {
			this.instance = new BindingStore();
		},

		afterEach: function () {
			this.instance.destroy();
		},

		"Creates a new $bindingStore entry if needed": function () {
			this.instance.createSetter("model.key", this.stub());

			testSuite.equals(this.instance.$bindingStore.query({}).length, 1);
			testSuite.equals(this.instance.$bindingStore.get("model.key").id, "model.key");
			testSuite.equals(this.instance.$bindingStore.get("model.key").setters.length, 1);
		},

		"Adds setters to an already existing entry": function () {
			this.instance.createSetter("model.key", this.stub());
			this.instance.createSetter("model.key", this.stub());

			testSuite.equals(this.instance.$bindingStore.query({}).length, 1);
			testSuite.equals(this.instance.$bindingStore.get("model.key").id, "model.key");
			testSuite.equals(this.instance.$bindingStore.get("model.key").setters.length, 2);
		},

		"Correctly links setters to configuration objects": function () {
			var setterFunction = this.stub();

			this.instance.createSetter("model.key", setterFunction, {
				"action": "Hello",
				"target": "world"
			});

			this.instance.$bindingStore.get("model.key").setters[0]();

			testSuite.isTrue(setterFunction.calledWith({
				"action": "Hello",
				"target": "world"
			}));
		}
	});
});