describe('OnBeforeUnload', function () {
    describe('Constructor', function () {
        it('should take a message paramater', function () {
            var message = 'A testing message';
            var beforeUnload = new BeforeUnload(message);
            expect(beforeUnload.message, 'to be', message);
        });
        it('should take a conditions paramater', function () {
            var conditions = ['a', 'b', 'c'];
            var beforeUnload = new BeforeUnload(null, conditions);
            expect(beforeUnload.conditions, 'to equal', conditions);
        });
        describe('register parameter', function () {
            var mock;
            beforeEach(function () {
                mock = { register: sinon.spy() };
            });
            it('should call the register function when asked to', function () {
                BeforeUnload.call(mock, null, null, true);
                expect(mock.register.called, 'to be ok');
            });
            it('should not call the register function when not asked to', function () {
                BeforeUnload.call(mock, null, null, false);
                expect(mock.register.called, 'not to be ok');
            });
            it('should call the register function when no directions is given', function () {
                BeforeUnload.call(mock, null, null);
                expect(mock.register.called, 'to be ok');
            });
        });
    });
    describe('Check conditions', function () {
        var beforeUnload;
        beforeEach(function () {
             beforeUnload = new BeforeUnload(null, []);
        });
        it('should return true if the one provided condition is true', function () {
            beforeUnload.conditions = [
                sinon.stub().returns(true)
            ];
            expect(beforeUnload.check(), 'to be ok');
        });
        it('should return false if the one provided condition is false', function () {
            beforeUnload.conditions = [
                sinon.stub().returns(false)
            ];
            expect(beforeUnload.check(), 'not to be ok');
        });
        it('should return true if at least one provided condition is true', function () {
            beforeUnload.conditions = [
                sinon.stub().returns(false),
                sinon.stub().returns(false),
                sinon.stub().returns(true),
                sinon.stub().returns(false)
            ];
            expect(beforeUnload.check(), 'to be ok');
        });
        it('should return false if no conditions is provided', function () {
            expect(beforeUnload.check(), 'not to be ok');
        });
    });
    describe('Registering event handlers', function () {
        var beforeUnload;
        beforeEach(function () {
            beforeUnload = new BeforeUnload(null, null, false);
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
});
