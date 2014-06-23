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

		"createSetter: Adds setter functions to a fresh store": function () {
			this.instance.createSetter("model.key", this.stub());

			testSuite.equals(this.instance.$bindingStore.query({}).length, 1);
			testSuite.equals(this.instance.$bindingStore.get("model.key").id, "model.key");
			testSuite.equals(this.instance.$bindingStore.get("model.key").setters.length, 1);
		},

		"createSetter: Adds setter functions to already existing store": function () {
			this.instance.createSetter("model.key", this.stub());
			this.instance.createSetter("model.key", this.stub());

			testSuite.equals(this.instance.$bindingStore.query({}).length, 1);
			testSuite.equals(this.instance.$bindingStore.get("model.key").id, "model.key");
			testSuite.equals(this.instance.$bindingStore.get("model.key").setters.length, 2);
		},

		"createSetter: Binds setter functions in store to pre-defined attributes": function () {
			var setterFunction = this.stub();

			this.instance.createSetter("model.key", setterFunction, {
				"action": "Hello",
				"target": "world"
			});

			var storedSetter = this.instance.$bindingStore.get("model.key").setters[0];
			storedSetter();

			testSuite.isTrue(setterFunction.calledWith({
				"action": "Hello",
				"target": "world"
			}));
		}
	});
});