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

		"bindingCount: Correctly counts number of bindings": function () {
			testSuite.equals(this.instance._bindingCount("{{name}}"), 1);
			testSuite.equals(this.instance._bindingCount("{{name}}{{age}}"), 2);
			testSuite.equals(this.instance._bindingCount("{{person.name|upperCase}} is {{person.age}} years old"), 2);
			testSuite.equals(this.instance._bindingCount("Hello {{name|upperCase}} !"), 1);
			testSuite.equals(this.instance._bindingCount("No expressions"), 0);
			testSuite.equals(this.instance._bindingCount(123), 0);
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

		"Interpolate function: should not fail with HTML": function () {
			var interpolateFn = this.instance.interpolateString('<div class="{{className}}">{{body}} and {{legs}}.</div>');

			testSuite.equals(interpolateFn.expressions, ["{{className}}", "{{body}}", "{{legs}}"]);
			testSuite.equals(interpolateFn.separators, ['<div class="', '">', ' and ', '.</div>']);
			testSuite.equals(interpolateFn.parts, ['<div class="', "{{className}}", '">', "{{body}}", " and ", "{{legs}}", '.</div>']);

			testSuite.equals(interpolateFn({
				"className": "blue",
				"body": "Cow",
				"legs": "chickeN"
			}), '<div class="blue">Cow and chickeN.</div>');
		},

		"Interpolate function: Should correctly interpolate against given context": function () {
			var toUppercase = function (str) {
					return str.toUpperCase();
				},

				testCases = [
					// Test:
					["Hello {{name}} !", { name: "John" },
						// Expected result:
						"Hello John !"],

					// Test:
					["Today is {{day|uppercase}}", { day: "FriDay", uppercase: toUppercase },
						// Expected result:
						"Today is FRIDAY"],

					// Test:
					["{{day|timesTwo}}nd of {{month}}", { day: 11, month: "July", timesTwo: function(x) {return x*2} },
						// Expected result:
						"22nd of July"],

					// Test:
					["{{value|inexistingFn}}tastic", { value: "fan" },
						// Expected result:
						"fantastic"],

					// Test:
					["{{foo}} {{bar|toUppercase}}", { bar: "boo" },
						// Expected result:
						"{{foo}} boo"],

					// Test:
					["{{foo|toUppercase}}{{bar}}", { foo: "loo", toUppercase: toUppercase },
						// Expected result:
						"LOO{{bar}}"],

					// Test:
					["Error {{item|forgotToReturn}}", { item: "you forgot to return", forgotToReturn: function (val) {} },
						// Expected result:
						"Error undefined"],

					// Test:
					["Hello {{myModel.key}}", { myModel: new _StatefulModel({ "key": "world" }) },
						// Expected result:
						"Hello world"]
				];


			testCases.forEach(function (test) {
				testSuite.equals(test[2], this.instance.interpolateString(test[0])(test[1]),
						"Did not interpolate correctly at " + test[0]);
			}, this);
		}
	});
});
