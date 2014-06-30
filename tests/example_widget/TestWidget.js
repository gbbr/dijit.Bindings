define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
    "dijit/_WidgetsInTemplateMixin",
	"dojo/query",
	'dojo/text!/reuters/IndiumView/tests/example_widget/template.html',
	'dojo/text!/reuters/IndiumView/tests/example_widget/otherwidget.html',
	'indium/view/Bindings',
	"dijit/_TemplatedMixin",
	"indium/model/_StatefulModel",
	"indium/view/bindings/mixins/RepeaterMixin",
	"dojo/parser",
	"dijit/layout/TabContainer",
	"dijit/layout/ContentPane"
], function(
	declare,
	_WidgetBase,
    _WidgetsInTemplateMixin,
	query,
	template,
	otherTemplate,
	Bindings,
	_TemplatedMixin,
	StatefulModel,
	RepeaterMixin
) {
	return {
		widget1: declare("widjit", [_WidgetBase, _TemplatedMixin, Bindings], {
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
				this.personModel = new StatefulModel({
					name: "Johnny",
					job: "Coder",
					"employees": {
						"Fritz": {
							"job": "Coder",
							"location": "Wien"
						},
						"Mary Poppins": {
							"job": "Cyborg",
							"location": "London"
						},
						"Theodore": {
							"job": "QA",
							"location": "Paris"
						}
					}
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

		widget2: declare("widjit2", [_WidgetBase, _TemplatedMixin, Bindings], {
			templateString: otherTemplate,

			name: "Name: ",
			className: "green",
			model: null,

			names: ["James", "Mary", "Michael"],

			companies: {
				"Thomson": "Financial",
				"Territory": "Digital Agency",
				"Reebok": "Gym",
				"San Pelegrino": "Water"
			},

			"employees": {
				"Fritz": {
					"job": "Coder",
					"location": "Wien"
				},
				"Mary Poppins": {
					"job": "Cyborg",
					"location": "London"
				},
				"Theodore": {
					"job": "QA",
					"location": "Paris"
				}
			},

			constructor: function () {
				this.model = new StatefulModel({
					name: "Matt",
					job: "Marketing",
					employees: {
						"12": "Adam Fox",
						"14": "James Derry",
						"16": "Jonathan Davis"
					}
				});
			},

			transformFn: function (value) {
				return "ooO " + value + " Ooo";
			},

			postCreate: function () {
				this.inherited(arguments);
				//console.log(this.registrationService.$bindingStore);
			}
		})
	};
});
