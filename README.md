# Extending the Compiler

The `Compiler` object can be further extended through the APIs it exposes via the `RegistrationService` and the `BindingStore`. The RegistrationService allows you to register actions with the Compiler, while the BindingStore enables you to register actions in a store, which the Compiler will take when data on the DOM needs updating.

### The Collecting Phase

