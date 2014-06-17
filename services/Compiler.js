define([
	"dojo/_base/declare",
	"dijit/Destroyable",
	"indium/services/RegistrationService",
	"indium/services/Parser"
], function (
	declare,
	Destroyable,
	RegistrationService,
	Parser
) {
	/**
	 * @module Compiler
	 * @description Links the widget's DOM node to its model.
	 *
	 * Mixins can register actions with the compiler via the RegistrationService.
	 * These actions will be used on the widget's DOM tree to facilitate bindings
	 * between a view's model and it's associated DOM tree.
	 *
	 * Template format is as follows:
	 *
	 * {{model.property|transformFn}}
	 * If a model is detected the value is observed and a live binding is created.
	 *
	 * or:
	 *
	 * {{key|transformFn}}
	 * If an instance property is detected a binding is built. Linking is not created
	 * but it can be trigered automatically via an exposed method.
	 *
	 * Transform function is optional. It can be supplied via the widget's instance for
	 * the template to pick up.
	 *
	 */
	return declare("Compiler", [Parser, Destroyable], {
		/**
		 * @description Acts as a gateway between Compiler and Mixins, it also
		 * provides the binding store.
		 */
		registrationService: null,

		constructor: function () {
			this.registrationService = new RegistrationService();
			this.own(this.registrationService);
		},

		/**
		 * @description Traverses DOM and gathers binding information, compiles and manipulates
		 * DOM as necessary and returns a linking function that takes the scope to be bound
		 * against.
		 * @param rootNode {HTMLElement} The root node of the tree to be compiled
		 * @return {Function} Returns the linking function for ease of access
		 */
		compile: function (rootNode) {
			this._findBindings(rootNode);
			this._buildBindings();

			return this._linkBindings.bind(this);
		},

		/**
		 * @descriptions Traverses the DOM and applies collector functions to each
		 * valid node
		 * @param actions {Array<Function>} Array of functions, gets node as parameter
		 * @param rootNode {HTMLElement} The root node for the traversal
		 */
		_findBindings: function (rootNode) {
			var node, collectors = this.registrationService.getCollectors();

			if (!document.createTreeWalker) {
				node = rootNode.childNodes[0];
				while (node !== null) {
					this._invokeActions(collectors, node);

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
					this._invokeActions(collectors, node);
				}
			}
		},

		/**
		 * @description Applies all the compiler actions and builds bindings
		 */
		_buildBindings: function () {
			var builders = this.registrationService.getBuilders();
			this._invokeActions(builders);
			this.registrationService.clearCollected();
		},

		/**
		 * @description Links all substitutions (via the linking functions) to their
		 * corresponding model or instance properties
		 * @param scope {Object} The context which holds the values to be linked
		 */
		_linkBindings: function (scope) {
			var invokeFn, setters;
			scope = scope || this;

			this.$bindingStore.query({ type: this.bindingType.MODEL }).
				forEach(function (binding) {
					invokeFn = this._invokeActions.bind(this, binding.setters, scope);
					binding.model.observe(binding.property, invokeFn);
					invokeFn();
				}, this);

			this.renderProperty();
		},

		/**
		 * @description Calls all functions in an array
		 * @param fnList {Array<Function>} Array of functions to be called
		 * @param argument {=} A single argument of any type to pass to the function
		 * @param context {=Object} Context to call the function in
		 */
		_invokeActions: function(fnList, argument, context) {
			fnList.forEach(function (fn) {
				fn.call(context || this, argument);
			}, this);
		},

		/**
		 * @description Renders an instance property to the template
		 * @param name {=string} Property name (as per $bindingStore)
		 */
		renderProperty: function (name) {
			if (name) {
				var prop = this.$bindingStore.get(name);
				if (prop && prop.setters) {
					this._invokeActions(prop.setters, this);
				}
			} else {
				this.$bindingStore.query({ type: this.bindingType.PROPERTY }).
					forEach(function (binding) {
						this._invokeActions(binding.setters, this);
					}, this);
			}
		}
	});
});
