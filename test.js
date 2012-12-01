assert = require('assert');
sham = require('./index');

describe('spy', function() {
	it('should test arguments', function() {
		var sum = sham.spy('sum');

		sum.args(1, 2, 3);

		assert.throws(function() {
			sum(3, 2);
		}, /is not equal to/);

		assert.doesNotThrow(function() {
			sum(1, 2, 3);
		});
	});

	it('should return correct value', function() {
		var sum = sham.spy('sum');

		sum.return(8);

		assert.equal(sum(), 8);
	});

	it('should test if function was called', function() {
		var save = sham.spy('save');

		save.called();

		assert.throws(function() {
			save.check();
		}, /was called 0 times instead of 1/);

		save();

		assert.doesNotThrow(function() {
			save.check();
		});
	});
});

describe('mock', function() {
	it('should create methods', function() {
		var mock = sham.mock();

		mock.method('foo').return('bar');
		mock.method('baz').return(123);

		assert.equal(mock.foo(), 'bar');
		assert.equal(mock.baz(), 123);
	});

	it('should check all methods', function() {
		var mock = sham.mock();

		mock.method('foo').called();
		mock.method('bar').called(2);

		mock.foo();
		mock.bar();

		assert.throws(function() {
			mock.check();
		}, /bar was called/);
	});
});
