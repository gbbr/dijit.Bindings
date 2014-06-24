define([
	"doh/runner",
	"dojo/dom-construct",
	"dojo/_base/lang",
	"dojo/_base/declare",
	"indium/services/Compiler",
	"indium/mixins/TextNodeMixin",
	"indium/lib/_StatefulModel",
	'dojo/text!indium/tests/example_widget/template.html',
	"testSuite"
], function (
	doh,
	domConstruct,
	lang,
	declare,
	Compiler,
	TextNodeMixin,
	StatefulModel,
	template,
	testSuite
) {
	var CompilerWithMixin = declare("TestCompiler", [Compiler, TextNodeMixin], {}),
		nodeToHtml = function (node) {
			var wrapper = document.createElement("span");
			wrapper.appendChild(node);

			return wrapper.innerHTML;
		};

	testSuite("TextNode Mixin", {
		beforeEach: function () {
			this.instance = new CompilerWithMixin();
		},

		afterEach: function () {
			this.instance.destroy();
		},

		"Does not collect nodes without bindings or of wrong type": function () {
			var node, testNodes = [
				["<div></div>", 0],
				["<div>text and {{bindindings}}</div>", 0],
				["{{bindings}}", 1],
				["{{a}} and {{b}}", 1],
				["{{a}}{{b}}{{c}}", 1],
				["hi there", 0],
				["I have no two-ways ${bindings}", 0]
			];

			testNodes.forEach(function (test) {
				var store = this.instance.registrationService.getCollectorStore(this.instance.COLLECTOR_TEXT_NODES);
				this.spy(store, "push");

				node = domConstruct.toDom(test[0]);
				this.instance._gatherTextNodes(node);

				testSuite.equals(test[1], store.push.callCount,
					"Gatherer did not push valid nodes on " + test[0]);

				store.push.restore();
			}, this);

			testSuite.equals(3, this.instance.registrationService.getCollectorStore(this.instance.COLLECTOR_TEXT_NODES).length,
				"Unexpected number of nodes collected.")
		},

		"Correctly compiles HTML nodes": function () {
			var node = domConstruct.toDom("<div>{{item}}</div>");

			this.instance.item = 2;
			this.instance.compile(node)(this.instance);

			testSuite.equals(nodeToHtml(node), "<div>2</div>")
		},

		"Correctly compiles HTML fragments": function () {
			var node = domConstruct.toDom("<div>{{item}} and {{quantity}}</div>");

			this.instance.item = "Apples";
			this.instance.quantity = 4;
			this.instance.compile(node)(this.instance);

			testSuite.equals(nodeToHtml(node), "<div>Apples and 4</div>")
		},

		"Compiles multiple elements": function () {
			var node = domConstruct.toDom("<div>{{item}} and {{quantity}}</div>");

			this.instance.item = "Apples";
			this.instance.quantity = 4;
			this.instance.compile(node)(this.instance);

			testSuite.equals(nodeToHtml(node), "<div>Apples and 4</div>")
		},

		"Compiles nodes from models and properties": function () {
			var node = domConstruct.toDom("<div>{{count}} {{model.product}}</div>");

			this.instance.count = 1;
			this.instance.model = new StatefulModel({ "product": "Apple" })

			this.instance.compile(node)(this.instance);
			testSuite.equals(nodeToHtml(node), "<div>1 Apple</div>");

			this.instance.model.set("product", "Pineapple");
			testSuite.equals(nodeToHtml(node), "<div>1 Pineapple</div>")
		}
	});
});
