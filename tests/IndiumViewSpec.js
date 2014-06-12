require(["sinon"]);

define([
	"doh/runner",
	"indium/_IndiumView",
	"indium/tests/templates/TestWidgets",
	"testSuite"
], function (
	doh,
	IndiumView,
	TestWidgets,
	testSuite
) {
	testSuite("view", {
		"Compiles DOM correctly": function () {
			var w = TestWidgets.WIDGET_WITH_BINDINGS();
			w._applyCompilers = sinon.spy();
			w.compile(w.domNode);
			doh.assertTrue(w._applyCompilers.calledOnce);
		}
	});
});
