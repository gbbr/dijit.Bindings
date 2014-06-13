define([
	"dojo/_base/declare",
	"dijit/Destroyable"
], function (
	declare,
	Destroyable
) {
	return declare("indium/_TextBindingsMixin", [Destroyable], {

		NODE_TYPE_TEXT: 3,
		COLLECTOR_TEXT_NODES: "GATHERER_TEXTNODES",
		SETTER_TEXTNODES: "SETTER_TEXTNODES",

		constructor: function () {
			this.collectorStore = this.registrationService.getCollectorStore(this.COLLECTOR_TEXT_NODES);

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
				var	splitTextNode = this._breakTextNode(node);

				this.collectorStore.push({
					replaceNode: node,
					replaceWith: splitTextNode.fragment,
					bindings: splitTextNode.bindings
				});
			}
		},

		/**
		 * @description Compiles marked text-nodes and generates linking
		 * functions
		 */
		_compileTextNodes: function () {
			this.collectorStore.forEach(function (collector) {
				var oldNode = collector.replaceNode,
					newNode = collector.replaceWith;

				oldNode.parentNode.replaceChild(newNode, oldNode);

				collector.bindings.forEach(function (binding) {
					console.log(binding);
					//registrationService.getSetter
				});
			});
		},

		/**
		 * @description Sets a text node's value and passes it through
		 * a transform function if provided
		 * @param args {Array<mixed>} Contains two items:
		 * new value to be set on the text node and a configuration
		 * object describing specifics set during generation
		 */
		_setNodeValue: function (args) {
			var value = args[1], data = args[0],
				formatFn = data.formatFn;

			data.node.nodeValue = formatFn ? formatFn.call(this, value) : value;
		},

		/**
		 * Takes a text-node with multiple bindings and breaks it so that there
		 * is only one text node for each binding
		 * @param node {HTMLElement} The text-node to process
		 * @returns {{bindings: Array, fragment: DocumentFragment}} Returns an array
		 * of bindings as well as the resulting DOM fragment
		 * @private
		 */
		_breakTextNode: function (node) {
			var bindings = [],
				partialNode = node,
				docFragment = document.createDocumentFragment(),
				textParts;

			// To correctly store binding(s) we must first split it into a
			// stand-alone text-node
			while (partialNode && this._bindingCount(partialNode.nodeValue)) {
				partialNode.nodeValue.replace(this.SUBSTITUTIONS_FIRST,
					function (match, binding, formatFn, position, originalString) {
						// Separate match from surroundings
						textParts = originalString.split(match);
						// If there was text to the left, keep it
						if (textParts[0].length > 0) {
							docFragment.appendChild(document.createTextNode(textParts[0]));
						}
						// Save a reference to the match and add it to fragment
						bindings.push({ binding: binding, formatFn: formatFn, node: document.createTextNode(match) });
						docFragment.appendChild(bindings[bindings.length - 1].node);
						// If there was text to the right, continue, otherwise finish
						partialNode = textParts[1] ? document.createTextNode(textParts[1]) : null;
					});
			}

			// Is there anything left?
            // TODO: dangerous reference here
			if (textParts[1] && textParts[1].length) {
				docFragment.appendChild(document.createTextNode(textParts[1]));
			}

			return {
				bindings: bindings,
				fragment: docFragment
			};
		}
	});
});
