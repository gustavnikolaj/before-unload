/*global describe, it, expect, beforeEach, afterEach, BeforeUnload, sinon */
describe('BeforeUnload', function () {
    describe('Constructor', function () {
        var fakeObj;
        beforeEach(function () {
            fakeObj = {
                validateMessage: sinon.stub().returnsArg(0),
                validateConditions: sinon.stub().returnsArg(0),
                register: sinon.stub()
            };
        });
        it('should take a message paramater', function () {
            BeforeUnload.call(fakeObj, 'A message');
            expect(fakeObj.message, 'to be', 'A message');
        });
        it('should take a conditions paramater', function () {
            BeforeUnload.call(fakeObj, null, ['a', 'b', 'c']);
            expect(fakeObj.conditions, 'to equal', ['a', 'b', 'c']);
        });
        describe('register parameter', function () {
            beforeEach(function () {
                fakeObj.register = sinon.spy();
            });
            it('should call the register function when asked to', function () {
                BeforeUnload.call(fakeObj, null, null, true);
                expect(fakeObj.register, 'was called');
            });
            it('should not call the register function when not asked to', function () {
                BeforeUnload.call(fakeObj, null, null, false);
                expect(fakeObj.register, 'was not called');
            });
            it('should call the register function when no directions is given', function () {
                BeforeUnload.call(fakeObj, null, null);
                expect(fakeObj.register, 'was called');
            });
        });
    });
    describe('Validate parameters', function () {
        var stub = {
            throwException: sinon.stub().throws()
        };
        describe('message', function () {
            it('should take a message parameter as a string', function () {
                expect(function () {
                    BeforeUnload.prototype.validateMessage.call(stub, 'a message');
                }, 'not to throw');
            });
            it('should not take a message parameter as anything but a string', function () {
                expect(function () {
                    BeforeUnload.prototype.validateMessage.call(stub);
                }, 'to throw');
            });
        });
        describe('conditions', function () {
            it('should take a conditions paramater as a list', function () {
                expect(function () {
                    BeforeUnload.prototype.validateConditions.call(stub, ['a', 'b', 'c']);
                }, 'not to throw');
            });
            it('should take a single condition as a function', function () {
                expect(function () {
                    BeforeUnload.prototype.validateConditions.call(stub, function () {});
                }, 'not to throw');
            });
            it('should throw is passed neither a function nor a list', function () {
                expect(function () {
                    BeforeUnload.prototype.validateConditions.call(stub, 'not a function');
                }, 'to throw');
            });
        });
    });
    describe('Check conditions', function () {
        var fakeObj;
        it('should return true if the one provided condition is true', function () {
            fakeObj = { conditions: [
                sinon.stub().returns(true)
            ] };
            expect(BeforeUnload.prototype.check.call(fakeObj), 'to be ok');
        });
        it('should return false if the one provided condition is false', function () {
            fakeObj = { conditions: [
                sinon.stub().returns(false)
            ] };
            expect(BeforeUnload.prototype.check.call(fakeObj), 'not to be ok');
        });
        it('should return true if at least one provided condition is true', function () {
            fakeObj = { conditions: [
                sinon.stub().returns(false),
                sinon.stub().returns(false),
                sinon.stub().returns(true),
                sinon.stub().returns(false)
            ] };
            expect(BeforeUnload.prototype.check.call(fakeObj), 'to be ok');
        });
        it('should return false if no conditions is provided', function () {
            fakeObj = { conditions: [] };
            expect(BeforeUnload.prototype.check.call(fakeObj), 'not to be ok');
        });
    });
    describe('Conditions with custom messages', function () {
        var fakeObj;
        it('if a message is returned from a conditions it should return the message', function () {
            fakeObj = { conditions: [
                sinon.stub().returns('A custom message')
            ] };
            var result = BeforeUnload.prototype.check.call(fakeObj);
            expect(result, 'to be', 'A custom message');
        });
        describe('if the handler is called and a....', function () {
            var fakeObj, fakeEvent;
            beforeEach(function () {
                fakeObj = {
                    message: 'Default message'
                };
                fakeEvent = {
                    returnValue: null
                };
            });
            it('condition with a custom message is triggered pop up the custom message', function () {
                fakeObj.check = sinon.stub().returns('A custom message');
                var result = BeforeUnload.prototype.handler.call(fakeObj, fakeEvent);
                expect(result, 'to be', 'A custom message');
                expect(fakeEvent.returnValue, 'to be', 'A custom message');
            });
            it('condition with a standard message is triggered pop up the standard message', function () {
                fakeObj.check = sinon.stub().returns(true);
                var result = BeforeUnload.prototype.handler.call(fakeObj, fakeEvent);
                expect(result, 'to be', 'Default message');
                expect(fakeEvent.returnValue, 'to be', 'Default message');
            });
        });
    });
    describe('Registering event handlers', function () {
        it('should be able to register an event handler', function () {
            var spy = sinon.spy();
            var fakeObj = {};
            BeforeUnload.prototype.register.call(fakeObj, {
                addEventListener: spy
            }, 'a handler');
            expect(spy, 'was called with', 'beforeunload', 'a handler');
            expect(fakeObj, 'to have property', 'handlerReference', 'a handler');
        });
        it('should be able to unregister an event handler', function () {
            var spy = sinon.spy();
            var fakeObj = {
                handlerReference: 'a handler'
            };
            BeforeUnload.prototype.unregister.call(fakeObj, {
                removeEventListener: spy
            }, 'a handler');
            expect(spy, 'was called with', 'beforeunload', 'a handler');
            expect(fakeObj, 'to have property', 'handlerReference', null);
        });
        it('should not attempt to unregister an event handler if one is not registered', function () {
            var spy = sinon.spy();
            BeforeUnload.prototype.unregister.call({
                handlerReference: null
            }, {
                removeEventListener: spy
            }, 'a handler');
            expect(spy, 'was not called');
        });
    });
    describe('Handler', function () {
        it('should prompt the user if the check function returns true', function () {
            var fakeObj = {
                message: 'a message',
                check: sinon.stub().returns(true)
            };
            var event = {};
            var result = BeforeUnload.prototype.handler.call(fakeObj, event);
            expect(result, 'to be', fakeObj.message);
            expect(event, 'to have property', 'returnValue', fakeObj.message);
        });
        it('should not prompt the user if the check function returns false', function () {
            var fakeObj = {
                check: sinon.stub().returns(false)
            };
            var event = {};
            var result = BeforeUnload.prototype.handler.call(fakeObj, event);
            expect(result, 'to be undefined');
            expect(event.returnValue, 'to be undefined');
        });
    });
    describe('Exceptions', function () {
        it('should throw a name spaced exception', function () {
            expect(function () {
                BeforeUnload.prototype.throwException.call(null, 'An exception');
            }, 'to throw', 'before-unload: An exception');
        });
    });
    describe('Manual confirm', function () {
        var fakeObj;
        beforeEach(function () {
            fakeObj = {};
            fakeObj.message = 'foo';
            fakeObj.check = BeforeUnload.prototype.check.bind(fakeObj);
            fakeObj.unregister = sinon.stub();
        });
        afterEach(function () {
            if (window.confirm.restore) { window.confirm.restore(); }
        });
        it('should call the method if there is no blocking conditions', function () {
            var spy = sinon.spy();
            fakeObj.conditions = [sinon.stub().returns(false), sinon.stub().returns(false)];

            BeforeUnload.prototype.confirmedIfNecessary.call(fakeObj, spy);

            expect(spy, 'was called once');
        });
        it('should prompt the user before calling the method if there is blocking conditions', function () {
            sinon.stub(window, 'confirm', function () { return true; });
            var callbackSpy = sinon.spy();
            fakeObj.conditions = [sinon.stub().returns('Do not leave just yet, please!')];

            BeforeUnload.prototype.confirmedIfNecessary.call(fakeObj, callbackSpy);

            expect(window.confirm, 'was called with', 'Do not leave just yet, please!');
            expect(callbackSpy, 'was called once');

        });
        it('should prompt the user and dont call the callback if the user cancels', function () {
            sinon.stub(window, 'confirm', function () { return false; });
            var callbackSpy = sinon.spy();
            fakeObj.conditions = [sinon.stub().returns('Do not leave just yet, please!')];

            BeforeUnload.prototype.confirmedIfNecessary.call(fakeObj, callbackSpy);

            expect(window.confirm, 'was called with', 'Do not leave just yet, please!');
            expect(callbackSpy, 'was not called');
        });
        it('should unregister conditions before the callback is called if the user confirms', function () {
            sinon.stub(window, 'confirm', function () { return true; });
            var callbackSpy = sinon.spy();
            fakeObj.conditions = [sinon.stub().returns(true)];
            fakeObj.unregister = sinon.spy(function () {
                // Make sure this is called before callbackSpy
                expect(callbackSpy, 'was not called');
            });

            BeforeUnload.prototype.confirmedIfNecessary.call(fakeObj, callbackSpy);

            expect(window.confirm, 'was called');
            expect(fakeObj.unregister, 'was called once');
            expect(callbackSpy, 'was called once');

        });

        it('should not unregister conditions before calling the callback if preserveHandlers is true', function () {
            sinon.stub(window, 'confirm', function () { return true; });
            var callbackSpy = sinon.spy();
            fakeObj.conditions = [sinon.stub().returns(true)];
            fakeObj.unregister = sinon.spy();

            BeforeUnload.prototype.confirmedIfNecessary.call(fakeObj, callbackSpy, true);

            expect(window.confirm, 'was called');
            expect(fakeObj.unregister, 'was not called');
            expect(callbackSpy, 'was called once');
        });
    });
});
