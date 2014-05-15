(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else {
        root.BeforeUnload = factory();
    }
}(this, function () {

    /**
     * This constructor accepts three parameters. The second is a list
     * of conditions or a single condition to check before unloading
     * the page, the first is a message to show if at least one of the
     * conditions evaluates to true, and the last is a boolean flag to
     * determine if the handler should be registered right away.
     */
    function BeforeUnload(message, conditions, register) {
        this.message = this.validateMessage(message);
        this.conditions = this.validateConditions(conditions);
        this.handlerReference = null;

        // Register the event handler, if not not asked to.
        if (typeof register === 'undefined' || register) {
            this.register();
        }
    }

    /**
     * Validates the conditions parameter in the constructor.
     */
    BeforeUnload.prototype.validateConditions = function (conditions) {
        if (typeof conditions === 'function') {
            return [conditions];
        } else if (Array.isArray(conditions)) {
            return conditions;
        } else {
            this.throwException('You must provide either a list of functions, a function, or nothing as the second parameter.');
        }
    };

    /**
     * Validates the message parameter.
     */
    BeforeUnload.prototype.validateMessage = function (message) {
        if (typeof message !== 'string') {
            this.throwException('You must provide a message.');
        }
        return message;
    };


    /**
     * Loops over all the conditions given to the constructor.
     * Returns a boolean.
     */
    BeforeUnload.prototype.check = function () {
        var result = false;

        this.conditions.some(function (condition) {
            var conditionResult = condition();
            if (conditionResult) {
                result = conditionResult;
            }
            return conditionResult;
        });

        return result;
    };

    /**
     * The event handler.
     */
    BeforeUnload.prototype.handler = function (e) {
        var check = this.check();
        var message = check && typeof check === 'string' ? check : this.message;
        if (check) {
            // Hack needed because some browsers (webkit) requires a
            // return value where the rest expects a returnValue
            // property on the event object.
            // Source: https://developer.mozilla.org/en-US/docs/Web/Reference/Events/beforeunload
            (e || window.event).returnValue = message;
            return message;
        }
        return void 0;
    };


    /**
     * This functions sets up a listener for before unload events on
     * the supplied target, and assigns the supplied handler.
     * Target defaults to window, and the handler defaults to this.handler.
     */
    BeforeUnload.prototype.register = function (target, handler) {
        // Allow setting the target and the event handler. For testing purposes.
        target = (target) ? target : window;
        this.handlerReference = handler ? handler : this.handler.bind(this);

        // Set up listener
        if (target.addEventListener) {
            target.addEventListener('beforeunload', this.handlerReference);
        } else {
            target.attachEvent('onbeforeunload', this.handlerReference);
        }
    };

    /**
     * This functions removes the supplied handler for the before
     * unload events on the supplied target.
     * Target defaults to window.
     */
    BeforeUnload.prototype.unregister = function (target) {
        // Allow setting the target. For testing purposes.
        target = (target) ? target : window;

        // Tear down listener
        if (this.handlerReference !== null) {
            if (target.removeEventListener) {
                target.removeEventListener('beforeunload', this.handlerReference);
            } else {
                target.detachEvent('onbeforeunload', this.handlerReference);
            }
            this.handlerReference = null;
        }
    };

    /**
     * This method throws a name spaced error.
     */
    BeforeUnload.prototype.throwException = function (message) {
        throw new Error('before-unload: ' + message);
    };


    return BeforeUnload;

}));
