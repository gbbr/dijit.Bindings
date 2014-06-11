define([
	"dojo/_base/declare",
	"dijit/_WidgetBase",
	"dijit/_WidgetsInTemplateMixin",
	"indium/_IndiumView",
	"dijit/layout/TabContainer",
	"dijit/layout/ContentPane",

	"dojo/text!indium/tests/templates/template1.html"
], function (
	declare,
	_WidgetBase,
	_WidgetsInTemplateMixin,
	_IndiumView,
	TabContainer,
	ContentPane,

	template1
) {
	return {
		WIDGET_WITH_BINDINGS: declare("Widget.with.bindings", [_WidgetBase, _WidgetsInTemplateMixin, _IndiumView], { template: template1 })
	};
});
