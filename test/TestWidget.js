define([
	'dojo/_base/declare',
	'dijit/_WidgetBase',
	"dojo/query",
	'dojo/text!test/template.html',
	'indium/_IndiumView'
], function(
	declare,
	_WidgetBase,
	query,
	template,
	_IndiumView
) {
	return declare("widjit", [_WidgetBase, _IndiumView], {
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
			dojo.connect(query("#typer")[0], "onkeypress", this._typing.bind(this));
		},

		_typing: function (event) {
			this.footer = event.srcElement.value;
			this.render();
		}
	});
});