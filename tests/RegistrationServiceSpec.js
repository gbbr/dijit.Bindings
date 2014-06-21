define([
	"doh/runner",
	"indium/services/RegistrationService",
	"testSuite"
], function (
	doh,
	RegistrationService,
	testSuite
) {
	testSuite("Registration Service", {
		beforeEach: function () {
			this.instance = new RegistrationService();
		},

		afterEach: function () {
			this.instance.destroy();
		},

		"Adds builders to the service": function () {
			var builders = [this.stub(), this.stub()];

			this.instance.addBuilder(builders[0]);
			this.instance.addBuilder(builders[1]);

			testSuite.equals(builders, this.instance.getBuilders());
			testSuite.equals(2, this.instance.getBuilders().length);
		},

		"Stores added collectors": function () {
			var collectors = [this.stub(), this.stub(), this.stub()];

			this.instance.addCollector(collectors[0]);
			this.instance.addCollector(collectors[1]);
			this.instance.addCollector(collectors[2]);

			testSuite.equals(collectors, this.instance.getCollectors());
			testSuite.equals(3, this.instance.getCollectors().length);
		},



		"Collectors: Returns empty store when one is not available": function () {
			testSuite.equals({}, this.instance.getCollectorStore("TEST_STORE1"), "Did not return empty store");
		},

		"Collectors: Returns correct collector store when requested": function () {
			var initStore, readStore;

			initStore = this.instance.getCollectorStore("TEST_STORE2");
			initStore.push(1, "A", { a: 2, b: "C" });

			readStore = this.instance.getCollectorStore("TEST_STORE3");
			readStore.push(2, "B", { b: 3, c: "D" }, { asd: 3, qwe: "D" });

			testSuite.equals(3, this.instance.getCollectorStore("TEST_STORE2").length,
				"Returned store is different in length");
			testSuite.equals(1, this.instance.getCollectorStore("TEST_STORE2")[0],
				"Returned store is different");
			testSuite.equals("A", this.instance.getCollectorStore("TEST_STORE2")[1],
				"Returned store is different");
			testSuite.equals("C", this.instance.getCollectorStore("TEST_STORE2")[2].b,
				"Returned store is different");

			testSuite.equals(4, this.instance.getCollectorStore("TEST_STORE3").length,
				"Returned store is different in length");
			testSuite.equals(2, this.instance.getCollectorStore("TEST_STORE3")[0],
				"Returned store is different");
			testSuite.equals("B", this.instance.getCollectorStore("TEST_STORE3")[1],
				"Returned store is different");
			testSuite.equals("D", this.instance.getCollectorStore("TEST_STORE3")[2].c,
				"Returned store is different");
		},

		"Should clear collector store when asked to": function () {
			var initStore, readStore;

			initStore = this.instance.getCollectorStore("TEST_STORE2");
			initStore.push(1, "A", { a: 2, b: "C" });

			readStore = this.instance.getCollectorStore("TEST_STORE3");
			readStore.push(2, "B", { b: 3, c: "D" }, { asd: 3, qwe: "D" });

			this.instance.clearCollected();

			testSuite.equals(0, this.instance.getCollectorStore("TEST_STORE2").length,
				"Store not emptied");
			testSuite.equals(0, this.instance.getCollectorStore("TEST_STORE3").length,
				"Store not emptied");
		}
	});
});
