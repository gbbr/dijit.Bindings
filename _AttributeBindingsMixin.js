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
		GATHERER_ATTRIBUTES: "GATHERER_ATTRIBUTES",

		constructor: function () {
			this._addGatherer(this.GATHERER_ATTRIBUTES, this._gatherAttributes);
			this._addCompiler(this._compileAttributes);
		},

		/**
		 * Identifies and stores all substitutions present in element attributes
		 * @param node {HTMLElement} Node to verify
		 * @private
		 */
		_gatherAttributes: function (node) {
			var gatherer = this._getGathererStore(this.GATHERER_ATTRIBUTES);

			if (node.nodeType == this.NODE_TYPE_ELEMENT) {
				var i = node.attributes.length;
				while (i--) {
					if (this._bindingCount(node.attributes[i].value)) {
						// parse
						//  +
						// push
						gatherer.push({
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
		_compileAttributes: function () {
			var gatherer = this._getGathererStore(this.GATHERER_ATTRIBUTES);

			gatherer.forEach(function (data) {
				console.log(data);
			});
		}
	});
});