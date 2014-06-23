define([
	"doh/runner",
	"indium/view/bindings/RegistrationService",
	"indium/tests/testSuite"
], function (
	doh,
	RegistrationService,
	testSuite
) {
	testSuite("indium/view/bindings/RegistrationService", {
		beforeEach: function () {
			this.instance = new RegistrationService();
		},

		afterEach: function () {
			this.instance.destroy();
		},

		"addBuilder: adds builders to the service": function () {
			var builders = [this.stub(), this.stub()];

			this.instance.addBuilder(builders[0]);
			this.instance.addBuilder(builders[1]);

			testSuite.equals(builders, this.instance.getBuilders());
			testSuite.equals(2, this.instance.getBuilders().length);
		},

		"addCollector: adds collectors to the service": function () {
			var collectors = [this.stub(), this.stub(), this.stub()];

			this.instance.addCollector(collectors[0]);
			this.instance.addCollector(collectors[1]);
			this.instance.addCollector(collectors[2]);

			testSuite.equals(collectors, this.instance.getCollectors());
			testSuite.equals(3, this.instance.getCollectors().length);
		},

		"getCollectorStore: returns new empty store when one is not available": function () {
			testSuite.equals({}, this.instance.getCollectorStore("test1"), "Did not return empty store");
		},

		"getCollectorStore: returns already existing collector store": function () {
			var store1 = this.instance.getCollectorStore("test1"),
				store2 = this.instance.getCollectorStore("test2");

			store1.push(1, "Martin", { credit: 200, lastName: "Adams" });
			store2.push(2, "John", { credit: 100 }, { siblings: 4, connections: 439 });

			testSuite.equals(this.instance.getCollectorStore("test1"), [
				1, "Martin", { credit: 200, lastName: "Adams" }
			]);

			testSuite.equals(this.instance.getCollectorStore("test2"), [
				2, "John", { credit: 100 }, { siblings: 4, connections: 439 }
			]);
		},

		"clearCollected: should clear all collector stores": function () {
			var store1 = this.instance.getCollectorStore("test1"),
				store2 = this.instance.getCollectorStore("test12");

			store1.push("A", "B", "C", "D");
			store2.push({ "data": "A" }, { "data": "B" }, { "data": "C" });

			this.instance.clearCollected();

			testSuite.equals(0, this.instance.getCollectorStore("test1").length);
			testSuite.equals(0, this.instance.getCollectorStore("test12").length);
		}
	});
});
