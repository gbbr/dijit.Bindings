define([
	"doh/runner",
	"indium/services/Compiler",
	"indium/tests/templates/TestWidgets",
	"testSuite"
], function (
	doh,
	Compiler,
	TestWidgets,
	testSuite
) {
	testSuite("Compiler service", {
		beforeEach: function () {
			this.instance = new Compiler();
		},

		afterEach: function () {
			this.instance.destroy();
		},

		"Correctly invokes a list of functions": function () {
			var spyList = [this.spy(), this.spy(), this.spy()];

			this.instance._invokeActions(spyList, this, 5);

			spyList.forEach(function (spy) {
				testSuite.isTrue(spy.calledOnce, "Function was not called once");
				testSuite.isTrue(spy.calledWith(5), "Argument was not passed");
			});
		}
	});
});
