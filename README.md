# The Compiler

By mixing `indium/view/Bindings` into your widget you enable a `Compiler` that parses and interprets expressions in your template. The `Compiler` traverses the DOM and creates a direct link between your Model and template.

The `Compiler` works in two phases. First, it traverses your widget's DOM tree and [invokes a list of actions](https://github.com/backslashed/IndiumView/blob/master/services/Compiler.js#L73) called *collectors* on each node. Afterwards, it launches a [second set of actions](https://github.com/backslashed/IndiumView/blob/master/services/Compiler.js#L98) called *builders*.

After these actions are finished, it returns a *linking function* that takes a single parameter, the scope. In most cases, the scope is our widget, but it can also be any object containing properties and/or models. The result is a link between our Model and expressions in our template.

By default, it runs against our widget as:

```javascript
this.compile(this.domNode)(this);
````

...meaning that our widget's DOM tree (except its root node), should now have a two-way binding to our widget's instance (`this`). 

We can easily trigger this effect against any DOM node in cases where we would want to inject new HTML in the DOM that was not compiled at instantiation. We could even restrict it's scope by doing something of the likes:

```javascript
this.compile(this.myNode, {
  title: "Foo",
  person: new ObservableModel
});
```

The compiler can be extended with new behaviour by making use of the services it exposes.

## Parser ##

The Parser is the parent of the Compiler and it's only purpose is to expose a set of utilities that allow string parsing and interpolation against your widget's instance.

* `{{model.key}}` is evaluated as `this.model.get(key)` if it is an observable model with a getter
* `{{id}}` evaluates as `this.id` if it is not a valid model
* `{{model.key|transformFn}}` evaluates as `this.transformFn(model.get("key"))`

If any of these expressions do not match an Error is thrown. The only exception is when the transformFn is missing, in which case the string replacement will continue without passing through the function.

The parser provides an interpolation function and an expression parsing method that can be used by modules (mixins) to automatically replace these expressions within strings by taking a scope to evaluate against as an argument. The easiest way to understand what the interpolation function does in case you are not familiar with it is by looking at it's tests `indium/test/view/bindings/Parser`.

## Binding Store ##

The builders add the setter functions into a binding store under the ID of the binding that they belong too. For example, whenever an observed `key` changes in a `model`, the Binding Store will be queried for ID `model.key`, and it will invoke all the setter functions that are there. The setter functions generated by `registrationService.getSetter` are attached to the binding store using `registrationService.attachSetter`. This method determines the type of the binding, and in case it is a model it also attaches a reference to the model object and a string that is the property we are linking too. During the linking phase, this model and property will be observed for changes so that we can trigger all the setter functions attached to update the DOM. Each setter function should update one binding.

You can easily understand the way the binding store is used by looking at the [Compiler's Link Function](https://github.com/backslashed/IndiumView/blob/master/services/Compiler.js#L106)

## Registration Service ##

The Compiler also provides a Registration Service through `this.registrationService` which allows modules to add new builders and collectors to the compilation phase. I will further try to explain the roles of builders and collectors.

# Extending the Compiler

## Collectors ##

Collectors are actions (functions) that are invoked on each DOM node and take that node as a parameter. They should filter the nodes that qualify for creating bindings by nodeType and by searching for expressions. The RegistrationService provides a `CollectorStore` that allows collectors to save nodes and information about them for the next phase. We do not act upon the DOM during this phase because it would break its traversal. A very simple example of a collector function can be found in the TextNodeMixin's private `_gatherTextNodes` [function](https://github.com/backslashed/IndiumView/blob/master/mixins/TextNodeMixin.js#L40). The collector store is just an array to which you can push information about nodes of interest.

## Builders ##

The builder functions can also be registered using the Registration Service. They only execute once per module during compilation. The purpose of these functions is to take all the information that is needed out of each node in the CollectorStore, and use it to create _setter functions_ which the compiler will trigger to refresh the DOM when bound models or properties change.

## Setter functions ##

Setter functions, similary to Linking Functions, take the scope as a parameter and use it to set the value of the node that they are linked to. Setter functions are created with pre-bound values to them (using `.bind(this, extraOptions)`). They are created in the Registration Service [line 102](https://github.com/backslashed/IndiumView/blob/master/services/RegistrationService.js#L102) using `getSetter` usually by passing an interpolationFunction along with information about which node it belongs too.


