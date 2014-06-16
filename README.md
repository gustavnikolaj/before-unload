# before-unload

[![NPM version](https://badge.fury.io/js/before-unload.svg)](http://badge.fury.io/js/before-unload)
[![Build Status](https://travis-ci.org/gustavnikolaj/before-unload.svg)](https://travis-ci.org/gustavnikolaj/before-unload)

A generic onbeforeunload handler. Will check a condition, or a list of
supplied conditions, to determine if it is safe to unload.

The examples are available on the [github project page](https://gustavnikolaj.github.io/before-unload/).

# Browser support

It supports newer ES5 compatible browsers. And it should be able to
support most elderly browsers if you provide them with an ES5 shim.

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

## Conditions with custom messages

In the following example, a different warning is shown for
one of the conditions.

```javascript
new BeforeUnload('Are you sure you want to leave?', [
    function () {
        return ViewModel.hasChanges();
    },
    function () {
        return Storage.unsavedChanges();
    },
    function () {
    	return SomeObject.isItOkayToLeave() ? false : 'A custom error message';
	}
]);
```

- If a false is returned from a condition, no warning is shown.
- If a boolean true value is returned, the default message set in the constructor is shown.
- If a string value is returned, that is displayed.

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
