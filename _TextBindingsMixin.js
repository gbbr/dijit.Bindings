define([
    "dojo/_base/declare",
    "dijit/Destroyable",
    "indium/_LinkFunctionFactory"
], function (
    declare,
    Destroyable,
    _LinkFunctionFactory
) {
    return declare("indium/_TextBindingsMixin", [_LinkFunctionFactory, Destroyable], {

        NODE_TYPE_TEXT: 3,

        _markedTextNodes: [],

        constructor: function () {
            this.own(this._markedTextNodes);
        },

        _markTextSubstitutions: function (node) {
            if (node.nodeType == this.NODE_TYPE_TEXT && this._bindingCount(node.nodeValue)) {
                var splitTextNode = this._breakTextNode(node);

                // Add to replacement fragments
                this._markedTextNodes.push({
                    replaceNode: node,
                    replaceWith: splitTextNode.fragment,
                    bindings: splitTextNode.bindings
                });
            }
        },

        _breakTextNode: function (node) {
            var bindings = [],
                partialNode = node,
                docFragment = document.createDocumentFragment(),
                textParts;

            // To correctly store binding(s) we must first split it into a
            // stand-alone text-node
            while (partialNode && this._bindingCount(partialNode.nodeValue)) {
                partialNode.nodeValue.replace(this.SUBSTITUTIONS_FIRST,
                    function(match, binding, formatFn, position, originalString) {
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
            if (textParts[1] && textParts[1].length) {
                docFragment.appendChild(document.createTextNode(textParts[1]));
            }

            return {
                bindings: bindings,
                fragment: docFragment
            }
        },

        _createTextNodeBindings: function () {
            this._markedTextNodes.forEach(function (data) {
                var oldNode = data.replaceNode,
                    newNode = data.replaceWith;

                oldNode.parentNode.replaceChild(newNode, oldNode);

                data.bindings.forEach(function (binding) {
                    console.log(binding);
                });
            });
        }
    });
});