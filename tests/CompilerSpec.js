define([
	"doh/runner",
	"dojo/dom-construct",
	"indium/services/Compiler",
	'dojo/text!indium/tests/example_widget/template.html',
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
		},

		"Correctly clears collector store and subscribers after building phase": function () {
//			var dom = domConstruct.toDom(template);
//			console.log(this.instance.compile(dom)(this));
//			console.log(this.instance.registrationService.$bindingStore);
		}
	});
});
