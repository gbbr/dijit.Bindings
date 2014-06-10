define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/query",
	"dojo/dom-construct",
    "dijit/Destroyable",
    "indium/_TextBindingsMixin",
    "indium/_AttributeBindingsMixin",
    "indium/_IndiumViewHelpers"
], function (
	declare,
	lang,
	query,
	domConstruct,
    Destroyable,
    _TextBindingsMixin,
    _AttributeBindingsMixin,
    _IndiumViewHelpers
) {
	return declare("indium/_IndiumView", [_TextBindingsMixin, _AttributeBindingsMixin,
        _IndiumViewHelpers, Destroyable], {

        /**
         * @description Stores substitution data and linking functions
         * @type {Dojo.Memory}
         */
		$bindingStore: null,

        /**
         * @description Constants for substitution matching on template
         */
		SUBSTITUTIONS_ALL: /\{\{([^\s\|\}]+)\|?([^\s\|\}]+)?\}\}/g,
		SUBSTITUTIONS_FIRST:  /\{\{([^\s\|\}]+)\|?([^\s\|\}]+)?\}\}/,

        /**
         * @description Constructs _IndiumView, initiates and destroys $bindingStore
         */
		constructor: function () {
			// create store
            // this.own(this.$bindingStore);
		},

        /**
         * @description Dijit life-cycle method, builds, traverses, compiles and
         * links DOM node to model and/or instance properties
         */
		buildRendering: function () {
			this.inherited(arguments);
			this.domNode = domConstruct.toDom(this.template);

            if (this.domNode.nodeType != 1) {
                throw new Error("Invalid template, must have only one element wrapper as the top node!");
            }

            this._traverse([
                this._markTextSubstitutions,
                this._markAttrSubstitutions
            ], this.domNode);

			this._compile();
            this._link();
		},

        /**
         * @description Any post-traverse DOM processing is handled during compilation
         */
		_compile: function () {
            this._createTextNodeBindings();
            this._createAttrBindings();
		},

        /**
         * @description Links all substitutions to their corresponding model or
         * instance properties
         */
        _link: function () {
            // observe models or properties
        },

        /**
         * @descriptions Traverses the template's DOM and performs a list of
         * actions on each valid node
         * @param actions {Array<Function>} Array of functions, gets node as parameter
         * @param rootNode {HTMLElement} The root node for the traversal
         */
		_traverse: function (actions, rootNode) {
            var node;

			if (!document.createTreeWalker) {
				node = rootNode.childNodes[0];
				while (node != null) {
                    this._callFunctions(actions, this, node);

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
				var walk = document.createTreeWalker(rootNode, NodeFilter.SHOW_ALL, null, false);

				while (node = walk.nextNode()) {
                    this._callFunctions(actions, this, node);
				}
			}
		}
	});
});