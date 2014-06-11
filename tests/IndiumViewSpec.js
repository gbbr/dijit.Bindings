require(["sinon"]);

define([
	"doh/runner",
	"indium/_IndiumView",
	"indium/tests/templates/TestWidgets"
], function (
	doh,
	IndiumView,
	TestWidgets
) {
	doh.register("view", [
		{
			name: "Builds DOM based on template and calls compile",

			setUp: function () {
				this.instance = TestWidgets.WIDGET_WITH_BINDINGS;
			},

			runTest: function () {
				var w = this.instance();
				w._applyCompilers = sinon.spy();
				w.compile(w.domNode);
				doh.assertTrue(w._applyCompilers.calledOnce)
			},

			tearDown: function () {}
		}
	]);
});
