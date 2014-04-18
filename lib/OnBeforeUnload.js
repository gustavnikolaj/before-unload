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
     * Register/unregister functions should listen to the beforeunload
     * event, if such an event exists. Otherwise fallback to using
     * window.onbeforeunload.
     */
    BeforeUnload.prototype.register = function (target) {
        // Set up listener
    };

    BeforeUnload.prototype.unregister = function (target) {
        // Tear down listener
    };

    return BeforeUnload;

}));
