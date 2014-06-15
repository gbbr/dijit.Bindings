define([
	"doh/runner",
	"dojo/dom-construct",
	"indium/services/Compiler",
	'dojo/text!indium/tests/templates/template1.html',
	"testSuite"
], function (
	doh,
	domConstruct,
	Compiler,
	template,
	testSuite
) {
	testSuite("Compiler service", {
		beforeEach: function () {
			this.instance = new Compiler();
			this.templateDom = domConstruct.toDom(template);
		},

		afterEach: function () {
			this.instance.destroy();
			delete this.templateDom;
		},

		"Correctly invokes a list of functions": function () {
			var spyList = [this.spy(), this.spy(), this.spy()];

			this.instance._invokeActions(spyList, this, 5);

			spyList.forEach(function (spy) {
				testSuite.isTrue(spy.calledOnce, "Function was not called once");
				testSuite.isTrue(spy.calledWith(5), "Argument was not passed");
			});
		},

		"Correctly clears collector store after building phase": function () {
			this.spy(this.instance.registrationService, "clearCollected");

			this.instance.compile(this.templateDom);

			testSuite.isTrue(this.instance.registrationService.clearCollected.calledOnce,
				"Compiling phase did not clear collector store");
		},

		"Invokes all registered collectors": function () {
			var spies = [this.spy(), this.spy(), this.spy()];

			this.instance.registrationService.addCollector("COLLECTOR_0", spies[0]);
			this.instance.registrationService.addCollector("COLLECTOR_1", spies[1]);
			this.instance.registrationService.addCollector("COLLECTOR_2", spies[2]);

			this.instance.compile(this.templateDom);

			testSuite.isTrue(spies[0].called, "Collector #1 was not reached");
			testSuite.isTrue(spies[1].called, "Collector #2 was not reached");
			testSuite.isTrue(spies[2].called, "Collector #3 was not reached");

			testSuite.equals(spies[0].callCount, spies[1].callCount, "Call counts not equal");
			testSuite.equals(spies[1].callCount, spies[2].callCount, "Call counts not equal");
		},

		"Invokes all registered builders once": function () {
			var spies = [this.spy(), this.spy(), this.spy()];

			this.instance.registrationService.addBuilder(spies[0]);
			this.instance.registrationService.addBuilder(spies[1]);
			this.instance.registrationService.addBuilder(spies[2]);

			this.instance.compile(this.templateDom);

			testSuite.isTrue(spies[0].calledOnce, "Builder #1 was not reached");
			testSuite.isTrue(spies[1].calledOnce, "Builder #2 was not reached");
			testSuite.isTrue(spies[2].calledOnce, "Builder #3 was not reached");
		}
	});
});
