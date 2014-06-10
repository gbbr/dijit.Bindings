define([
    "dojo/_base/declare"
], function (
    declare
) {
    return declare("indium/_IndiumViewHelpers", [], {

        _callFunctions: function(fnList, context, argument) {
            fnList.forEach(function (fn) {
                fn.call(context, argument);
            }, this);
        },

        _bindingCount: function (str) {
            var matches = str.match(this.SUBSTITUTIONS_ALL);
            return matches ? matches.length : 0;
        }
    });
});