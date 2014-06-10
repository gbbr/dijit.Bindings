/**
 var set = s.generate(this, s.SETTER_ATTRIBUTE, { node: "htmlelem", formatFn: B })
 set(4) -> [Arguments[2]]
 */

define([
    "dojo/_base/declare"
], function (
    declare
) {
    return declare("_LinkFunctionFactory", [], {

        SETTER_REPEATER: 1,
        SETTER_ATTRIBUTE: 3,
        SETTER_TEXTNODE: 4,

        EMPTY_FORMAT_FN: function (value) { return value; },

        _setters: {},

        constructor: function () {
            this._addSetter(this.SETTER_ATTRIBUTE, this.setNodeAttribute);
            this._addSetter(this.SETTER_TEXTNODE, this.setNodeValue);
        },

        generate: function (context, type, configObj) {
            var setter = this._setters[type];

            return function (value) {
                setter.call(context, arguments)
            }.bind(context, configObj);
        },

        _addSetter: function (type, fn) {
            this._setters[type] = fn;
        },

        setNodeAttribute: function(args) {
            /*
            {
                node,
                attrName,
                value,
                formatFn,
                substitution.name(?)
            }
            */
            var value = args[1], data = args[0];
        },

        setNodeValue: function (args) {
            var value = args[1], data = args[0],
                formatFn = data.formatFn || this.EMPTY_FORMAT_FN;

            data.node.nodeValue = formatFn.call(this, value);
        }
    });
});