define([
	"doh/runner",
	"dojo/_base/lang",
	"indium/services/Parser",
	"indium/lib/_StatefulModel",
	"testSuite"
], function (
	doh,
	lang,
	Parser,
	_StatefulModel,
	testSuite
) {
	testSuite("Parser Service", {
		beforeEach: function () {
			this.instance = new Parser();
		},

		"bindingCount: Correctly counts number of bindings": function () {
			testSuite.equals(this.instance._bindingCount("{{name}}"), 1);
			testSuite.equals(this.instance._bindingCount("{{name}}{{age}}"), 2);
			testSuite.equals(this.instance._bindingCount("{{person.name|upperCase}} is {{person.age}} years old"), 2);
			testSuite.equals(this.instance._bindingCount("Hello {{name|upperCase}} !"), 1);
			testSuite.equals(this.instance._bindingCount("No expressions"), 0);
		},

		"parseExpression: should return property and formatFn": function () {
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

		"interpolateString: should return expressions, separators and parts": function () {
			var interpolateFn = this.instance.interpolateString("{{id}}");

			testSuite.equals(interpolateFn.expressions, ["{{id}}"]);
			testSuite.equals(interpolateFn.separators, []);
			testSuite.equals(interpolateFn.parts, ["{{id}}"]);

			interpolateFn = this.instance.interpolateString("{{id}}{{title}}");

			testSuite.equals(interpolateFn.expressions, ["{{id}}", "{{title}}"]);
			testSuite.equals(interpolateFn.separators, []);

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

		"Interpolate function: Should correctly do replacements and react to unavailable data": function () {
			var toUppercase = function (str) {
					return str.toUpperCase();
				},

				testCases = [
					["Hello {{name}} !", { name: "John" },
						"Hello John !"],

					["Today is {{day|uppercase}}", { day: "FriDay", uppercase: toUppercase },
						"Today is FRIDAY"],

					["{{day|timesTwo}}nd of {{month}}", { day: 11, month: "July", timesTwo: function(x) {return x*2} },
						"22nd of July"],

					["{{value|inexistingFn}}tastic", { value: "fan" },
						"fantastic"],

					["{{foo}} {{bar|toUppercase}}", { bar: "boo" },
						"{{foo}} boo"],

					["{{foo|toUppercase}}{{bar}}", { foo: "loo", toUppercase: toUppercase },
						"LOO{{bar}}"],

					["Error {{item|forgotToReturn}}", { item: "you forgot to return", forgotToReturn: function (val) {} },
						"Error undefined"],

					["Hello {{myModel.key}}", { myModel: new _StatefulModel({ "key": "world" }) },
						"Hello world"]
				];

			testCases.forEach(function (test) {
				testSuite.equals(test[2], this.instance.interpolateString(test[0])(test[1]),
						"Did not interpolate correctly at " + test[0]);
			}, this);
		}
	});
});
