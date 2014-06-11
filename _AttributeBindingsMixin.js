define([
	"dojo/_base/declare",
	"dijit/Destroyable",
	"indium/_LinkFunctionFactory"
], function (
	declare,
	Destroyable,
	_LinkFunctionFactory
) {
	return declare("indium/_AttributeBindingsMixin", [_LinkFunctionFactory, Destroyable], {

		/**
		 * @description HTML Element nodeType value
		 */
		NODE_TYPE_ELEMENT: 1,

		/**
		 * @description A place to store all DOM nodes that have attributes
		 * containing substitution strings. This will be erased during compiling.
		 */
		_markedAttrNodes: [],

		constructor: function () {
			this.own(this._markAttrSubstitutions);
		},

		/**
		 * Identifies and stores all substitutions present in element attributes
		 * @param node {HTMLElement} Node to verify
		 * @private
		 */
		_markAttrSubstitutions: function (node) {
			if (node.nodeType == this.NODE_TYPE_ELEMENT) {
				var i = node.attributes.length;
				while (i--) {
					if (this._bindingCount(node.attributes[i].value)) {
						// parse
						//  +
						// push
						this._markedAttrNodes.push({
							node: node,
							attributeName: node.attributes[i].name,
							attributeTemplate: node.attributes[i].value
						});
					}
				}
			}
		},

		/**
		 * @description Creates linking functions and deletes storage
		 */
		_createAttrBindings: function () {
			this._markedAttrNodes.forEach(function (data) {
				console.log(data);
			});

			delete this._markedAttrNodes;
		}
	});
});