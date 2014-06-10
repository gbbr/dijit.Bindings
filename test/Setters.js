var Setters = {

    SETTER_REPEATER: 1,
    SETTER_ATTRIBUTE: 3,
    SETTER_TEXTNODE: 4,

    _setters: {},

    addSetter: function (type, fn) {
        _setters[type] = fn;
    },


};

Setters.addSetter(Setters.SETTER_TEXTNODE, function (value, configObj /*node, transformFn*/) {});
Setters.addSetter(Setters.SETTER_ATTRIBUTE, function (value, configObj /*node, transformFn, name*/) {});
Setters.addSetter(Setters.SETTER_REPEATER ,function (value, configObj /*node, transformFn*/) {});

node._set = Setters.getSetter(this, Setters.SETTER_ATTRIBUTE);

node._set(transformFn("row-12"), node, "class");

p = {
    "content.title": {
        setters: [
            function(value) {
                console.log(arguments);
            }.bind(this, arguments);
        ]
    }
}

// getSetter({ type: , node, formatFn)
var getSetter = function (data) {
    return function(value) {
        // _setters[type].call(this, value, arguments)
    }.bind(this, data);
}


var getSetter = function (context, type, data) {
    return function(value) {
        this._setters[type].call(context, data);
    }.bind(this, data);
}