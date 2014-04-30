/*global describe, it, expect, beforeEach, BeforeUnload, sinon */
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
});
