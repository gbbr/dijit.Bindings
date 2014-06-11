define([
	"dojo/_base/declare",
	"dijit/Destroyable",
	"indium/_LinkFunctionFactory"
], function (
	declare,
	Destroyable,
	_LinkFunctionFactory
) {
	return declare("indium/_TextBindingsMixin", [
		_LinkFunctionFactory, Destroyable], {

		/**
		 * @description HTML #text-node nodeType value
		 */
		NODE_TYPE_TEXT: 3,
		GATHERER_TEXTNODES: "GATHERER_TEXTNODES",

		constructor: function () {
			this._addGatherer(this.GATHERER_TEXTNODES, this._gatherTextNodes);
			this._addCompiler(this._compileTextNodes);
		},

		/**
		 * @description Verifies if provided DOM node is a text-node and contains
		 * substitutions, in which case it saves them in the store for compilation
		 * @param node {HTMLElement} Element to check for substitutions and validity
		 */
		_gatherTextNodes: function (node) {
			var gatherer = this._getGathererStore(this.GATHERER_TEXTNODES);

			if (node.nodeType == this.NODE_TYPE_TEXT && this._bindingCount(node.nodeValue)) {
				var splitTextNode = this._breakTextNode(node);

				// Add to replacement fragments
				gatherer.push({
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
			var gatherer = this._getGathererStore(this.GATHERER_TEXTNODES);

			gatherer.forEach(function (data) {
				var oldNode = data.replaceNode,
					newNode = data.replaceWith;

				oldNode.parentNode.replaceChild(newNode, oldNode);

				data.bindings.forEach(function (binding) {
					console.log(binding);
				});
			});
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
			}
		}
	});
});
