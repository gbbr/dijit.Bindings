define([
	"dojo/_base/declare",
	"indium/services/Compiler",
	"indium/mixins/TextNodeMixin",
	"indium/mixins/ElementAttributeMixin",
	"indium/mixins/RepeaterMixin"
], function (
	declare,
	Compiler,
	TextNodeMixin,
	ElementAttributeMixin,
	RepeaterMixin
) {
	return declare("indium/_IndiumView",
		[Compiler, TextNodeMixin, ElementAttributeMixin, RepeaterMixin], {
		/**
		 * @description Dijit life-cycle method. Creates a DOM node but
		 * does not insert it into the page.
		 */
		buildRendering: function () {
			this.inherited(arguments);
			this.compile(this.domNode)(this);
		}
	});
});
