define([
	"doh/runner",
	"dojo/dom-construct",
	"dojo/_base/lang",
	"dojo/_base/declare",
	"indium/services/Compiler",
	"indium/mixins/TextNodeMixin",
	'dojo/text!indium/tests/example_widget/template.html',
	"testSuite"
], function (
	doh,
	domConstruct,
	lang,
	declare,
	Compiler,
	TextNodeMixin,
	template,
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
				var store = this.instance.compiler.getCollectorStore(this.instance.COLLECTOR_TEXT_NODES);
				this.spy(store, "push");

				node = domConstruct.toDom(test[0]);
				this.instance._gatherTextNodes(node);

				testSuite.equals(test[1], store.push.callCount,
					"Gatherer did not push valid nodes on " + test[0]);

				store.push.restore();
			}, this);

			testSuite.equals(3, this.instance.compiler.getCollectorStore(this.instance.COLLECTOR_TEXT_NODES).length,
				"Unexpected number of nodes collected.")
		},

		"Correctly breaks text nodes": function () {

		}
	});
});
