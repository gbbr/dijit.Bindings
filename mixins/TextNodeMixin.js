define([
	"dojo/_base/declare",
	"dojo/dom-construct",
	"dojo/_base/lang",
	"dijit/Destroyable"
], function (
	declare,
	domContruct,
	lang,
	Destroyable
) {
	return declare("indium/_TextBindingsMixin", [Destroyable], {

		NODE_TYPE_TEXT: 3,
		COLLECTOR_TEXT_NODES: "GATHERER_TEXTNODES",
		SETTER_TEXT_NODES: "SETTER_TEXTNODES",

		_textNodeCollectorStore: null,

		constructor: function () {
			this._textNodeCollectorStore = this.registrationService.getCollectorStore(this.COLLECTOR_TEXT_NODES);

			this.registrationService.addCollector(this._gatherTextNodes);
			this.registrationService.addBuilder(this._compileTextNodes);
			this.registrationService.addSetter(this.SETTER_TEXT_NODES, this._setNodeValue);
		},

		/**
		 * @description Verifies if provided DOM node is a text-node and contains
		 * substitutions, in which case it saves them in the store for compilation
		 * @param node {HTMLElement} Element to check for substitutions and validity
		 */
		_gatherTextNodes: function (node) {
			if (node.nodeType == this.NODE_TYPE_TEXT && this._bindingCount(node.nodeValue)) {
				this._textNodeCollectorStore.push(node);
			}
		},

		/**
		 * @description Compiles marked text-nodes and generates linking
		 * functions
		 */
		_compileTextNodes: function () {
			this._textNodeCollectorStore.forEach(function (node) {
				var interpolateFn = this.interpolateString(node.nodeValue),
					expressions = interpolateFn.expressions,
					parts = interpolateFn.parts,
					fragment = null;

				if (parts.length > 1) {
					fragment = this._createBindingsFromFragment(parts, expressions);
					node.parentNode.replaceChild(fragment, node);

				} else if (expressions.length === 1) {
					this._registerTextNodeSetter(expressions[0], node);
				}
			}, this);
		},

		_createBindingsFromFragment: function (parts, expressions) {
			var fragment = document.createDocumentFragment();

			parts.forEach(function (part) {
				var textNode = document.createTextNode(part);
				fragment.appendChild(textNode);

				if (expressions.indexOf(part) >= 0) {
					this._registerTextNodeSetter(part, textNode)
				}
			}, this);

			return fragment;
		},

		_registerTextNodeSetter: function (expression, node) {
			var parsedExpr = this.parseExpression(expression),
				setterFn = this.registrationService.getSetter(this, this.SETTER_TEXT_NODES, {
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
				formatFn = nodeData.formatFn,
				node = nodeData.node;

			if (lang.isFunction(this[formatFn])) {
				formatFn = this[formatFn];
			} else if (formatFn) {
				throw new Error("Format function '" + formatFn + "' does not exist");
			}

			node.nodeValue = formatFn ? formatFn.call(this, value) : value;
		}
	});
});
