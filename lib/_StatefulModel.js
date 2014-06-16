define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/Stateful",
	"indium/lib/_BaseModel",
	"indium/lib/lang"
], function (
	declare,
	lang,
	Stateful,
	_BaseModel,
	indiumLang
) {
	/**
	 * @module
	 * @extends {indium.model._BaseModel}
	 */
	return declare("indium.model._StatefulModel", [_BaseModel], {

		/**
		 * @description Default model values
		 * @type {Object}
		 */
		defaults: null,

		/**
		 * @type {Array}
		 * @description A collection of keys that have been set() on the store. This is used to
		 * retrieve all values from the store.
		 */
		_keys: null,

		/**
		 * @param {Object=} data An optional hash of key value pairs to set on this model
		 * @module
		 */
		constructor: function (data) {
			this._store = new Stateful();
			this._keys = [];

			if (this.defaults) {
				this.set(lang.clone(this.defaults));
			}

			if (data) {
				this.set(data);
			}
		},

		/**
		 * @override
		 */
		get: function (key) {
			if (key) {
				return this._store.get(key);
			} else {
				return this._getAll();
			}
		},

		/**
		 * @override
		 * @param {(string|Object)} keyOrData Either a key or a hash of data.
		 * @param {Object=} value An optional value. If this is not passed then it should be assumed
		 * that keyOrData contains a hash of data to set on the model. Otherwise a key / value pair
		 * should be assumed.
		 */
		set: function (keyOrData, value) {
			if (value || lang.isString(keyOrData)) {
				// If key is not already in _keys
				if (this._keys.indexOf(keyOrData) === -1) {
					this._keys.push(keyOrData);
				}
				this._store.set(keyOrData, value);
			} else {
				// We are setting everything
				indiumLang.forEach(keyOrData, function (value, key) {
					// If key is not already in _keys
					if (this._keys.indexOf(key) === -1) {
						this._keys.push(key);
					}
					this._store.set(key, value);
				}, this);
				this._onReset();
			}
		},

		/**
		 * @override
		 */
		reset: function () {
			var i = 0,
				length = this._keys.length;

			for (i; i < length; i += 1) {
				delete this._store[this._keys[i]];
			}

			this._keys = [];
			this._onReset();
		},

		/**
		 * @override
		 */
		observe: function (item, fn, scope) {
			var observer;

			observer = this._store.watch(item, function () {
				fn.apply(scope, arguments);
			});

			this.own(observer);
			return observer;
		},

		/**
		 * @override
		 */
		observeAll: function (fn, scope) {
			var observer;

			observer = this._store.watch(function () {
				fn.apply(scope, arguments);
			});

			this.own(observer);
			return observer;
		},

		/**
		 * @private
		 * @description Helper function that returns all key / value pairs
		 * @return {Object} A hash of the entire data set
		 */
		_getAll: function () {
			var buffer = {},
				i = 0,
				length = this._keys.length;

			for (i; i < length; i += 1) {
				buffer[this._keys[i]] = this.get(this._keys[i]);
			}
			return buffer;
		}
	});
});
