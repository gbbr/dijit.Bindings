define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
    "dijit/_WidgetsInTemplateMixin",
	"dojo/query",
	'dojo/text!../example_widget/template.html',
	'indium/_IndiumView',
	"dijit/_Templated",
	"dijit/layout/TabContainer",
	"dijit/layout/ContentPane"
], function(
	declare,
	_WidgetBase,
    _WidgetsInTemplateMixin,
	query,
	template,
	_IndiumView
) {
	return declare("widjit", [_WidgetBase, _IndiumView], {
		templateString: template,

		postCreate: function () {
			this.inherited(arguments);

		}
	});
});
