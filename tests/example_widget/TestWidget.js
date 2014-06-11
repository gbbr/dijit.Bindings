define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
    "dijit/_WidgetsInTemplateMixin",
	"dojo/query",
	'dojo/text!tests/example_widget/template.html',
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
	_IndiumView,
	_Templated
) {
	return declare("widjit", [_WidgetBase, _WidgetsInTemplateMixin, _IndiumView], {
		template: template,

		constructor: function () {
			this.content = {
				title: "Hello title!",
				subtitle: "Hello subtitle!",
				body: "Lorem ipsum dolorem sit amet",
				abstract:"<b>Some extra stuff</b>"
			};

			this.footer = "<i>Type something...</i>";
		},

		postCreate: function () {
			this.inherited(arguments);

		}
	});
});