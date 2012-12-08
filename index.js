exports.spy = function(name) {
	return spy(name);
};

exports.mock = function() {
	return new Mock();
};

// --- spy ---

function spy(name) {
	function fn() {
		return fn.invoke(arguments);
	}

	fn._name = name || 'spy';
	fn._args = [];
	fn._return = [];
	fn._expected = null;
	fn._called = 0;

	fn.args = spy.args;
	fn.return = spy.return;
	fn.called = spy.called;
	fn.invoke = spy.invoke;
	fn.check = spy.check;

	return fn;
}

spy.args = function() {
	var args = Array.prototype.slice.call(arguments);
	this._args.push(args);
	return this;
};

spy.return = function(value) {
	this._return.push(value);
	return this;
};

spy.called = function(expected) {
	this._expected = (expected != null) ? expected : 1;
	return this;
};

spy.invoke = function(args) {
	var c = this._called++,
			a = this._args,
			expected = a[c] || a[a.length - 1] || [];

	for (var i = 0; i < expected.length; i++) {
		assert(
			expected[i] === args[i],
			(i + 1) + '. argument in ' + this._name + ' is not ' + expected[i] + ', but ' + args[i]
		);
	}

	var r = this._return;
	return r[c] || r[r.length - 1];
};

spy.check = function() {
	if (this._expected != null) {
		assert(
			this._called === this._expected,
			this._name + ' was called ' + this._called + 'x instead of ' + this._expected + 'x'
		);
	}
};

// --- mock ---

function Mock() {
	this._methods = [];
}

Mock.prototype.method	= function(name) {
	var method = spy(name);
	this._methods.push(method);
	this[name] = method;
	return method;
};

Mock.prototype.check = function() {
	this._methods.forEach(function(method) {
		method.check();
	});
};

// --- assert ---

function assert(value, msg) {
	if (!value) throw new Error(msg);
}
