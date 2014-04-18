describe('OnBeforeUnload', function () {
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
        describe('message', function () {
            it('should take a message parameter as a string', function () {
                expect(function () {
                    BeforeUnload.prototype.validateMessage('a message');
                }, 'not to throw');
            });
            it('should not take a message parameter as anything but a string', function () {
                expect(function () {
                    BeforeUnload.prototype.validateMessage();
                }, 'to throw', 'You must provide a message.');
            });
        });
        describe('conditions', function () {
            it('should take a conditions paramater as a list', function () {
                expect(function () {
                    BeforeUnload.prototype.validateConditions(['a', 'b', 'c']);
                }, 'not to throw');
            });
            it('should take a single condition as a function', function () {
                expect(function () {
                    BeforeUnload.prototype.validateConditions(function () {});
                }, 'not to throw');
            });
            it('should throw is passed neither a function nor a list', function () {
                expect(function () {
                    BeforeUnload.prototype.validateConditions('not a function');
                }, 'to throw', 'You must provide either a list of functions, a function, or nothing as the second parameter.');
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
            BeforeUnload.prototype.register({
                addEventListener: spy
            }, 'a handler');
            expect(spy, 'was called with', 'beforeunload', 'a handler');
        });
        it('should be able to unregister an event handler', function () {
            var spy = sinon.spy();
            BeforeUnload.prototype.unregister({
                removeEventListener: spy
            }, 'a handler');
            expect(spy, 'was called with', 'beforeunload', 'a handler');
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
});
