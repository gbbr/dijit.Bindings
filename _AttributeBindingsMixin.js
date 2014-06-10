define([
    "dojo/_base/declare",
    "dijit/Destroyable",
    "indium/_LinkFunctionFactory"
], function (
    declare,
    Destroyable,
    _LinkFunctionFactory
) {
    return declare("indium/_AttributeBindingsMixin", [_LinkFunctionFactory, Destroyable], {

        NODE_TYPE_ELEMENT: 1,

        _markedAttrNodes: [],

        constructor: function () {
            this.own(this._markAttrSubstitutions);
        },

        /**
         * Identifies and stores all substitutions present in element attributes
         * @param node {HTMLElement} Node to verify
         * @private
         */
        _markAttrSubstitutions: function (node) {
            if (node.nodeType == this.NODE_TYPE_ELEMENT) {
                var i = node.attributes.length;
                while (i--) {
                    if (this._bindingCount(node.attributes[i].value)) {
                        this._markedAttrNodes.push({
                            node: node,
                            attributeName: node.attributes[i].name,
                            attributeTemplate: node.attributes[i].value
                        });
                    }
                }
            }
        },

        /**
         * @description Creates linking functions
         * @private
         */
        _createAttrBindings: function () {
            this._markedAttrNodes.forEach(function (data) {
                console.log(data);
            });
        }
    });
});