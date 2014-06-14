define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/lang",
	"dijit/Destroyable"
], function (
	declare,
	array,
	lang,
	Destroyable
) {
	return declare("indium/_TextBindingsMixin", [Destroyable], {

		NODE_TYPE_TEXT: 3,
		COLLECTOR_TEXT_NODES: "GATHERER_TEXTNODES",
		SETTER_TEXTNODES: "SETTER_TEXTNODES",

		_textCollectorStore: null,

		constructor: function () {
			this._textCollectorStore = this.registrationService.getCollectorStore(this.COLLECTOR_TEXT_NODES);

			this.registrationService.addCollector(this.COLLECTOR_TEXT_NODES, this._gatherTextNodes);
			this.registrationService.addCompiler(this._compileTextNodes);
			this.registrationService.addSetter(this.SETTER_TEXTNODES, this._setNodeValue);
		},

		/**
		 * @description Verifies if provided DOM node is a text-node and contains
		 * substitutions, in which case it saves them in the store for compilation
		 * @param node {HTMLElement} Element to check for substitutions and validity
		 */
		_gatherTextNodes: function (node) {
			if (node.nodeType == this.NODE_TYPE_TEXT && this._bindingCount(node.nodeValue)) {
				this._textCollectorStore.push(node);
			}
		},

		/**
		 * @description Compiles marked text-nodes and generates linking
		 * functions
		 */
		_compileTextNodes: function () {
			this._textCollectorStore.forEach(function (node) {
				var interpolateFn = this.interpolateString(node.nodeValue),
					expressions = interpolateFn.expressions,
					fragment = null, textNode;

				// multiple bindings per text-node means we create
				// a document-fragment
				if (interpolateFn.parts.length > 1) {
					fragment = document.createDocumentFragment();

					interpolateFn.parts.forEach(function (part) {
						textNode = document.createTextNode(part);
						fragment.appendChild(textNode);

						if (expressions.indexOf(part) >= 0) {
							this._createTextNodeBinding(part, textNode)
						}
					}, this);

					node.parentNode.replaceChild(fragment, node);

				// no fragment
				} else if (expressions.length === 1) {
					this._createTextNodeBinding(expressions[0], node);
				}
			}, this);
		},

		_createTextNodeBinding: function (expression, node) {
			var parsedExpr = this.parseExpression(expression),
				setterFn = this.registrationService.getSetter(this, this.SETTER_TEXTNODES, {
					"node": node,
					"formatFn": parsedExpr.formatFn
				});

			this.registrationService.attachSetter(parsedExpr.binding, setterFn);
		},

		/**
		 * @description Sets a text node's value and passes it through
		 * a transform function if provided
		 * @param args {Array<mixed>} Contains two items:
		 * new value to be set on the text node and a configuration
		 * object describing specifics set during generation
		 */
		_setNodeValue: function (args) {
			var value = args[1], nodeData = args[0],
				formatFn = nodeData.formatFn;

			if (lang.isFunction(this[formatFn])) {
				formatFn = this[formatFn];
			} else if (formatFn) {
				throw new Error("Format function '" + formatFn + "' does not exist");
			}

			nodeData.node.nodeValue = formatFn ? formatFn.call(this, value) : value;
		}
	});
});
