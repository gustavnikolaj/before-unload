# before-unload

A generic onbeforeunload handler. Will check a condition, or a list of
supplied conditions, to determine if it is safe to unload.

The examples are available on the [github project page](https://gustavnikolaj.github.io/before-unload/).

# Installation

Install it from npm:

```
$ npm install before-unload
```

# Usage

## Simple condition

In the following example, the user will be prompted on the
beforeunload event, if the ViewModel.hasChanges method returns a
truthy value.

```javascript
new BeforeUnload('Are you sure you want to leave?', function () {
    return ViewModel.hasChanges();
});
```

## Multiple conditions

In the following example, the user will be prompted on the
beforeunload event, if the ViewModel.hasChanges method or the
Storage.unsavedChanges method returns a truthy value.

```javascript
new BeforeUnload('Are you sure you want to leave?', [
    function () {
        return ViewModel.hasChanges();
    },
    function () {
        return Storage.unsavedChanges();
    }
]);
```

## Unregistering the beforeunload event listener.

If you store a reference to the BeforeUnload object, you can
unregister the event listener.

If a user attempts to leave the page after the unregister call, she
will not be prompted.

```javascript
var beforeUnload = new BeforeUnload(
    'Are you sure you want to leave?',
    function () {}
);

beforeUnload.unregister();
```
