# Extending the Compiler

The `Compiler` object can be further extended through the APIs it exposes via the `RegistrationService` and the `BindingStore`. The RegistrationService allows you to register actions with the Compiler, while the BindingStore enables you to register actions in a store, which tell the Compiler what actions need to be taken when your model changes. To initiate the compilation of a DOM node you do:

```javascript
this.compile(this.domNode);
```

Cases when this needs to be run programmatically should be avoided, as this command is already being run in `Bindings` when mixing it into your Widget.

### The Collecting Phase

The first phase in the compiling phase is called the collection phase, where actions called collectors are applied. The role of this phase is to scan the DOM and allow the collectors to collect any nodes that are of interest. 

Each collector should collect information for a unique type of behavior. While one collector might be interested in finding expressions in a _TextNode_, another might be interested in finding them in a node's attributes, while another might be interested in finding a special tag (such as _indium-repeat_ or _data-indium-repeat_) for a custom type of behavior.


To add a collector you use the following command:
```javascript
this.registrationService.addCollector(<function>);
```

The passed __function__ will be executed once for each node in the tree and it will receive that node as it's argument. For example, if we want to find elements such as links with _href_ attributes we would have a collector function that looks like this:

```javascript
function linkCollector(node) {
  if (node.nodeName === "A" && node.hasAttribute("href")) {
    // extract information
  }
}
```

At this point, the purpose is to find all the information we need in the DOM. It is not allowed to modify the DOM or the node at this point as this would break traversal. 

To save information found on nodes, the RegistrationService provides a `Collector Store` with different channels for each module. You do not have to explicitly register a channel, simply requesting your store will automatically create on for you if it does not exist. To request your store do this:

```javascript
var store = this.registrationService.getCollectorStore(<name>)
```

The returned value is an array to which you may push objects containing information, including the node they relate too. Let's say we have a different collector function than above which is interested in finding expressions in the `value` attribute of INPUT. That would look something like this:

```javascript
function inputValueCollector(node) {
  if (node.nodeName == "INPUT" && this._bindingCount(node.getAttribute("value"))) {
    ...
  }
}
```

The `Parser`'s helper function offers the `_bindingCount` function which will return the number of expressions in a String. If the node passes the check we would be interested in saving a reference to it for later, as well as a reference to the attribute's template. We could save this in the collector store:

```javascript
function inputValueCollector(node) {
  if (node.nodeName == "INPUT" && this._bindingCount(node.getAttribute("value"))) {
    this.registrationService.getCollectorStore("MyStore").push({
      "node": node,
      "attributeTemplate": node.getAttribute("value")
    });
  }
}
```

__Tip__: For reasons of efficiency and speed, operations during the collecting phase should be kept minimal.

This phase ends and the result is a store containing information about any behavior that is of interest within the scope of your module. We will use this store in the Building Phase to create actions called Setters.

### Setters

Before we discuss the Building Phase, we must first understand what setters are, how they are created, and the flexibility they offer.

### The Building Phase

Once the compiler finishes traversing the DOM, it executes another set of actions, called __builders__. Just as during collection, while one builder maybe interested in binding TextNode expressions to actions, another might be interested in repeating a template. Each `builder` communicates with its corresponding `collector` via their CollectorStore channel.

To register a builder we do:

```javascript
this.registrationService.addBuilder(<function>);
```

In this case, __function__ is simply a function that puts actions, called setter, into the BindingStore. You are in charge of defining these actions, and the BindingStore offers you with an API to easily do this. 

This BindingStore will be used in the last phase of the Compiler, called the Linking Phase. The Linking Phase is when your widget's instance is connected to the BindingStore to apply the setters you have defined, when changes occur in your model. The Linking Phase is automatic and no additional logic is needed.

