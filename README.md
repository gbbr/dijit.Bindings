## Overview
By mixing `indium/view/Bindings` into your widget you enable a `Compiler` that parses and interprets expressions in your template. The `Compiler` traverses the DOM and creates a direct link between your Model and template.

The `Compiler` works in two phases. First, it traverses your widget's DOM tree and [invokes a list of actions](https://github.com/backslashed/IndiumView/blob/master/services/Compiler.js#L73) called *collectors* on each node. After which, it launches a [second set of actions](https://github.com/backslashed/IndiumView/blob/master/services/Compiler.js#L98) called *builders*.

After these actions are finished, it returns a linking function that takes a single parameter, the scope. In most cases, the scope is our widget, but it can also be any object containing properties and/or models. The result is a link between our Model and expressions in our template.

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

I will further try to explain how actions such as `collectors` and `builders` work with the compiler and how new functionality can be added.

## The API ##

The Compiler provides a Registration Service through `this.registrationService` which allows adding new builders and collectors to the compilation phase. It also extends and provides the `Parser` which gives modules string interpolation and parsing capabilities.

## Collectors ##

Collectors are actions (functions) that are invoked on each DOM node and take that node as a parameter. They should filter the nodes that qualify for creating bindings by nodeType and by searching for expressions. The RegistrationService provides a `CollectorStore` that allows collectors to save nodes and information about them for the next phase. We do not act upon the DOM during this phase because it would break its traversal. A very simple example of a collector function can be found in the TextNodeMixin's private `_gatherTextNodes` [function](https://github.com/backslashed/IndiumView/blob/master/mixins/TextNodeMixin.js#L40). The collector store is just an array to which you can push information about nodes of interest.

## Builders ##

The builder functions can also be registered using the Registration Service. They only execute once per module during compilation. The purpose of these functions is to take all the information that is needed out of each node in the CollectorStore, and use it to create _setter functions_. The relationship between Builders and Setter Functions is similar to that between the Compiler and it's Linking Function.

## Setter functions ##

Setter functions, similary to Linking Functions, take the scope as a parameter and use it to set the value of the node that they are linked to. A simple setter function can be see in the TextNodeMixin in the `_setNodeValue` [method](https://github.com/backslashed/IndiumView/blob/master/mixins/TextNodeMixin.js#L115).








This would compile the provided node and link it to the passed objects: `person` would be detected as a model and a live binding would be created. If `title` is on the page a binding is created as well but it will not be live, and if we should ever wish to update it we could use `renderProperty("title")` to render that node. We can also use `renderProperty()` to render all static nodes that are on our template.




The Compiler currently consists of a mixin that allows you to use expressions within text or attribute values.



```javascript
ads
```
