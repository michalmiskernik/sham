assert = require('assert');
sham = require('./index');

describe('spy', function() {
	describe('#args', function() {
		it('should not throw when not called', function() {
			var spy = sham.spy();

			assert.doesNotThrow(function() {
				spy();
				spy('foo', 'bar');
			});
		});

		it('should check arguments', function() {
			var spy = sham.spy().args('foo', 1);

			assert.doesNotThrow(function() {
				spy('foo', 1);
				spy('foo', 1, 'bar');
			});

			assert.throws(function() {
				spy();
			}, '1. argument in spy is not foo, but undefined');

			assert.throws(function() {
				spy('foo');
			}, '2. argument in spy is not 1, but undefined');

			assert.throws(function() {
				spy('foo', 2);
			}, '2. argument in spy is not 1, but 2');
		});

		it('should check arguments when called multiple times', function() {
			var spy;

			// correct arguments

			spy = sham.spy()
				.args(10, 20)
				.args(30, 40);

			assert.doesNotThrow(function() {
				spy(10, 20);
				spy(30, 40);
				spy(30, 40);
			});

			// incorrect arguments

			spy = sham.spy()
				.args(50, 60)
				.args(70, 80);

			spy(50, 60);

			assert.throws(function() {
				spy(77, 88);
			}, /argument in spy is not/);

			spy(70, 80);

			assert.throws(function() {
				spy(77, 88);
			}, /argument in spy is not/);
		});
	});

	describe('#return', function() {
		it('should return undefined when was not called', function() {
			var spy = sham.spy();
			assert.equal(spy(), undefined);
		});

		it('should return it\'s argument', function() {
			var spy = sham.spy().return('foo');
			assert.equal(spy(), 'foo');
		});

		it('should work if called multiple times', function() {
			var spy = sham.spy()
				.return('foo')
				.return('bar');

			assert.equal(spy(), 'foo');
			assert.equal(spy(), 'bar');
			assert.equal(spy(), 'bar');
		});
	});

	describe('#called', function() {
		it('should work', function() {
			var spy = sham.spy();

			spy();
			spy();

			spy.called(5);
			assert.throws(function() {
				spy.check();
			}, /2x instead of 5x/);

			spy.called(2);
			assert.doesNotThrow(function() {
				spy.check();
			});

			spy.called();
			assert.throws(function() {
				spy.check();
			}, /2x instead of 1x/);
		});
	});

	it('should work all together', function() {
		var sum = sham.spy()
			.args(1, 2).return(3)
			.args(3, 3).return(6)
			.args(6, 4).return(10)
			.called(3);

		assert.equal(sum(1, 2), 3);
		assert.equal(sum(3, 3), 6);
		assert.equal(sum(6, 4), 10);

		sum.check();

		var move = sham.spy()
			.return('done!')
			.args(10, 20)
			.args(20, 30)
			.called(2);

		assert.equal(move(10, 20), 'done!')
		assert.equal(move(20, 30), 'done!');

		move.check();
	});
});

describe('mock', function() {
	it('should create spies as methods', function() {
		var mock = sham.mock();

		mock.method('foo');

		assert(typeof mock.foo.args == 'function');
		assert(typeof mock.foo.return == 'function');
	});
});
