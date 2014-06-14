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

		asd: "IT WORKS (replaced by Templated)!",

		transformFn3: function (value) {
			return "||||AAA||||" + value + "|||BBB|||";
		},

		transformFn2: function (value) {
			return "_**_" + value + "_**_";
		},

		transformFn: function (value) {
			return "ooO " + value + " Ooo";
		},

		postCreate: function () {
			this.inherited(arguments);
		}
	});
});
