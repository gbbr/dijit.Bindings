define([
	"dojo/_base/declare",
	"indium/view/bindings/Compiler",
	"indium/view/bindings/mixin/TextNodeMixin",
	"indium/view/bindings/mixin/ElementAttributeMixin"
], function (
	declare,
	Compiler,
	TextNodeMixin,
	ElementAttributeMixin
) {
	return declare("indium/view/Bindings", [Compiler, TextNodeMixin, ElementAttributeMixin], {
		/**
		 * @description Dijit life-cycle method. Creates a DOM node but
		 * does not insert it into the page.
		 */
		buildRendering: function () {
			this.inherited(arguments);
			this.compile(this.domNode);
		}
	});
});
