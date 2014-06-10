define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/query",
	"dojo/dom-construct",
    "indium/_LinkFunctionFactory"
], function (
	declare,
	lang,
	query,
	domConstruct,
    _LinkFunctionFactory
) {
	return declare("_IndiumView", [_LinkFunctionFactory], {

		$bindingStore: null,

		SUBSTITUTIONS_ALL: /\{\{([^\s\|\}]+)\|?([^\s\|\}]+)?\}\}/g,
		SUBSTITUTIONS_FIRST:  /\{\{([^\s\|\}]+)\|?([^\s\|\}]+)?\}\}/,

		NODE_TYPE_TEXT: 3,
		NODE_TYPE_ELEMENT: 1,

        _replacementFragments: [],
        _replacementAttributes: [],

		constructor: function () {
			// create store
		},

		buildRendering: function () {
			this.inherited(arguments);

			this.domNode = this._buildDomFromTemplate(this.template);
			this._compile(this.domNode);
		},

		_buildDomFromTemplate: function (template) {
			var node = domConstruct.toDom(template);
			if(node.nodeType != 1){
				throw new Error("Invalid template!");
			}
			return node;
		},

		_compile: function (rootNode) {
			this._traverseNodesAnd([
                this._markBindings // _markTextSubstitutions + _markAttrSubstitutions
            ], rootNode);

			this._storeBindings();
		},

        _callFunctions: function(fnList, context, argument) {
            fnList.forEach(function (fn) {
                fn.call(context, argument);
            }, this);
        },

		_traverseNodesAnd: function (actionFns, rootNode) {
			if (!document.createTreeWalker) {
				var node = rootNode.childNodes[0];
				while (node != null) {
                    this._callFunctions(actionFns, this, node);

					if (node.hasChildNodes()) {
						node = node.firstChild;
					} else {
						while (node.nextSibling == null && node != rootNode) {
							node = node.parentNode;
						}
						node = node.nextSibling;
					}
				}
			} else {
				var node, walk = document.createTreeWalker(rootNode, NodeFilter.SHOW_ALL, null, false);
				while (node = walk.nextNode()) {
                    this._callFunctions(actionFns, this, node);
				}
			}
		},

		_markBindings: function (node) {
			if (node.nodeType == this.NODE_TYPE_ELEMENT) {
				var i = node.attributes.length;
				while (i--) {
					if (this._bindingCount(node.attributes[i].value)) {
						this._markAttributeBinding(node, node.attributes[i]);
					}
				}
			} else if (node.nodeType == this.NODE_TYPE_TEXT) {
				if (this._bindingCount(node.nodeValue)) {
					this._markTextNodeBindings(node);
				}
			}
		},

		_markAttributeBinding: function (node, attribute) {
			this._replacementAttributes.push({
				node: node,
				attributeName: attribute.name,
				attributeTemplate: attribute.value
			});
		},

		_markTextNodeBindings: function (node) {
			var splitTextNode = this._breakTextNodeBindings(node);

			// Add to replacement fragments
			this._replacementFragments.push({
				replaceNode: node,
				replaceWith: splitTextNode.fragment,
				bindings: splitTextNode.bindings
			});
		},

		_breakTextNodeBindings: function (node) {
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

		_bindingCount: function (str) {
			var matches = str.match(this.SUBSTITUTIONS_ALL);
			return matches ? matches.length : 0;
		},

		_storeBindings: function () {
			// Create proper text-node structure and store
			// bindings
			this._replacementFragments.forEach(function (data) {
				var oldNode = data.replaceNode,
					newNode = data.replaceWith;

				oldNode.parentNode.replaceChild(newNode, oldNode);

				data.bindings.forEach(function (binding) {
					console.log(binding);
				});
			});

			// Store attributes
			this._replacementAttributes.forEach(function (data) {
				console.log(data);
			});
		}
	});
});