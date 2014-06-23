define([
	"doh/runner",
	"dojo/_base/lang",
	"indium/view/bindings/Parser",
	"indium/model/_StatefulModel",
	"indium/tests/testSuite"
], function (
	doh,
	lang,
	Parser,
	_StatefulModel,
	testSuite
) {
	testSuite("indium/view/bindings/Parser", {
		beforeEach: function () {
			this.instance = new Parser();
		},

		"bindingCount: Correctly counts number of expressions in string": function () {
			testSuite.equals(this.instance._bindingCount("{{name}}"), 1);
			testSuite.equals(this.instance._bindingCount("{{name}}{{age}}"), 2);
			testSuite.equals(this.instance._bindingCount("{{person.name|upperCase}} is {{person.age}} years old"), 2);
			testSuite.equals(this.instance._bindingCount("Hello {{name|upperCase}} !"), 1);
			testSuite.equals(this.instance._bindingCount("No expressions"), 0);
			testSuite.equals(this.instance._bindingCount(123), 0);
		},

		"parseExpression: should return property and formatFn from expression": function () {
			testSuite.equals(this.instance.parseExpression("{{name|toUppercase}}"), {
				expression: "name",
				formatFn: "toUppercase"
			});

			testSuite.equals(this.instance.parseExpression("{{model.key}}"), {
				expression: "model.key",
				formatFn: void 0
			});

			testSuite.equals(this.instance.parseExpression("{{model.key|transformFn}}"), {
				expression: "model.key",
				formatFn: "transformFn"
			});

			testSuite.equals(this.instance.parseExpression("Nothing here{{}}"), void 0);
			testSuite.equals(this.instance.parseExpression(""), void 0);
		},

		"interpolateString: should throw error when no expressions are found": function () {
			this.spy(this.instance, "interpolateString");

			try {
				this.instance.interpolateString("No expressions");
			} catch (error) {}

			testSuite.notEquals(typeof this.instance.interpolateString.exceptions[0], "undefined");
		},

		"interpolateString: should return expressions, separators and parts": function () {
			var interpolateFn = this.instance.interpolateString("{{id}}");
			testSuite.equals(interpolateFn.expressions, ["{{id}}"]);
			testSuite.equals(interpolateFn.separators, []);
			testSuite.equals(interpolateFn.parts, ["{{id}}"]);

			interpolateFn = this.instance.interpolateString("{{id}}{{title}}");
			testSuite.equals(interpolateFn.expressions, ["{{id}}", "{{title}}"]);
			testSuite.equals(interpolateFn.separators, []);
			testSuite.equals(interpolateFn.parts, ["{{id}}", "{{title}}"]);

			interpolateFn = this.instance.interpolateString("{{id}} and {{title}}");
			testSuite.equals(interpolateFn.expressions, ["{{id}}", "{{title}}"]);
			testSuite.equals(interpolateFn.separators, [" and "]);
			testSuite.equals(interpolateFn.parts, ["{{id}}", " and ", "{{title}}"]);

			interpolateFn = this.instance.interpolateString("With {{id}} and {{title}}.");
			testSuite.equals(interpolateFn.expressions, ["{{id}}", "{{title}}"]);
			testSuite.equals(interpolateFn.separators, ["With ", " and ", "."]);
			testSuite.equals(interpolateFn.parts, ["With ", "{{id}}", " and ", "{{title}}", "."]);

			interpolateFn = this.instance.interpolateString("With {{client.id}} and {{client.title|toUppercase}}.");
			testSuite.equals(interpolateFn.expressions, ["{{client.id}}", "{{client.title|toUppercase}}"]);
			testSuite.equals(interpolateFn.separators, ["With ", " and ", "."]);
			testSuite.equals(interpolateFn.parts, ["With ", "{{client.id}}", " and ", "{{client.title|toUppercase}}", "."]);
		},

		"interpolateString: should correctly return expressions in HTML": function () {
			var interpolateFn = this.instance.interpolateString('<div class="{{className}}">{{body}} and {{legs}}.</div>');

			testSuite.equals(interpolateFn.expressions, ["{{className}}", "{{body}}", "{{legs}}"]);
			testSuite.equals(interpolateFn.separators, ['<div class="', '">', ' and ', '.</div>']);
			testSuite.equals(interpolateFn.parts, ['<div class="', "{{className}}", '">', "{{body}}", " and ", "{{legs}}", '.</div>']);
		},

		"Interpolate function: should correctly replace values in strings": function () {
			var interpolateFn = this.instance.interpolateString('<div class="{{className}}">{{body}} and {{legs}}.</div>');

			testSuite.equals(interpolateFn({
				"className": "blue",
				"body": "Cow",
				"legs": "chicken"
			}), '<div class="blue">Cow and chicken.</div>');
		},

		"Interpolate function: should correctly use format functions in context": function () {
			var interpolateFn = this.instance.interpolateString('<div class="{{className}}">{{body}} and {{legs|toUppercase}}.</div>');

			testSuite.equals(interpolateFn({
				"className": "blue",
				"body": "Cow",
				"legs": "chickeN",
				"toUppercase": function (str) {
					return str.toUpperCase();
				}
			}), '<div class="blue">Cow and CHICKEN.</div>');
		},

		"Interpolate function: should ignore inexisting bindings": function () {
			var interpolateFn = this.instance.interpolateString("{{name}} has {{object}}.")

			testSuite.equals(interpolateFn({
				"name": "Osama"
			}), "Osama has {{object}}.")
		},

		"Interpolate function: should overlook missing format functions": function () {
			var interpolateFn = this.instance.interpolateString("My name is {{name|capitalize}}");

			testSuite.equals(interpolateFn({
				"name": "erik"
			}), "My name is erik");
		},

		"Interpolate function: should correctly do replacements for various scenarios": function () {
			testSuite.equals(
				this.instance.interpolateString("Hello {{name}} !")({
					"name": "John"
				}),
				// Result:
				"Hello John !"
			);

			testSuite.equals(
				this.instance.interpolateString("Today is {{day|uppercase}}")({
					"day": "Friday",
					"uppercase": function (str) {
						return str.toUpperCase();
					}
				}),

				"Today is FRIDAY"
			);

			testSuite.equals(
				this.instance.interpolateString("{{day|timesTwo}}nd of {{month}}")({
					"day": 11,
					"month": "July",
					"timesTwo": function (val) {
						return val * 2;
					}
				}),

				"22nd of July"
			);
		},

		"Interpolate function: reads value from model via getter": function () {
			var model = new _StatefulModel({
				"key": "1234"
			});

			this.spy(model, "get");

			testSuite.equals(
				this.instance.interpolateString("My password is {{model.key}} !")({
					"model": model
				}),

				"My password is 1234 !"
			);

			testSuite.isTrue(model.get.calledWith("key"));
		}
	});
});
