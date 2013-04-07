if (typeof exports == 'undefined') {
	var exports = window.sham = {};
}

exports.spy = function(name) {
	return createSpy(name);
};

exports.mock = function(obj) {
	return createMock(obj);
};

// --- spy ---

function createSpy(name) {
	function fn() {
		return fn.invoke(arguments);
	}

	var that = {
		name: name || 'spy',
		args: [],
		ret: [],
		expected: null,
		called: 0
	};

	fn.args = function() {
		var args = Array.prototype.slice.call(arguments);
		that.args.push(args);
		return this;
	};

	fn.return = function(value) {
		that.ret.push(value);
		return this;
	};

	fn.called = function(expected) {
		that.expected = (expected != null) ? expected : 1;
		return this;
	};

	fn.invoke = function(args) {
		var c = that.called++,
				a = that.args,
				expected = a[c] || a[a.length - 1] || [];

		for (var i = 0; i < expected.length; i++) {
			assert(
				expected[i] === args[i],
				(i + 1) + '. argument in ' + that.name + ' is not ' + expected[i] + ', but ' + args[i]
			);
		}

		var r = that.ret;
		return r[c] || r[r.length - 1];
	};

	fn.check = function() {
		if (that.expected != null) {
			assert(
				that.called === that.expected,
				that.name + ' was called ' + that.called + 'x instead of ' + that.expected + 'x'
			);
		}
	};

	return fn;
}

// --- mock ---

function createMock(obj) {
	obj = prepareMock(obj);

	var checks = [];
	
	obj.spy = function(name) {
		var spy = createSpy(name);
		obj[name] = spy;
		checks.push(spy);
		return spy;
	};

	obj.mock = function(name) {
		var mock = createMock();
		obj[name] = mock;
		checks.push(mock);
		return mock;
	};

	obj.check = function() {
		checks.forEach(function(item) {
			item.check();
		});
	};

	return obj;
}

function prepareMock(obj) {
	if (typeof obj == 'function') {
		var fn = function() {};
		fn.prototype = Object.create(obj.prototype);
		obj = new fn;
	}

	if (obj == null) {
		obj = {};
	}

	return obj;
}

// --- assert ---

function assert(value, msg) {
	if (!value) throw new Error(msg);
}
