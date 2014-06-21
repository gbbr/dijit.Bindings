define([
	"../lib/dojo/_base/declare",
	"dijit/Destroyable"
], function (
	declare,
	Destroyable
) {
	/**
	 * @module AttributeBindingsMixin
	 * @description Adds the capability to use expressions within attribute
	 * names. It is recommended that once an expression is added within an
	 * attribute's value to not modify that value by other means than the
	 * compiler.
	 */
	return declare("indium/_AttributeBindingsMixin", [Destroyable], {

		/**
		 * @description Attribute mixin identifiers
		 */
		NODE_TYPE_ELEMENT: 1,
		COLLECTOR_ATTRIBUTES: "GATHERER_ATTRIBUTES",

		constructor: function () {
			this.registrationService.addCollector(this._gatherAttributes);
			this.registrationService.addBuilder(this._compileAttributes);
		},

		/**
		 * Identifies and stores all substitutions present in element attributes: the original
		 * template, the node, and the attribute name.
		 * @param node {HTMLElement} Node to verify
		 */
		_gatherAttributes: function (node) {
			if (node.nodeType === this.NODE_TYPE_ELEMENT) {
				var i = node.attributes.length, attribute,
					store = this.registrationService.getCollectorStore(this.COLLECTOR_ATTRIBUTES);

				while (i--) {
					attribute = node.attributes[i];

					if (this._bindingCount(attribute.value) > 0) {
						store.push({
							node: node,
							attributeName: attribute.name,
							attributeTemplate: attribute.value
						});
					}
				}
			}
		},

		/**
		 * @description Creates linking functions. Attaches information to the setter such as
		 * node, attribute name and an interpolation function for easy updating.
		 */
		_compileAttributes: function () {
			var store = this.registrationService.getCollectorStore(this.COLLECTOR_ATTRIBUTES);

			store.forEach(function (data) {
				var interpolateAttribute = this.interpolateString(data.attributeTemplate);

				interpolateAttribute.expressions.forEach(function (expression) {
					var name = this.parseExpression(expression).expression;
					this.createSetter(name, this._setNodeAttribute, {
						node: data.node,
						attributeName: data.attributeName,
						interpolationFn: interpolateAttribute
					});
				}, this);
			}, this);
		},

		/**
		 * @description Sets the new node value using the data provided.
		 * @param args {Array<mixed>} Contains two items: evaluation scope
		 * and details added during the compiling stage (above)
		 */
		_setNodeAttribute: function(config) {
			config.node.setAttribute(config.attributeName, config.interpolationFn(this));
		}
	});
});
