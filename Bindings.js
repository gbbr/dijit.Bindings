define([
	"dojo/_base/declare",
	"indium/view/bindings/Compiler",
	"indium/view/bindings/mixins/TextNodeMixin",
	"indium/view/bindings/mixins/ElementAttributeMixin",
	"indium/view/bindings/mixins/RepeaterMixin"
], function (
	declare,
	Compiler,
	TextNodeMixin,
	ElementAttributeMixin,
	RepeaterMixin
) {
	return declare("indium/view/Bindings",
		[Compiler, RepeaterMixin, TextNodeMixin, ElementAttributeMixin], {
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
