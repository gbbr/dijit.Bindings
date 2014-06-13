define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/dom-construct",
	'dijit/_WidgetBase',
	"dijit/_WidgetsInTemplateMixin",
	"indium/services/Compiler",
	"indium/mixins/TextNodeMixin",
	"indium/mixins/ElementAttributeMixin"
], function (
	declare,
	lang,
	domConstruct,
	_WidgetBase,
	_WidgetsInTemplateMixin,
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
