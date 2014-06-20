Documentation
=============

### Overview
By mixing `indium/view/Bindings` into your widget you enable a `Compiler` that parses and interprets expressions in your template. The `Compiler` traverses the DOM and creates a direct link between your Model and template.

The `Compiler` works in two phases. First, it traverses your widget's DOM tree and [invokes a list of actions](https://github.com/backslashed/IndiumView/blob/master/services/Compiler.js#L73) called *collectors* on each node. After which, it launches a [second set of actions](https://github.com/backslashed/IndiumView/blob/master/services/Compiler.js#L98) called *builders*.

After these actions are finished, it returns a linking function that takes a single parameter, the scope. In most cases, the scope is our widget. The linking function looks for models or widget properties to link against and creates a live link.

By default, it runs against our widget as:

```javascript
this.compile(this.domNode)(this);
````

...meaning that our widget's DOM node (except the root node), should now have a two-way binding to our widget's instance (`this`). We can easily trigger this effect against any DOM node in cases where we would want to inject new HTML in the DOM that was not compiled at instantiation. We could even restrict it's scope by doing something of the likes:

```javascript
this.compile(this.myNode, {
  title: "Foo",
  person: new ObservableModel
});
```

### Registration Service

A Registration Service is provided by the compiler as `this.registrationService`



This would compile the provided node and link it to the passed objects: `person` would be detected as a model and a live binding would be created. If `title` is on the page a binding is created as well but it will not be live, and if we should ever wish to update it we could use `renderProperty("title")` to render that node. We can also use `renderProperty()` to render all static nodes that are on our template.




The Compiler currently consists of a mixin that allows you to use expressions within text or attribute values.



```javascript
ads
```
