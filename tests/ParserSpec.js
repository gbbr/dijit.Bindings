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

		"Parse expression: should return binding name and formatFn or undefined": function () {
			var testCases = [
					[
						"{{A|B}}", { binding: "A", formatFn: "B" }
					],
					[
						"random text", void 0
					],
					[
						"", void 0
					],
					[
						"{{model.key|formatFn}}", { binding: "model.key", formatFn: "formatFn" }
					],
					[
						"{{}}", void 0
					],
					[
						"{{model.key}}", { binding: "model.key", formatFn: void 0 }
					],
					[
						"{{|formatFn}}", void 0
					],
					[
						"{{color}}", { binding: "color", formatFn: void 0 }
					]
				], result;

			testCases.forEach(function (test) {
				result = this.instance.parseExpression(test[0]);
				testSuite.equals(test[1], result, "Did not correctly parse " + test[0]);
			}, this);
		},

		"Interpolate string: should not miss any expressions or separators": function () {
			var testCases = [
				["{{A}}", 				 { separators: [],                     expressions: ['{{A}}']	}],
				["{{A}} ", 				 { separators: [' '],                  expressions: ['{{A}}']	}],
				[" {{A}} ", 			 { separators: [' ',' '],              expressions: ['{{A}}']	}],
				["{{A}}{{B}}", 			 { separators: [],                     expressions: ['{{A}}', '{{B}}'] }],
				["{{A}} space {{B}}", 	 { separators: [' space '],      	   expressions: ['{{A}}', '{{B}}'] }],
				["{{A|transformFn}}asd", { separators: ['asd'],				   expressions: ['{{A|transformFn}}'] }],
				[" {{prop.key|fn}}asd",  { separators: [' ', 'asd'],           expressions: ['{{prop.key|fn}}'] }],
				["zxc {{A}}abc{{B}}qwe", { separators: ["zxc ", "abc", "qwe"], expressions: ['{{A}}', '{{B}}'] }]
			];

			testCases.forEach(function (test) {
				var interpolateFn = this.instance.interpolateString(test[0]);
				testSuite.equals(test[1].separators, interpolateFn.separators, "Separators did not match on " + test[0]);
				testSuite.equals(test[1].expressions, interpolateFn.expressions, "Expressions did not match on " + test[0]);
			}, this);
		}
	});
});
