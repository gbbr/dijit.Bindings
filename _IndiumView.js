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
		_compilers: [],
		_gathererData: {},

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
			this._applyGatherers(rootNode);
			this._applyCompilers();

			return this._link;
		},

		_applyCompilers: function () {
			this._callFunctions(this._compilers);
			this._clearGathererStore();
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
		_applyGatherers: function (rootNode) {
			var node;

			if (!document.createTreeWalker) {
				node = rootNode.childNodes[0];
				while (node !== null) {
					this._callFunctions(this._gatherers, this, node);

					if (node.hasChildNodes()) {
						node = node.firstChild;
					} else {
						while (node.nextSibling === null && node !== rootNode) {
							node = node.parentNode;
						}
						node = node.nextSibling;
					}
				}
			} else {
				var walk = document.createTreeWalker(rootNode, NodeFilter.SHOW_ALL, null, false);

				while ((node = walk.nextNode())) {
					this._callFunctions(this._gatherers, this, node);
				}
			}
		},

		/**
		 * @description Adds a gatherer function to be applied to nodes at traversal
		 * @param name {string} Name of the store to intialize for this gatherer
		 * @param fn {Function} The gatherer function
		 */
		_registerGatherer: function (name, fn) {
			this._gathererStore(name);
			this._gatherers.push(fn);
		},

		/**
		 * @description Adds a compiler to be run after the gathering phase
		 * @param fn {Function} The compiler function to run
		 */
		_registerCompiler: function (fn) {
			this._compilers.push(fn);
		},

		/**
		 * @description Returns an existing store or creates a new one
		 * @param name {string} The name of the store to be returned
		 * @returns {Array<*>} Returns an array for storing gatherer data
		 */
		_gathererStore: function (name) {
			if (!this._gathererData.hasOwnProperty(name)) {
				this._gathererData[name] = [];
			}

			return this._gathererData[name];
		},

		/**
		 * @description Clears all gatherer data
		 */
		_clearGathererStore: function () {
			this._gathererData = {};
		}
	});
});
