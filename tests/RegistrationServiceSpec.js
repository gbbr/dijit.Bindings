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
			var store1 = this.instance.getCollectorStore("TEST_STORE2"),
				store2 = this.instance.getCollectorStore("TEST_STORE3");

			store1.push(1, "A", { a: 2, b: "C" });
			store2.push(2, "B", { b: 3, c: "D" }, { asd: 3, qwe: "D" });

			testSuite.equals(3, this.instance.getCollectorStore("TEST_STORE2").length);
			testSuite.equals(1, this.instance.getCollectorStore("TEST_STORE2")[0]);
			testSuite.equals("A", this.instance.getCollectorStore("TEST_STORE2")[1]);
			testSuite.equals("C", this.instance.getCollectorStore("TEST_STORE2")[2].b);

			testSuite.equals(4, this.instance.getCollectorStore("TEST_STORE3").length);
			testSuite.equals(2, this.instance.getCollectorStore("TEST_STORE3")[0]);
			testSuite.equals("B", this.instance.getCollectorStore("TEST_STORE3")[1]);
			testSuite.equals("D", this.instance.getCollectorStore("TEST_STORE3")[2].c);
		},

		"Should clear collector store when asked to": function () {
			var store1 = this.instance.getCollectorStore("TEST_STORE2"),
				store2 = this.instance.getCollectorStore("TEST_STORE3");

			store1.push("A", "B", "C");
			store2.push({ "data": "A" }, { "data": "B" }, { "data": "C" });

			this.instance.clearCollected();

			testSuite.equals(0, this.instance.getCollectorStore("TEST_STORE2").length);
			testSuite.equals(0, this.instance.getCollectorStore("TEST_STORE3").length);
		}
	});
});
