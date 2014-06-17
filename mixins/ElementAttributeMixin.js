define([
	"../lib/dojo/_base/declare",
	"dijit/Destroyable"
], function (
	declare,
	Destroyable
) {
	return declare("indium/_AttributeBindingsMixin", [Destroyable], {

		/**
		 * @description HTML Element nodeType value
		 */
		NODE_TYPE_ELEMENT: 1,
		COLLECTOR_ATTRIBUTES: "GATHERER_ATTRIBUTES",
		SETTER_ATTRIBUTE: "SETTER_ATTRIBUTES",

		constructor: function () {
			this.registrationService.addCollector(this._gatherAttributes);
			this.registrationService.addBuilder(this._compileAttributes);
			this.registrationService.addSetter(this.SETTER_ATTRIBUTE, this._setNodeAttribute);
		},

		/**
		 * Identifies and stores all substitutions present in element attributes
		 * @param node {HTMLElement} Node to verify
		 * @private
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
		 * @description Creates linking functions and deletes storage
		 */
		_compileAttributes: function () {
			var store = this.registrationService.getCollectorStore(this.COLLECTOR_ATTRIBUTES);

			store.forEach(function (data) {
				var interpolateAttribute = this.interpolateString(data.attributeTemplate);

				interpolateAttribute.expressions.forEach(function (expression) {
					var parsedExpr = this.parseExpression(expression),
						setterFn = this.registrationService.getSetter(this, this.SETTER_ATTRIBUTE, {
							node: data.node,
							attributeName: data.attributeName,
							interpolationFn: interpolateAttribute
						});

					this.attachSetter(parsedExpr.binding, setterFn);
				}, this);
			}, this);
		},

		/**
		 * @desription Node attribute setter function
		 * @param args {Array<mixed>} Contains two items:
		 * new value to be set on the attribute and a configuration
		 * object describing specifics set during generation
		 */
		_setNodeAttribute: function(args) {
			var context = args[1], data = args[0];
			data.node.setAttribute(data.attributeName, data.interpolationFn(context));
		}
	});
});
