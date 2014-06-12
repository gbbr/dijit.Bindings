require(["sinon"]);

define([
	"doh",
	"lang",
	"dojo/_base/lang",
	"dojo/on",
	"dojo/query",
	"dojo/dom-attr"
], function (
	doh,
	indiumLang,
	lang,
	on,
	query,
	domAttr
) {

	function cleanedName(name) {
		return name.replace(/(\/\/|x)\s?/, "");
	}

	function isDisabled(testName) {
		return testName.indexOf("//") === 0 || testName.charAt(0) === "x";
	}

	function testSuite(group, testSuite) {

		var tests = [],
			callbacks = {
				beforeAny: function () {},
				beforeEach: function () {},
				afterEach: function () {},
				sandbox: function () {
					return {};
				}
			};

		indiumLang.forEach(testSuite, function (fn, key) {
			if (callbacks.hasOwnProperty(key)) {
				callbacks[key] = fn;
			} else if (isDisabled(group) || isDisabled(key)) {
				tests.push({
					name: "IGNORED test: " + cleanedName(key),
					runTest: function () {}
				});
			} else if (typeof fn === "function") {
				tests.push({
					name: key,
					setUp: function () {
						this.sinon = sinon.sandbox.create(lang.mixin({}, callbacks.sandbox()));
						this.sinon.inject(this);
						this.deferred = function () {
							return new doh.Deferred();
						};
						callbacks.beforeEach.call(this);
					},
					runTest: fn,
					tearDown: function () {
						callbacks.afterEach.call(this);
						this.sinon.restore();
					}
				});
			}
		});

		if (!isDisabled(group)) {
			doh.register(group, tests, callbacks.beforeAny);
		}
		else {
			doh.register(cleanedName(group), tests);
		}
	}

	testSuite.isTrue = function (actual, assertion) {
		if (actual !== true) {
			throw new doh._AssertFailure("isTrue('" + actual + "') failed", assertion);
		}
		return true;
	};

	testSuite.isFalse = function (actual, assertion) {
		if (actual !== false) {
			throw new doh._AssertFailure("isFalse('" + actual + "') failed", assertion);
		}
		return true;
	};

	/**
	 * @description Alias of the `assertEquals` function in doh - present to allow for the complete removal of `doh`
	 * from tests using the testSuite without needing to recreate the "is like" functionality already in doh.
	 *
	 * @param expected
	 * @param actual
	 * @param assertion
	 */
	testSuite.equals = function (expected, actual, assertion) {
		doh.assertEqual(expected, actual, assertion);
	};

	/**
	 * @description Alias of the `doh.assertNotEqual` function in doh - present to allow for the complete removal of
	 * `doh` from tests using the testSuite without needing to recreate the "is not like" functionality already in doh.
	 *
	 * @param expected
	 * @param actual
	 * @param assertion
	 */
	testSuite.notEquals = function (expected, actual, assertion) {
		doh.assertNotEqual(expected, actual, assertion);
	};

	/**
	 * @description Helper function to simulate a click on the supplied element
	 * @param {HTMLElement|string} element Can be a CSS selector or HTMLElement
	 * @param {HTMLElement} [context] When element is a CSS selector can be supplied as root context for selection
	 */
	testSuite.clickOn = function (element, context) {
		testSuite.triggers("click", element, context);
	};

	/**
	 * @description Helper function to simulate a mouseover event on the supplied element
	 * @param {HTMLElement|string} element Can be a CSS selector or HTMLElement
	 * @param {HTMLElement} [context] When element is a CSS selector can be supplied as root context for selection
	 */
	testSuite.hoverOn = function (element, context) {
		testSuite.triggers("mouseover", element, context);
	};

	/**
	 *
	 * @param {string} event The name of the event to trigger on the element, eg: click or mouseout
	 * @param {HTMLElement|object|string} element Can be a CSS selector or HTMLElement, arbitrary objects are also
	 *				permitted if they have a function handler in camel case for the event, such as onClick
	 * @param {HTMLElement} [context] When element is a CSS selector can be supplied as root context for selection
	 * @param {Array} [args] Arguments to be provided when event is being triggered
	 */
	testSuite.triggers = function (event, element, context, args) {
		var jsHandlerName = "on" + event.charAt(0).toUpperCase() + event.substr(1);

		if (typeof element === "string") {
			element = query(element, context);
			if (element.length !== 1) {
				throw new TypeError("testSuite found " + element.length + " matching elements, but needs exactly one " +
					"to " + event + " on it: " + arguments[0]);
			}
			testSuite.triggers(event, element[0]);
		} else if (typeof element[jsHandlerName] === "function") {
			element[jsHandlerName].apply(element, args);
		} else if (element.nodeType === 1) {
			on.emit(element, event, {
				bubbles: true,
				cancelable: true
			});
		} else {
			throw new TypeError("testSuite is unable to " + event + " on entity: " + element);
		}
	};

	/**
	 * @description Triggers `keydown` events for the specified keyCode or for each charCode in the specified string
	 * of characters.
	 *
	 * @param {string|number} chars A string series of characters to type or the numeric key code of a key
	 * @param {HTMLElement|string} element Can be a CSS selector or HTMLElement
	 * @param {HTMLElement} [context] When element is a CSS selector can be supplied as root context for selection
	 */
	testSuite.typeIn = function (chars, element, context) {
		if (typeof element === "string") {
			element = query(element, context);
			if (element.length !== 1) {
				throw new TypeError("testSuite found " + element.length + " matching elements, but needs exactly one " +
					"to type on it: " + arguments[0]);
			}
			testSuite.typeIn(chars, element[0]);
		} else if (!chars) {
			throw new TypeError("testSuite requires at least one character to type in an element");
		} else if (element.nodeType !== 1 || !("value" in element)) {
			throw new TypeError("testSuite can only type in an input, select or textarea");
		} else if (typeof chars === "number") {
			["keypress", "keydown", "keyup"].every(function (eventType) {
				return on.emit(element, eventType, {
					bubbles: true,
					cancelable: true,
					keyCode: chars,
					charCode: chars,
					charOrKeyCode: chars
				});
			});
		} else if (typeof chars === "string") {
			chars.split("").forEach(function (chr) {
				testSuite.typeIn(chr.charCodeAt(0), element);
			});
			domAttr.set(element, "value", chars);
		} else {
			throw new TypeError("testSuite needs a numeric code or string of chars to be able to type in an element");
		}
	};

	/**
	 * @description Fails a test with a specified reason, useful for failing on a particular branch of code
	 * @param {string} reason
	 */
	testSuite.fail = function (reason) {
		doh.assertTrue(false, reason);
	};

	return testSuite;

});
