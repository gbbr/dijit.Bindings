define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
    "dijit/_WidgetsInTemplateMixin",
	"dojo/query",
	'dojo/text!../example_widget/template.html',
	'dojo/text!../example_widget/otherwidget.html',
	'indium/_IndiumView',
	"dijit/_TemplatedMixin",
	"indium/lib/_StatefulModel"
], function(
	declare,
	_WidgetBase,
    _WidgetsInTemplateMixin,
	query,
	template,
	otherTemplate,
	_IndiumView,
	_TemplatedMixin,
	_StatefulModel
) {
	var model1 = declare("Model1", [_StatefulModel], {});
	var model2 = declare("Model2", [_StatefulModel], {});

	return {
		widget1: declare("widjit", [_WidgetBase, _TemplatedMixin, _IndiumView], {
			templateString: template,

			dapOtherWidget: null,

			personModel: null,

			asd: "IT WORKS (replaced by Templated)!",

			footer: "dummy text",
			abstract: "lorem ipsum",
			className: "none",
			z: "Z",
			link: "http://www.google.com",

			constructor: function () {
				this.personModel = new model1({
					name: "Johnny",
					job: "Coder"
				});
			},

			transformFn3: function (value) {
				return "||||AAA||||" + value + "|||BBB|||";
			},

			transformFn2: function (value) {
				return "show-" + value;
			},

			transformFn: function (value) {
				return "ooO " + value + " Ooo";
			},

			postCreate: function () {
				this.inherited(arguments);
			}
		}),

		widget2: declare("widjit2", [_WidgetBase, _TemplatedMixin, _IndiumView], {
			templateString: otherTemplate,

			name: "Name: ",
			className: "green",
			model: null,

			constructor: function () {
				this.model = new model2({
					name: "Matt",
					job: "Marketing"
				});
			},

			transformFn: function (value) {
				return "ooO " + value + " Ooo";
			},

			postCreate: function () {
				this.inherited(arguments);
				console.log('hi this is my store: ');
				//console.log(this.registrationService.$bindingStore);
			}
		})
	};
});
