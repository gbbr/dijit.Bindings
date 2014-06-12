define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/store/Memory",
	"dijit/Destroyable",
	"indium/services/RegistrationService",
	"indium/services/Parser",
], function (
	declare,
	lang,
	Memory,
	Destroyable,
	RegistrationService,
	Parser
) {
	return declare("Compiler", [Parser, Destroyable], {
		/**
		 * @description Stores substitution data and linking functions
		 * @type {dojo/store/Memory}
		 */
		$bindingStore: null,

		/**
		 * @description Provides a subscription service for plugins
		 */
		registrationService: null,

		constructor: function () {
			this.$bindingStore = new Memory();
			this.registrationService = new RegistrationService();

			this.own(
				this.$bindingStore,
				this.registrationService
			);
		},

		/**
		 * @description Traverses DOM and gathers binding information, compiles and manipulates
		 * DOM as necessary and returns a linking function that takes the scope to be bound against
		 * the given DOM tree.
		 * @param rootNode {HTMLElement} The root node of the tree to be compiled
		 * @return {Function} Returns the linking function for ease of access
		 */
		compile: function (rootNode) {
			this._applyCollectors(rootNode);
			this._applyCompilers();

			return this._link;
		},

		/**
		 * @descriptions Traverses the DOM and applies gatherer functions to each
		 * valid node
		 * @param actions {Array<Function>} Array of functions, gets node as parameter
		 * @param rootNode {HTMLElement} The root node for the traversal
		 */
		_applyCollectors: function (rootNode) {
			var node;

			if (!document.createTreeWalker) {
				node = rootNode.childNodes[0];
				while (node !== null) {
					this._invokeActions(this.registrationService.getCollectors(), this, node);

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
					this._invokeActions(this.registrationService.getCollectors(), this, node);
				}
			}
		},

		/**
		 * @description Applies all the compiler actions and clears the store for
		 * potential future compilations
		 */
		_applyCompilers: function () {
			this._invokeActions(this.registrationService.getCompilers());
			this.registrationService.clearCollected();
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
		 * @description Calls all functions in an array
		 * @param fnList {Array<Function>} Array of functions to be called
		 * @param context {=Object} Context to call the function in
		 * @param argument {=*} A single argument to pass to the function
		 */
		_invokeActions: function(fnList, context, argument) {
			fnList.forEach(function (fn) {
				fn.call(context || this, argument);
			}, this);
		}
	});
});