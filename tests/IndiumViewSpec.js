define([
	"doh/runner",
	"indium/tests/templates/TestWidgets",
	"sinon"
], function (
	doh,
	TestWidgets,
	sinon
) {
	doh.register("view", [
		{
			name: "Builds DOM based on template and calls compile",

			setUp: function () {
				this.instance = TestWidgets.WIDGET_WITH_BINDINGS;
			},

			runTest: function () {
				//this.instance.compile = sinon.spy();
				console.log(this.instance());
				//doh.assertTrue(this.instance.compile.calledOnce)
			},

			tearDown: function () {}
		}
	]);
});
