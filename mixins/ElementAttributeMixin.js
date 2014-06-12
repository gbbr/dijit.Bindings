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
			this.registrationService.addCollector(this.COLLECTOR_ATTRIBUTES, this._gatherAttributes);
			this.registrationService.addCompiler(this._compileAttributes);
			this.registrationService.addSetter(this.SETTER_ATTRIBUTE, this._setNodeAttribute);
		},

		/**
		 * Identifies and stores all substitutions present in element attributes
		 * @param node {HTMLElement} Node to verify
		 * @private
		 */
		_gatherAttributes: function (node) {
			if (node.nodeType == this.NODE_TYPE_ELEMENT) {
				var gatherer = this.registrationService.getCollectorStore(this.registrationService.COLLECTOR_ATTRIBUTES),
					i = node.attributes.length;

				while (i--) {
					if (this._bindingCount(node.attributes[i].value)) {
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
			var gatherer = this.registrationService.getCollectorStore(this.registrationService.COLLECTOR_ATTRIBUTES);

			gatherer.forEach(function (data) {
				console.log(data);
				//registrationService.getSetter
			});
		},

		/**
		 * @desription Node attribute setter function
		 * @param args {Array<mixed>} Contains two items:
		 * new value to be set on the attribute and a configuration
		 * object describing specifics set during generation
		 */
		_setNodeAttribute: function(args) {
			/*
			 { node, attrName, value, formatFn, substitution.name(?) }
			 Always keep current value so we can replace with new value even
			 if the classes position changes in the classList
			 */
			var value = args[1], data = args[0];
		}
	});
});
