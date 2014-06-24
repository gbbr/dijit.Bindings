define([
	"dojo/_base/declare",
	"dojo/dom-construct",
	"dojo/_base/lang",
	"dijit/Destroyable",
	"indium/lib/lang"
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

		constructor: function () {
			this.registrationService.addCollector(this._repeaterGatherer);
			this.registrationService.addBuilder(this._repeaterStoreBuilder);
		},

		_repeaterGatherer: function (node) {
			if (node.nodeType === 1 &&
				(node.hasAttribute("data-indium-repeat") || node.hasAttribute("indium-repeat"))) {
				this.registrationService.getCollectorStore(this.COLLECTOR_REPEATER).push({
					node: node,
					attributeName: node.hasAttribute("data-indium-repeat") ? "data-indium-repeat" : "indium-repeat"
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

				collection = evaluatedExpression[2];
				evaluatedValue = evaluatedExpression[1].match(this.REPEATER_KEY_VALUE);
				value = evaluatedValue[3] || evaluatedValue[1];
				key = evaluatedValue[2];

				startNode = document.createComment("indium-repeater-start:" + expression);
				item.node.parentNode.insertBefore(startNode, item.node);

				endNode = document.createComment("indium-repeater-end:" + expression);
				this._insertAfterNode(endNode, item.node);

				item.node.removeAttribute(item.attributeName);

				this.createSetter(collection, this._repeaterSetter, {
					startNode: startNode,
					endNode: endNode,
					nodeTemplate: this._nodeToHtml(item.node.cloneNode(true)),
					collection: collection,
					key: key,
					value: value
				});

				item.node.parentNode.removeChild(item.node);
			}, this);
		},

		_repeaterSetter: function (config) {
			var collection = lang.getObject(config.collection, false, this);

			if (!lang.isObject(collection)) {
				throw new Error(config.collection + " is not an object");
			}

			indiumLang.forEach(collection, function (value, key) {
				var itemHtml = config.nodeTemplate,
					interpolationScope = {}, interpolatedNode;

				interpolationScope[config.key] = key;
				interpolationScope[config.value] = value;
				// index, first, last

				interpolatedNode = this.interpolateString(itemHtml)(lang.delegate(this, interpolationScope));
				config.endNode.parentNode.insertBefore(domConstruct.toDom(interpolatedNode), config.endNode);
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
