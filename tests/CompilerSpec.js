define([
	"doh/runner",
	"dojo/_base/lang",
	"dojo/dom-construct",
	"indium/services/Compiler",
	"indium/lib/_StatefulModel",
	'dojo/text!indium/tests/templates/template1.html',
	"testSuite"
], function (
	doh,
	lang,
	domConstruct,
	Compiler,
	StatefulModel,
	template,
	testSuite
) {
	testSuite("Compiler service", {
		beforeEach: function () {
			this.instance = new Compiler();
			this.templateDom = domConstruct.toDom(template);
		},

		afterEach: function () {
			this.instance.destroy();
			delete this.templateDom;
		},

		"Should traverse the same amount of nodes with TreeWalker as without": function () {
			// This test is valid for IE9+
			var oldWalker = document.createTreeWalker, callCount1, callCount2;

			this.spy(this.instance, "_invokeActions");

			this.instance.compile(this.templateDom);
			callCount1 = this.instance._invokeActions.callCount;

			this.instance._invokeActions.reset();
			document.createTreeWalker = null;
			this.instance.compile(this.templateDom);
			callCount2 = this.instance._invokeActions.callCount;

			testSuite.equals(callCount1, callCount2, "Less nodes found via polyfill");

			document.createTreeWalker = oldWalker;
		},

		"Correctly invokes a list of functions": function () {
			var spyList = [this.spy(), this.spy(), this.spy()];

			this.instance._invokeActions(spyList, 5);

			spyList.forEach(function (spy) {
				testSuite.isTrue(spy.calledOnce, "Function was not called once");
				testSuite.isTrue(spy.calledWith(5), "Argument was not passed");
			});
		},

		"Correctly clears collector store after building phase": function () {
			this.spy(this.instance.registrationService, "clearCollected");

			this.instance.compile(this.templateDom);

			testSuite.isTrue(this.instance.registrationService.clearCollected.calledOnce,
				"Compiling phase did not clear collector store");
		},

		"Invokes all registered collectors": function () {
			var spies = [this.spy(), this.spy(), this.spy()];

			this.instance.registrationService.addCollector(spies[0]);
			this.instance.registrationService.addCollector(spies[1]);
			this.instance.registrationService.addCollector(spies[2]);

			this.instance.compile(this.templateDom);

			testSuite.isTrue(spies[0].called, "Collector #1 was not reached");
			testSuite.isTrue(spies[1].called, "Collector #2 was not reached");
			testSuite.isTrue(spies[2].called, "Collector #3 was not reached");

			testSuite.equals(spies[0].callCount, spies[1].callCount, "Call counts not equal");
			testSuite.equals(spies[1].callCount, spies[2].callCount, "Call counts not equal");
		},

		"Invokes all registered builders once": function () {
			var spies = [this.spy(), this.spy(), this.spy()];

			this.instance.registrationService.addBuilder(spies[0]);
			this.instance.registrationService.addBuilder(spies[1]);
			this.instance.registrationService.addBuilder(spies[2]);

			this.instance.compile(this.templateDom);

			testSuite.isTrue(spies[0].calledOnce, "Builder #1 was not reached");
			testSuite.isTrue(spies[1].calledOnce, "Builder #2 was not reached");
			testSuite.isTrue(spies[2].calledOnce, "Builder #3 was not reached");
		},

		"Identifies models in binding store": function () {
			var scope = lang.mixin(this.instance, {
					model: new StatefulModel({
						"key": "555"
					})
				});

			this.instance.createSetter("model.key", this.stub());
			this.instance.linkBindingStore.bind(scope)();

			testSuite.equals(this.instance.$bindingStore.get("model.key").type, this.instance.objectType.MODEL);
		},

		"Observes models in binding store for changes": function () {
			var scope = lang.mixin(this.instance, {
					model: new StatefulModel({
						"key": "555"
					})
				}),
				setterFn = this.stub();

			this.spy(scope.model, "observe");

			this.instance.createSetter("model.key", setterFn);
			this.instance.linkBindingStore.bind(scope)();

			testSuite.isTrue(scope.model.observe.calledWith("key"));
			testSuite.isTrue(setterFn.calledOnce);
		},

		"Triggers setters when models change": function () {
			var scope = lang.mixin(this.instance, {
					model: new StatefulModel({
						"key": "555"
					})
				}),
				setterFn = this.stub();

			this.instance.createSetter("model.key", setterFn);
			this.instance.linkBindingStore.bind(scope)();

			setterFn.reset(); // It is already called once at linking

			scope.model.set("key", "666");
			testSuite.isTrue(setterFn.calledOnce);

			scope.model.set("key", "777");
			testSuite.isTrue(setterFn.calledTwice);
		},

		"Identifies widget properties in binding store": function () {
			var scope = lang.mixin(this.instance, {
				"client": {
					"id": 2
				}
			});

			this.instance.createSetter("client.id", this.stub());
			this.instance.linkBindingStore.bind(scope)();

			testSuite.equals(this.instance.$bindingStore.get("client.id").type, this.instance.objectType.PROPERTY);
		},

		"renderProperty: invokes all setters when '*' is its parameter": function () {
			var setterFns = [this.stub(), this.stub(), this.stub()],
				scope = lang.mixin(this.instance, {
					"prop": 1,
					"id": 2
				});

			this.instance.createSetter("prop", setterFns[0]);
			this.instance.createSetter("prop", setterFns[1]);
			this.instance.createSetter("id", setterFns[2]);

			this.instance.linkBindingStore.bind(scope)();
			this.instance.renderProperty("*");

			setterFns.forEach(function (fn) {
				testSuite.isTrue(fn.calledTwice); // once at linking, once at rendering
			}, this);
		},

		"renderProperty: invokes appropriate setters when name is given": function () {
			var setterFns = [this.stub(), this.stub(), this.stub()],
				scope = lang.mixin(this.instance, {
					"prop": 1,
					"id": 2
				});

			this.instance.createSetter("prop", setterFns[0]);
			this.instance.createSetter("prop", setterFns[1]);
			this.instance.createSetter("id", setterFns[2]);

			this.instance.linkBindingStore.bind(scope)();
			this.instance.renderProperty("prop");

			testSuite.isTrue(setterFns[0].calledTwice);
			testSuite.isTrue(setterFns[1].calledTwice);
			testSuite.isTrue(setterFns[2].calledOnce);
		}
	});
});
