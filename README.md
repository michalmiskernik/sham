Sham
====

Sham is a simple and small JavaScript library for mocking.

sham.spy([name])
------------------

	:::javascript
	var sum = sham.spy('sum');

	sum.args(5, 7); // specify the arguments
	sum.return(12); // set return value
	sum.called(3); // ensure that spy is called three times

	sum(2, 3) // this throws an error, because the arguments are wrong

	var result = sum(5, 7); // result is now 12

	sum.check(); // this throws an error, because sum was called only once

sham.mock()
-------------

	:::javascript
	var file = sham.mock();

	file.method('read').return('some text').called();
	file.method('write').args('another text').called();

	var contents = file.read(); // contents is now 'some text'

	file.check(); // this throws an error, because write wasn't called

	file.write('another text');

	file.check(); // this doesn't throw

You can generate mocks too:

	:::javascript
	function create() {
		var file = sham.mock();
		file.method('read');
		file.method('write');
	}

	var file = create();

	file.read.return('some text');

	var contents = file.read(); // contents is now 'some text'
