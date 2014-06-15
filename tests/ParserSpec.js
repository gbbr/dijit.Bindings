define([
	"doh/runner",
	"indium/services/Parser",
	"testSuite"
], function (
	doh,
	Parser,
	testSuite
) {
	testSuite("Parser Service", {
		beforeEach: function () {
			this.instance = new Parser();
		},

		"Correctly counts number of bindings": function () {
			var testCases = [
				["asd{{1}}zxc", 			 1],
				["{{1}}", 					 1],
				["{{1}}{{2}}{{3}}poi", 		 3],
				["{{1}}ips|}um{{2}}", 		 2],
				["{{1}}{{2}}x{{3}} asd ", 	 3],
				["   {{1}}  {{3}}", 		 2],
				["sadklj 90{}", 			 0],
				["{{sadasdsdwq{{", 			 0,
				["{}}sdjxck{{ }as"], 		 0],
				["asd{{1|2}}", 				 1],
				["{{1|4er}}", 				 1],
				["{{1|asd2}}|{{|2|1}}{{3}}", 2],
				["{{1|asd}}ipsum{{2|123}}",  2]
			];

			testCases.forEach(function (test) {
				testSuite.equals(test[1], this.instance._bindingCount(test[0]), "Binding count failed at " + test[1]);
			}, this);
		},

		"Should not return undefined when no bindings are found": function () {
			testSuite.equals(0, this.instance._bindingCount("asd"), "Did not return 0 at mismatched type")
		},

		"Parse expression: should return binding name and formatFn or undefined": function () {
			var testCases = [
					[ "{{A|B}}", { binding: "A", formatFn: "B" } ],
					[ "random text", void 0 ],
					[ "", void 0 ],
					[ "{{model.key|formatFn}}", { binding: "model.key", formatFn: "formatFn" } ],
					[ "{{}}", void 0 ],
					[ "{{model.key}}", { binding: "model.key", formatFn: void 0 } ],
					[ "{{|formatFn}}", void 0 ],
					[ "{{color}}", { binding: "color", formatFn: void 0 } ]
				], result;

			testCases.forEach(function (test) {
				result = this.instance.parseExpression(test[0]);
				testSuite.equals(test[1], result, "Did not correctly parse " + test[0]);
			}, this);
		},

		"Interpolate string: should not miss any expressions or separators": function () {
			var testCases = [
				["{{A}}", 				 {
					separators: [],
					expressions: ['{{A}}'],
					parts: ["{{A}}"]
				}],
				["{{A}} ", 				 {
					separators: [' '],
					expressions: ['{{A}}'],
					parts: ["{{A}}", " "]
				}],
				[" {{A}} ", 			 {
					separators: [' ',' '],
					expressions: ['{{A}}'],
					parts: [" ", "{{A}}", " "]
				}],
				["{{A}}{{B}}", 			 {
					separators: [],
					expressions: ['{{A}}', '{{B}}'],
					parts: ["{{A}}", "{{B}}"]
				}],
				["{{prop}} space {{model.key}}", 	 {
					separators: [' space '],
					expressions: ['{{prop}}', '{{model.key}}'],
					parts: ["{{prop}}", " space ", "{{model.key}}"]
				}],
				["{{A|transformFn}}asd", {
					separators: ['asd'],
					expressions: ['{{A|transformFn}}'],
					parts: ["{{A|transformFn}}", "asd"]
				}],
				[" {{prop.key|fn}}asd",  {
					separators: [' ', 'asd'],
					expressions: ['{{prop.key|fn}}'],
					parts: [" ", "{{prop.key|fn}}", "asd"]
				}],
				["zxc {{A}} abc {{B}} qwe", {
					separators: ["zxc ", " abc ", " qwe"],
					expressions: ['{{A}}', '{{B}}'],
					parts: ["zxc ", "{{A}}", " abc ", "{{B}}", " qwe"]
				}]
			];

			testCases.forEach(function (test) {
				var interpolateFn = this.instance.interpolateString(test[0]);
				testSuite.equals(test[1].separators, interpolateFn.separators, "Separators did not match on " + test[0]);
				testSuite.equals(test[1].expressions, interpolateFn.expressions, "Expressions did not match on " + test[0]);
				testSuite.equals(test[1].parts, interpolateFn.parts, "Parts did not match on " + test[0]);
			}, this);
		},

		"Interpolate function: Should correctly do replacements and react to unavailable data": function () {
			var toUppercase = function (str) {
					return str.toUpperCase();
				},

				dummyFunction = function () {},

				testCases = [
					["Hello {{name}} !", { name: "John" }, "Hello John !"],
					["Today is {{day|uppercase}}", { day: "FriDay", uppercase: toUppercase }, "Today is FRIDAY"],
					["{{a}}", { a: 2 }, "2"],
					["{{value|inexistingFn}}tastic", { value: "output" }, "outputtastic"],
					["{{foo}}{{bar|toUppercase}}", { toUppercase: dummyFunction }, "{{foo}}{{bar|toUppercase}}"],
					["{{foo|toUppercase}}{{bar}}", { foo: "loo", toUppercase: toUppercase }, "LOO{{bar}}"]
				];

			testCases.forEach(function (test) {
				testSuite.equals(test[2], this.instance.interpolateString(test[0])(test[1]),
						"Did not interpolate correctly at " + test[0]);
			}, this);
		}
	});
});
