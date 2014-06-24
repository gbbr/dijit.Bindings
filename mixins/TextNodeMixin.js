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
	/**
	 * @module TextBindingsMixin
	 * @description Adds text-node binding capabilities to the compiler.
	 * When multiple bindings are found within the same text-node, this
	 * mixin will construct a document fragment to isolate those bindings
	 * from their surroundings. Performance is improved when bindings are
	 * isolated by template (ie. contained within an element)
	 */
	return declare("indium/view/bindings/mixins/TextBindingsMixin", [Destroyable], {

		NODE_TYPE_TEXT: 3,
		COLLECTOR_TEXT_NODES: "GATHERER_TEXTNODES",

		/**
		 * @description Creates a store for the collectors, attaches
		 */
		constructor: function () {
			this.registrationService.addCollector(this._gatherTextNodes);
			this.registrationService.addBuilder(this._compileTextNodes);
		},

		/**
		 * @description Verifies if provided DOM node is a text-node and contains
		 * substitutions, in which case it saves them in the store for compilation
		 * @param node {HTMLElement} Element to check for substitutions and validity
		 */
		_gatherTextNodes: function (node) {
			if (node.nodeType === this.NODE_TYPE_TEXT && this._bindingCount(node.nodeValue)) {
				this.registrationService.getCollectorStore(this.COLLECTOR_TEXT_NODES).push(node);
			}
		},

		/**
		 * @description Interpolates text-node, creates bindings and if necessary
		 * splits text-node into a fragment (when it is composed of multiple parts
		 * or contains multiple expressions)
		 */
		_compileTextNodes: function () {
			var store = this.registrationService.getCollectorStore(this.COLLECTOR_TEXT_NODES);

			store.forEach(function (node) {
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

		/**
		 * @description Creates a document fragment from an array of
		 * parts and registers setters for expressions
		 * @param parts {Array<String>} An array of parts in the desired order
		 * @param expressions {Array<String>} An array of expressions found in the parts
		 * @returns {DocumentFragment} The completed and bound document fragment
		 */
		_createBindingsFromFragment: function (parts, expressions) {
			var fragment = document.createDocumentFragment();

			parts.forEach(function (part) {
				var textNode = document.createTextNode(part);
				fragment.appendChild(textNode);

				if (expressions.indexOf(part) >= 0) {
					this._registerTextNodeSetter(part, textNode);
				}
			}, this);

			return fragment;
		},

		/**
		 * @description Attaches a setter to the binding store to link to
		 * @param expression {String} The expression that the setter is for
		 * @param node {HTMLElement} The node where the expression should be evaluated
		 */
		_registerTextNodeSetter: function (expression, node) {
			var name = this.parseExpression(expression).expression;
			this.createSetter(name, this._setNodeValue, {
				"node": node,
				"interpolateFn": this.interpolateString(expression)
			});
		},

		/**
		 * @description Sets a text node's value and passes it through
		 * a transform function if provided
		 * @param args {Array<mixed>} Contains two items:
		 * new value to be set on the text node and a configuration
		 * object describing specifics set during generation
		 */
		_setNodeValue: function (config) {
			config.node.nodeValue = config.interpolateFn(this);
		}
	});
});
