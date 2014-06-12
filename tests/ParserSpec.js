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
		}
	});
});
