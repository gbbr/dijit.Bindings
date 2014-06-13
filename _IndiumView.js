define([
	"dojo/_base/declare",
	"indium/services/Compiler",
	"indium/mixins/TextNodeMixin",
	"indium/mixins/ElementAttributeMixin"
], function (
	declare,
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
			this.compile(this.domNode)(this);
		}
	});
});
