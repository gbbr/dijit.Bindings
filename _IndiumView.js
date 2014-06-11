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

		_gatherers: [],
		_gathererData: {},
		_compilers: [],

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
		 * links DOM nodes to model and/or instance properties
		 */
		buildRendering: function () {
			this.inherited(arguments);
			this.domNode = domConstruct.toDom(this.template || this.templateString);

			if (this.domNode.nodeType != 1) {
				throw new Error("Invalid template, must have only one element wrapper as the top node!");
			}

			this.compile(this.domNode)(this);
		},

		/**
		 * @description Traverses DOM and gathers binding information, compiles and manipulates
		 * DOM as necessary and returns a linking function that takes the scope to be bound against
		 * for this tree.
		 * @param rootNode {HTMLElement} The root of the node tree to be compiled
		 * @return {Function} Returns the linking function for ease of access
		 */
		compile: function (rootNode) {
			this._traverseDom(rootNode);
			this._callFunctions(this._compilers);
			this._clearGathererStore();

			//this.compileProperties();

			return this._link;
		},

		/**
		 * @description Links all substitutions (via the linking functions) to their
		 * corresponding model or instance properties
		 * @param scope {Object} The context which holds the values to be linked
		 */
		_link: function (scope) {
			scope = scope || this;
			// observe models or properties
		},

		/**
		 * @descriptions Traverses the template's DOM and applies gatherer functions
		 * to each valid node
		 * @param actions {Array<Function>} Array of functions, gets node as parameter
		 * @param rootNode {HTMLElement} The root node for the traversal
		 */
		_traverseDom: function (rootNode) {
			var node;

			if (!document.createTreeWalker) {
				node = rootNode.childNodes[0];
				while (node != null) {
					this._callFunctions(this._gatherers, this, node);

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
					this._callFunctions(this._gatherers, this, node);
				}
			}
		},

		_addGatherer: function (name, fn) {
			this._getGathererStore(name);
			this._gatherers.push(fn);
		},

		_getGathererStore: function (name) {
			if (!this._gathererData.hasOwnProperty(name)) {
				this._gathererData[name] = [];
			}

			return this._gathererData[name];
		},

		_clearGathererStore: function () {
			this._gathererData = {};
		},

		_addCompiler: function (fn) {
			this._compilers.push(fn);
		}
	});
});
