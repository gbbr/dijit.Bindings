define([
	"doh/runner",
	"dojo/dom-construct",
	"dojo/_base/lang",
	"dojo/_base/declare",
	"indium/services/Compiler",
	"indium/mixins/TextNodeMixin",
	"testSuite"
], function (
	doh,
	domConstruct,
	lang,
	declare,
	Compiler,
	TextNodeMixin,
	testSuite
) {
	var CompilerWithMixin = declare("TestCompiler", [Compiler, TextNodeMixin], {}),
		testNodes = [
			["<div></div>", 0],
			["<div>text and {{bindindings}}</div>", 0],
			["{{bindings}}", 1],
			["{{a}} and {{b}}", 1],
			["{{a}}{{b}}{{c}}", 1],
			["hi there", 0],
			["I have no two-ways ${bindings}", 0]
		];

	testSuite("TextNode Mixin", {
		beforeEach: function () {
			this.instance = new CompilerWithMixin();
		},

		afterEach: function () {
			this.instance.destroy();
		},

		"Does not collect nodes without bindings or of wrong type": function () {
			var node;

			testNodes.forEach(function (test) {
				this.spy(this.instance._textCollectorStore, "push");

				node = domConstruct.toDom(test[0]);
				this.instance._gatherTextNodes(node);

				testSuite.equals(test[1], this.instance._textCollectorStore.push.callCount,
					"Gatherer did not push valid nodes on " + test[0]);

				this.instance._textCollectorStore.push.restore();
			}, this);

			testSuite.equals(3, this.instance.registrationService.getCollectorStore(this.instance.COLLECTOR_TEXT_NODES).length,
				"Unexpected number of nodes collected.")
		}
	});
});