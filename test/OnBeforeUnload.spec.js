describe('OnBeforeUnload', function () {
    describe('Constructor', function () {
        it('should take a message paramater', function () {
            var message = 'A testing message';
            var beforeUnload = new BeforeUnload(message, [], false);
            expect(beforeUnload.message, 'to be', message);
        });
        it('should take a conditions paramater', function () {
            var conditions = ['a', 'b', 'c'];
            var beforeUnload = new BeforeUnload('', conditions, false);
            expect(beforeUnload.conditions, 'to equal', conditions);
        });
        describe('register parameter', function () {
            var mock = {
                validateMessage: sinon.stub.returns([]),
                validateConditions: sinon.stub.returns([])
            };
            beforeEach(function () {
                mock.register = sinon.spy();
            });
            it('should call the register function when asked to', function () {
                BeforeUnload.call(mock, null, null, true);
                expect(mock.register, 'was called');
            });
            it('should not call the register function when not asked to', function () {
                BeforeUnload.call(mock, null, null, false);
                expect(mock.register, 'was not called');
            });
            it('should call the register function when no directions is given', function () {
                BeforeUnload.call(mock, null, null);
                expect(mock.register, 'was called');
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
        var beforeUnload;
        beforeEach(function () {
            beforeUnload = new BeforeUnload('', [], false);
        });
        it('should be able to register an event handler', function () {
            var spy = sinon.spy();
            beforeUnload.register({
                addEventListener: spy
            }, 'a mocked handler');
            expect(spy, 'was called with', 'beforeunload', 'a mocked handler');
        });
        it('should be able to unregister an event handler', function () {
            var spy = sinon.spy();
            beforeUnload.unregister({
                removeEventListener: spy
            }, 'a mocked handler');
            expect(spy, 'was called with', 'beforeunload', 'a mocked handler');
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
