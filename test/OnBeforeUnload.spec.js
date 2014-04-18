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
            var origBeforeUnload = BeforeUnload.prototype;
            var spy;
            beforeEach(function () {
                spy = sinon.spy();
                BeforeUnload.prototype = origBeforeUnload;
            });
            after(function () {
                BeforeUnload.prototype = origBeforeUnload;
            });
            it('should call the register function when asked to', function () {
                BeforeUnload.prototype.register = spy;
                var beforeUnload = new BeforeUnload(null, null, true);
                expect(spy.called, 'to be ok');
            });
            it('should not call the register function when not asked to', function () {
                BeforeUnload.prototype.register = spy;
                var beforeUnload = new BeforeUnload(null, null, false);
                expect(spy.called, 'not to be ok');
            });
            it('should call the register function when no directions is given', function () {
                BeforeUnload.prototype.register = spy;
                var beforeUnload = new BeforeUnload(null, null);
                expect(spy.called, 'to be ok');
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
});
