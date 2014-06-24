define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dijit/Destroyable",
	"indium/services/RegistrationService",
	"indium/services/Parser",
	"indium/services/BindingStore"
], function (
	declare,
	lang,
	Destroyable,
	RegistrationService,
	Parser,
	BindingStore
) {
	/**
	 * @module Compiler
	 * @description Links the widget's DOM node to its model.
	 *
	 * Mixins can register actions with the compiler via the RegistrationService.
	 * These actions will be used on the widget's DOM tree to facilitate bindings
	 * between a view's model and it's associated DOM node.
	 *
	 * Template format is as follows:
	 *
	 * {{model.property|transformFn}}
	 * If a model is detected the value is observed and a live binding is created. Currently
	 * only one level is supported (model.property.third will not work)
	 *
	 * or:
	 *
	 * {{key|transformFn}}
	 * If an instance property is detected a binding is built. Linking is not created
	 * but it can be trigered automatically via renderProperty(<property>) method. Instance
	 * properties can go multiple levels down.
	 *
	 * Transform function is optional. It can be supplied via the widget's instance for
	 * the template to pick up.
	 *
	 */
	return declare("indium/view/bindings/Compiler", [Parser, BindingStore, Destroyable], {
		/**
		 * @description Acts as a gateway between Compiler and Mixins
		 */
		registrationService: null,

		constructor: function () {
			this.registrationService = new RegistrationService();
			this.own(this.registrationService);
		},

		/**
		 * @description Traverses DOM and gathers binding information, builds binding
		 * store and links it to your widget's instance
		 * @param rootNode {HTMLElement} The root node of the tree to be compiled
		 * @return {Function} Returns the linking function for ease of access
		 */
		compile: function (rootNode) {
			this._findBindings(rootNode);
			this._buildBindings();

			return this.linkBindingStore.bind(this);
		},

		/**
		 * @descriptions Traverses the DOM and applies collector functions to each node
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
		 * @description Applies all the builders and clears collector store
		 */
		_buildBindings: function () {
			var builders = this.registrationService.getBuilders();
			this._invokeActions(builders);
			// Clean-up after we are finished
			this.registrationService.clearCollected();
		},

		/**
		 * @description Links all items in binding store to corresponding models
		 * and/or properties and renders them to the view
		 * @param {object} scope The scope to link against
		 */
		linkBindingStore: function (scope) {
			this.$bindingStore.query({ type: this.objectType.MODEL }).forEach(function (binding) {
				var invokeFn = this._invokeActions.bind(this, binding.setters, scope);
				binding.model.observe(binding.key, invokeFn);
				invokeFn();
			}, this);

			this.renderProperty("*");
		},


		/**
		 * @description Renders an instance property to the template. If no argument
		 * is given it renders all properties
		 * @param {=string} name Property ID
		 * @param {=object} scope The scope to get the value from
		 */
		renderProperty: function (name, scope) {
			if (name !== "*") {
				var prop = this.$bindingStore.get(name);
				if (prop && prop.setters) {
					this._invokeActions(prop.setters, scope || this);
				}
			} else {
				this.$bindingStore.query({ type: this.objectType.PROPERTY }).
					forEach(function (binding) {
						this._invokeActions(binding.setters, scope || this);
					}, this);
			}
		},

		/**
		 * @description Calls all functions in an array and passes one argument
		 * @param fnList {Array<Function>} Array of functions to be called
		 * @param argument {=} A single argument of any type to pass to the function
		 */
		_invokeActions: function(fnList, argument) {
			fnList.forEach(function (fn) {
				fn.call(this, argument);
			}, this);
		}
	});
});
