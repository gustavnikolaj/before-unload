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
     * This constructor accepts three parameters. The second is a list of conditions
     * to check before unloading the page, the first is a message to show if at least
     * one of the conditions evaluates to true, and the last is a boolean flag to
     * determine if the handler should be registered right away.
     */
    function BeforeUnload(message, conditions, register) {
        this.message = message;
        this.conditions = conditions;

        // Register the event handler, if not not asked to.
        if (typeof register === 'undefined' || register) {
            this.register();
        }
    }

    /**
     * Loops over all the conditions given to the constructor.
     * Returns a boolean.
     */
    BeforeUnload.prototype.check = function () {
        return this.conditions.some(function (condition) {
            return condition();
        });
    };

    /**
     * The event handler.
     */
    BeforeUnload.prototype.handler = function (e) {
        if (this.check()) {
            // Hack needed because some browsers (webkit) requires a
            // return value where the rest expects a returnValue
            // property on the event object.
            // Source: https://developer.mozilla.org/en-US/docs/Web/Reference/Events/beforeunload
            (e || window.event).returnValue = this.message;
            return this.message;
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
        handler = (handler) ? handler : this.handler.bind(this);

        // Set up listener
        target.addEventListener('beforeunload', handler);
    };

    /**
     * This functions removes the supplied handler for the before
     * unload events on the supplied target.
     * Target defaults to window, and the handler defaults to this.handler.
     */
    BeforeUnload.prototype.unregister = function (target, handler) {
        // Allow setting the target and the event handler. For testing purposes.
        target = (target) ? target : window;
        handler = (handler) ? handler : this.handler.bind(this);

        // Tear down listener
        target.removeEventListener('beforeunload', handler);
    };

    return BeforeUnload;

}));
