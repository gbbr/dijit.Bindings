/**
 * No-no's:
 *
 * * No nested repeaters on Dijit level (repeaters inside repeated widgets are ok)
 *
 * * "Scope" bindings inside repeaters are not linked
 *
 * * Widget repeaters do not create setters (Dojo does way too many DOM changes
 *   at parsing to be able to keep track correctly)
 *
 */

define([
	"dojo/_base/declare",
	"dojo/dom-construct",
	"dojo/_base/lang",
	"dijit/Destroyable",
	"indium/base/lang"
], function (
	declare,
	domConstruct,
	lang,
	Destroyable,
	indiumLang
	) {
	return declare("indium/view/bindings/mixin/RepeaterMixin", [Destroyable], {

		COLLECTOR_REPEATER: "COLLECTOR_REPEATER",
		REPEATER_EXPRESSION: /^\s*([\s\S]+?)\s+in\s+([\s\S]+?)\s*$/,
		REPEATER_KEY_VALUE: /^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/,
		REPEATER_ATTR: "indium-repeat",

		constructor: function () {
			this.registrationService.addCollector(this._repeaterGatherer);
			this.registrationService.addBuilder(this._repeaterStoreBuilder);
		},

		_repeaterGatherer: function (node) {
			if (node.nodeType === 1 &&
				(node.hasAttribute("data-" + this.REPEATER_ATTR) || node.hasAttribute(this.REPEATER_ATTR))) {
				this.registrationService.getCollectorStore(this.COLLECTOR_REPEATER).push({
					node: node,
					attributeName: node.hasAttribute("data-" + this.REPEATER_ATTR) ? "data-" + this.REPEATER_ATTR : this.REPEATER_ATTR
				});
			}
		},

		_repeaterStoreBuilder: function () {
			var store = this.registrationService.getCollectorStore(this.COLLECTOR_REPEATER);

			store.forEach(function (item) {
				var expression = item.node.getAttribute(item.attributeName),
					evaluatedExpression = expression.match(this.REPEATER_EXPRESSION),
					collection, value, key, evaluatedValue, startNode, endNode;

				if (!evaluatedExpression) {
					throw new Error("Invalid repeater expression: " + expression);
				}

				// Evaluate repeater expression
				collection = evaluatedExpression[2];
				evaluatedValue = evaluatedExpression[1].match(this.REPEATER_KEY_VALUE);
				value = evaluatedValue[3] || evaluatedValue[1];
				key = evaluatedValue[2];

				// Add start node comment
				startNode = document.createComment("indium-repeater-start:" + expression);
				item.node.parentNode.insertBefore(startNode, item.node);

				// Add end node comment
				endNode = document.createComment("indium-repeater-end:" + expression);
				this._insertAfterNode(endNode, item.node);

				// Clean repeated node of repeater attribute
				item.node.removeAttribute(item.attributeName);

				// Note: Run setter but do not add to binding store for dijits
				// as they can not be recompiled due to freak-a-zoid DOM changes
				this.createSetter(collection, this._repeaterSetter, {
					startNode: startNode,
					endNode: endNode,
					nodeTemplate: this._nodeToHtml(item.node.cloneNode(true)),
					collection: collection,
					key: key,
					value: value,
					nodeStore: []
				});

				item.node.parentNode.removeChild(item.node);
			}, this);
		},

		_repeaterSetter: function (config) {
			var collection = this._getObjectByName(config.collection, this);

			if (!lang.isObject(collection)) {
				throw new Error(config.collection + " is not an object");
			}

			config.nodeStore.forEach(function (node) {
				node.parentNode.removeChild(node);
			});
			config.nodeStore = [];

			indiumLang.forEach(collection, function (value, key) {
				var itemHtml = config.nodeTemplate,
					interpolationScope = {}, interpolatedNode,
					iterationNode;

				interpolationScope[config.key] = key;
				interpolationScope[config.value] = value;
				// index, first, last

				interpolatedNode = this.interpolateString(itemHtml)(lang.delegate(this, interpolationScope));
				iterationNode = domConstruct.toDom(interpolatedNode);
				config.nodeStore.push(iterationNode);

				config.endNode.parentNode.insertBefore(iterationNode, config.endNode);
			}, this);
		},

		_insertAfterNode: function (newNode, refNode) {
			refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
		},

		_nodeToHtml: function (node) {
			var wrapper = document.createElement("span");
			wrapper.appendChild(node);
			return wrapper.innerHTML;
		}
	});
});
