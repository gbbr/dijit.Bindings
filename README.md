# Extending the Compiler

The `Compiler` object can be further extended through the APIs it exposes via the `RegistrationService` and the `BindingStore`. The RegistrationService allows you to register actions with the Compiler, while the BindingStore enables you to register actions in a store, which the Compiler will take when data on the DOM needs updating. To initiate the compilation of a DOM node you do:

```javascript
this.compile(this.domNode);
```

Cases when this needs to be run programmatically should be avoided, as this command is already being run in `Bindings` when mixing it into your Widget.

### The Collecting Phase

The first phase in the compiling phase is called the collection phase, where actions called collectors are applied. The role of this phase is to scan the DOM and allow the collectors to collect any nodes they are of interest. 

Each collector should collect information for a unique type of behavior. While one collector might be interested in finding expressions in a _TextNode_, another might be interested in finding them in a node's attributes, while another might be interested in finding a special tag (such as _indium-repeat_ or _data-indium-repeat_) for a custom type of behavior.


To add collectors you use the following command:
```javascript
this.registrationService.addCollector(<function>);
```

The passed __function__ will be executed once for each node in the tree and it will receive the node as it's argument. For example, if we would want to find elements such links with _href_ attributes we would have a collector function that looks like this:

```javascript
function linkCollector(node) {
  if (node.nodeName === "A" && node.hasAttribute("href")) {
    ...
  }
}
```
