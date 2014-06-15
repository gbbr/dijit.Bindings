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

		"Compilers: Adds and returns available compilers": function () {
			var functionsAndNames = [
					[function A() {}, "A"],
					[function B() {}, "B"],
					[function C() {}, "C"],
					[function D() {}, "D"]
				],
				registeredCompilers;

			functionsAndNames.forEach(function (test) {
				this.instance.addBuilder(test[0]);
			}, this);

			registeredCompilers = this.instance.getBuilders();

			testSuite.equals(4, registeredCompilers.length, "Less compilers than expected");

			registeredCompilers.forEach(function (compilerFunction, index) {
				testSuite.equals(functionsAndNames[index][1], compilerFunction.name,
					"Compilers names were not stored correctly at index " + index);
				testSuite.equals("function", typeof compilerFunction,
					"Function is not function at index " + index);
				testSuite.equals(functionsAndNames[index][0], compilerFunction,
					"Compiler functions were not stored correctly");
			});
		},

		"Collectors: Correctly stores added collectors": function () {
			var functionsAndNames = [
					[function E() {}, "E"],
					[function F() {}, "F"],
					[function G() {}, "G"]
				],
				registeredCollectors;

			functionsAndNames.forEach(function (test) {
				this.instance.addCollector("TEST_COLLECTOR1", test[0]);
			}, this);

			registeredCollectors = this.instance.getCollectors();

			testSuite.equals(3, registeredCollectors.length, "Unexpected number of collectors");
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

			testSuite.equals(3, this.instance.getCollectorStore("TEST_STORE2").length, "Returned store is different in length");
			testSuite.equals(1, this.instance.getCollectorStore("TEST_STORE2")[0], "Returned store is different");
			testSuite.equals("A", this.instance.getCollectorStore("TEST_STORE2")[1], "Returned store is different");
			testSuite.equals("C", this.instance.getCollectorStore("TEST_STORE2")[2].b, "Returned store is different");

			testSuite.equals(4, this.instance.getCollectorStore("TEST_STORE3").length, "Returned store is different in length");
			testSuite.equals(2, this.instance.getCollectorStore("TEST_STORE3")[0], "Returned store is different");
			testSuite.equals("B", this.instance.getCollectorStore("TEST_STORE3")[1], "Returned store is different");
			testSuite.equals("D", this.instance.getCollectorStore("TEST_STORE3")[2].c, "Returned store is different");
		},

		"Setters: Correctly retrieves and executes added setters": function () {
			var spy1 = sinon.spy(),
				spy2 = this.spy(),
				spy3 = this.spy(),
				testSetters = [
					[spy1, "TYPE_A"],
					[spy2, "TYPE_B"],
					[spy3, "TYPE_C"]
				];

			testSetters.forEach(function (test) {
				this.instance.addSetter(test[1], test[0]);
			}, this);

			this.instance.getSetter(this, testSetters[0][1], "test payload")(1);
			this.instance.getSetter(this, testSetters[1][1], 5)(2);
			this.instance.getSetter(this, testSetters[2][1], { obj: "ect", a: 2 })("lorem ipsum");

			testSuite.equals(["test payload", 1], spy1.getCalls()[0].args[0], "Arguments did not match");
			testSuite.equals([5, 2], spy2.getCalls()[0].args[0], "Arguments did not match");
			testSuite.equals([{ obj: "ect", a: 2 }, "lorem ipsum"], spy3.getCalls()[0].args[0], "Arguments did not match");
		},

		"Clears collector store": function () {

		}
	});
});
