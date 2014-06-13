define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
    "dijit/_WidgetsInTemplateMixin",
	"dojo/query",
	'dojo/text!../example_widget/template.html',
	'indium/_IndiumView',
	"dijit/_TemplatedMixin",
	"dijit/layout/TabContainer",
	"dijit/layout/ContentPane"
], function(
	declare,
	_WidgetBase,
    _WidgetsInTemplateMixin,
	query,
	template,
	_IndiumView,
	_TemplatedMixin
) {
	return declare("widjit", [_WidgetBase, _TemplatedMixin, _IndiumView], {
		templateString: template,

		asd: 2,

		postCreate: function () {
			this.inherited(arguments);

		}
	});
});
