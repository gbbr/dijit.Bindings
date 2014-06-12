define([
	"dojo/_base/declare",
	"dojo/dom-construct",
	"indium/services/Compiler",
	"indium/mixins/TextNodeMixin",
	"indium/mixins/ElementAttributeMixin"
], function (
	declare,
	domConstruct,
	Compiler,
	TextNodeMixin,
	ElementAttributeMixin
) {
	return declare("indium/_IndiumView", [Compiler, TextNodeMixin, ElementAttributeMixin], {
		/**
		 * @description Dijit life-cycle method, builds, traverses, compiles and
		 * links DOM nodes to model and/or instance properties
		 */
		buildRendering: function () {
			this.inherited(arguments);
			this.domNode = domConstruct.toDom(this.template || this.templateString);
			console.log(this.domNode.innerHTML);

			if (this.domNode.nodeType != 1) {
				throw new Error("Invalid template, must have only one element starting on the first line!");
			}

			this.compile(this.domNode)(this);
		},

		startup: function () {
			console.log(this.domNode);
		}
	});
});
