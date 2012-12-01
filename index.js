exports.mock = function() {
	return new Mock();
};

exports.spy = function(name) {
	return spy(name);
};

// --- mock ---

function Mock() {
	this._methods = [];
}

Mock.prototype.method = function(name) {
	var method = spy(name);
	this[name] = method;
	this._methods.push(method);
	return method;
};

Mock.prototype.check = function() {
	for (var i = 0; i < this._methods.length; i++) {
		this._methods[i].check();
	}
};

// --- spy ---

function spy(name) {
	function fn() {
		return fn.invoke(arguments);
	}

	fn._name = name || '[?]';
	fn._args = [];
	fn._return = undefined;
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
	this._args = arguments;
	return this;
};

spy.return = function(value) {
	this._return = value;
	return this;
};

spy.called = function(expected) {
	if (expected == null) {
		this._expected = 1;
	} else {
		this._expected = expected;
	}

	return this;
}

spy.invoke = function(args) {
	for (var i = 0; i < this._args.length; i++) {
		assert(
			args[i] === this._args[i],
			this._name + ': ' + i + '. argument ' + args[i] + ' is not equal to ' + this._args[i]
		);
	}

	this._called++;

	return this._return;
};

spy.check = function() {
	if (this._expected != null) {
		assert(
			this._expected === this._called,
			'spy ' + this._name + ' was called ' + this._called +
			' times instead of ' + this._expected
		);
	}
}

// --- assert ---

function assert(value, msg) {
	if (!value) throw new Error(msg);
}
