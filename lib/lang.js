define([
	"dojo/_base/lang"
], function (
	lang
) {
	/**
	 * @description A collection of language functions that can be mixed into other modules
	 * @module
	 */

	/**
	 * @description Renders a template using dojo's native lang.replace.
	 * Handles undefined mismatches between the template and data by returning
	 * the empty string.
	 * @param {String} template The template string
	 * @param {object} data A hash of data used to generate the template
	 * @param {Object} [domNode] An optional DOMNode, if this is passed then the template result
	 * @param {boolean} [htmlEncoded=false] When set to true all items merged into the template will be run through the
	 * `htmlEncode` function to remove potential XSS vulnerabilities
	 * is set in the DOMNodes inner HTML
	 */
	var keys,
		reduce,
		htmlEncode;

	function renderTemplate(template, data, domNode, htmlEncoded) {
		var iterator = function (_, k) {
				var propertyKey = k.charAt(0) === "!" ? k.substr(1) : k,
					useEncoding = htmlEncoded && propertyKey === k,
					result = lang.getObject(propertyKey, false, data);

				if (result === undefined || result === null) {
					return "";
				} else {
					return useEncoding ? htmlEncode(result) : result;
				}
			},
			result = lang.replace(template, iterator);

		if (domNode) {
			domNode.innerHTML = result;
		}

		return result;
	}

	/**
	 * @description Populates data in the supplied template where properties are specified in double braces. All content
	 * merged into the template will be run through the HTML entity encoder to prevent XSS. Equivalent to calling
	 * renderTemplate with true as the final argument.
	 *
	 * @param {string} template The template string
	 * @param {object} data A hash of data used to generate the template
	 * @param {HTMLElement} [domNode] An optional element which when supplied will have innerHTML set to the result
	 * @return {string} The completed template
	 */
	function safeTemplate(template, data, domNode) {
		return renderTemplate(template, data, domNode, true);
	}

	/**
	 * @description Iterates through an object, calling the supplied callback function each time
	 * The callback is passed the current property and key, for each iteration
	 * @param {Object} obj Object to iterate over
	 * @param {Function} func Callback function to be executed on each iteration
	 * @param {Object=} scope The scope to execute the callback within
	 **/
	function forEach(obj, func, scope) {
		var key;

		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				func.call(scope, obj[key], key);
			}
		}
	}

	/**
	 * @description Iterates through an object, calling the supplied callback function each time with the same arguments
	 * as forEach, the return value for each call is added to an array and returned from this function.
	 * @param {Object} obj Object to iterate over
	 * @param {Function} func Callback function to be executed on each iteration
	 * @param {Object=} scope The scope to execute the callback within
	 * @return {Array}
	 **/
	function map(obj, func, scope) {
		var key, result = [];

		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				result.push(func.call(scope, obj[key], key));
			}
		}

		return result;
	}

	/**
	 * @description Iterates through an object, calling the supplied callback function on each item in the object until
	 * the function returns a truthy value. If the function doesn't return true on any property the return value of this
	 * will be false.
	 *
	 * @param {object} obj
	 * @param {function} func
	 * @param {object} [scope]
	 * @return boolean
	 */
	function some(obj, func, scope) {
		for (var entity in obj) {
			if (obj.hasOwnProperty(entity) && !!func.call(scope, obj[entity], entity)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * @description Wraps the supplied function to create a memoised function - the result of calling this function
	 * is cached to allow for returning results quicker by not processing arguments when the result could already be
	 * known. This is only appropriate for functions that are both deterministic and return immutable values.
	 *
	 * @param {function} fn The function to use as the evaluator in the memo function
	 * @param {function} [hashFn] The function to use to hash the arguments sent to the memo
	 * @param {number} [maxCacheSize=500] maximum number of items that will be stored in the cache
	 */
	function memo(fn, hashFn, maxCacheSize) {
		var cache = {},
			cacheSize = 0,
			maxSize = Math.max(maxCacheSize === undefined || isNaN(maxCacheSize) ? 500 : +maxCacheSize, 0);

		if (typeof hashFn !== "function") {
			// default hash is to join all arguments together, uses Array.prototype.join for brevity and performance.
			hashFn = function () {
				return [].join.call(arguments, ":");
			};
		}

		return function () {
			var result, key,
				hash = hashFn.apply(this, arguments);

			// early return for already evaluated results
			if (cache.hasOwnProperty(hash)) {
				return cache[hash];
			}

			// clear space in the cache if necessary
			while (maxCacheSize && cacheSize >= maxSize) {
				for (key in cache) {
					if (cache.hasOwnProperty(key)) {
						cacheSize -= 1;
						delete cache[key];
						break;
					}
				}
			}

			// evaluate the result and add to cache
			result = fn.apply(this, arguments);
			cache[hash] = result;
			cacheSize += 1;

			return result;
		};
	}

	/**
	 * @description Converts special HTML characters in the input string to their HTML entities and returns the resulting
	 * string.
	 * Nb: This is equivalent to `_escapeValue` in the dijit _TemplateMixin that hasn't been released yet, once released
	 * this could point to that function. @see https://github.com/dojo/dijit/blob/master/_TemplatedMixin.js#L66
	 *
	 * @param {string} input
	 * @returns {string}
	 */
	htmlEncode = memo(function (input) {
		var replacements = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			"\"": "&quot;",
			"'": "&#x27;"
		},
		replaceRegexp = /["'<>&]/g,
		replaceHandler = function (replacement) {
			return replacements[replacement];
		};

		return String(input).replace(replaceRegexp, replaceHandler);
	}, function (token) {
		return token;
	});

	/**
	 * @param {Function} func
	 * @param {Number} wait
	 * @param {Boolean=} immediate
	 **/
	function debounce(func, wait, immediate) {
		var timeout, result;
		return function () {
			var context = this,
				args = arguments,
				later,
				callNow;

			later = function () {
				timeout = null;
				if (!immediate) {
					result = func.apply(context, args);
				}
			};

			callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) {
				result = func.apply(context, args);
			}
			return result;
		};
	}

	/**
	 * @description builds up a single result from an array of values,
	 * aka `foldl`. Delegates to ECMAScript 5's native `reduce` if available.
	 * @param {Array} collection the array/collection/node-list.
	 * @param {Function} callback the iterator function.
	 * @param {*=} initialValue (optional) the initial value.
	 */
	reduce = (function () {
		// FF will have it natively on the host object
		if ("reduce" in Array) {
			return Array.reduce;
		}

		return function (collection, callback, initialValue) {
			var args = [callback];
			if (arguments.length > 2) {
				args.push(initialValue);
			}
			return Array.prototype.reduce.apply(collection, args);
		};
	}());

	/**
	 * @param {Array} sourceArray
	 * @return {Array}
	 * @description Produces a duplicate-free version of a given array using strict equality for comparisons.
	 */
	function unique(sourceArray) {
		return sourceArray.reduce(function (unique, value) {
			if (unique.indexOf(value) === -1) {
				unique.push(value);
			}
			return unique;
		}, []);
	}

	/**
	 * @description ES5 spec utility for Object.keys
	 * https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
	 * @param {Object} obj Object
	 * @return {Array} own non-enumerable keys of obj
	 */
	keys = Object.keys || (function () {
		var hasOwnProperty = Object.prototype.hasOwnProperty,
			hasDontEnumBug = !({"toString": null}).propertyIsEnumerable("toString"),
			dontEnums = [
				"toString",
				"toLocaleString",
				"valueOf",
				"hasOwnProperty",
				"isPrototypeOf",
				"propertyIsEnumerable",
				"constructor"
			],
			dontEnumsLength = dontEnums.length;

		return function (obj) {
			if (typeof obj !== "object" && (typeof obj !== "function" || obj === null)) {
				throw new TypeError("Object.keys called on non-object");
			}

			var result = [],
				prop, i;

			for (prop in obj) {
				if (hasOwnProperty.call(obj, prop)) {
					result.push(prop);
				}
			}

			if (hasDontEnumBug) {
				for (i = 0; i < dontEnumsLength; i++) {
					if (hasOwnProperty.call(obj, dontEnums[i])) {
						result.push(dontEnums[i]);
					}
				}
			}
			return result;
		};
	})();

	/**
	 * @description recursively returns all plain objects that have no other array members in a flat array
	 * @param {Array} array of objects (eg, sources) with objects
	 * @returns {Array}
	 */
	function flattenArray(array) {
		var flattenedArray = [],
			len = array.length,
			i = 0,
			item,
			key,
			hasChildArray,
			push = Array.prototype.push;

		for (; item = array[i], i < len; i += 1) {
			if (lang.isObject(item)) {
				hasChildArray = false;
				for (key in item) {
					if (item.hasOwnProperty(key) && lang.isArray(item[key])) {
						hasChildArray = true;
						push.apply(flattenedArray, this.flattenArray(item[key]));
					}
				}
				// no child arrays? push object itself.
				if (!hasChildArray) {
					flattenedArray.push(item);
				}
			}
		}
		return flattenedArray;
	}

	return {
		"renderTemplate": renderTemplate,
		"safeTemplate": safeTemplate,
		"htmlEncode": htmlEncode,
		"forEach": forEach,
		"debounce": debounce,
		"map": map,
		"some": some,
		"memo": memo,
		"reduce": reduce,
		"unique": unique,
		"keys": keys,
		"flattenArray": flattenArray
	};
});
