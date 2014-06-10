define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/query",
	"dojo/dom-construct",
    "dijit/Destroyable",
    "indium/_LinkFunctionFactory",
    "indium/_TextBindingsMixin",
    "indium/_AttributeBindingsMixin",
    "indium/_IndiumViewHelpers"
], function (
	declare,
	lang,
	query,
	domConstruct,
    Destroyable,
    _LinkFunctionFactory,
    _TextBindingsMixin,
    _AttributeBindingsMixin,
    _IndiumViewHelpers
) {
	return declare("_IndiumView", [_LinkFunctionFactory, _TextBindingsMixin,
        _AttributeBindingsMixin, Destroyable, _IndiumViewHelpers], {

		$bindingStore: null,

		SUBSTITUTIONS_ALL: /\{\{([^\s\|\}]+)\|?([^\s\|\}]+)?\}\}/g,
		SUBSTITUTIONS_FIRST:  /\{\{([^\s\|\}]+)\|?([^\s\|\}]+)?\}\}/,

		constructor: function () {
			// create store

            //this.own(this.$bindingStore);
		},

		buildRendering: function () {
			this.inherited(arguments);
			this.domNode = domConstruct.toDom(this.template);

            if (this.domNode.nodeType != 1) {
                throw new Error("Invalid template!");
            }

            this._traverse([
                this._markTextSubstitutions,
                this._markAttrSubstitutions
            ], this.domNode);

			this._compile();
            this._link();
		},

		_compile: function () {
            this._createTextNodeBindings();
            this._createAttrBindings();
		},

        _link: function () {
            // observe models or properties
        },

		_traverse: function (actionFns, rootNode) {
            var node;

			if (!document.createTreeWalker) {
                // Use traverse for IE8
				node = rootNode.childNodes[0];
				while (node != null) {
                    this._callFunctions(actionFns, this, node);

					if (node.hasChildNodes()) {
						node = node.firstChild;
					} else {
						while (node.nextSibling == null && node != rootNode) {
							node = node.parentNode;
						}
						node = node.nextSibling;
					}
				}
			} else {
                // Use TreeWalker
				var walk = document.createTreeWalker(rootNode, NodeFilter.SHOW_ALL, null, false);
				while (node = walk.nextNode()) {
                    this._callFunctions(actionFns, this, node);
				}
			}
		}
	});
});