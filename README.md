# Sham

Sham is a simple and small JavaScript library for mocking.

## Installation

You can use it as a node.js package:

```
npm install sham
```

As a [component](http://github.com/component/component) package:

```
component install michalmiskernik/sham
```

Or just include it in a webpage:

```
<script src="sham.js"></script>
```

## API

### sham.spy([name])

```javascript
var sum = sham.spy('sum');

sum.args(5, 7); // specify the arguments
sum.return(12); // set return value
sum.called(3); // ensure that spy is called three times

sum(2, 3) // this throws an error, because the arguments are wrong

var result = sum(5, 7); // result is now 12

sum.check(); // this throws an error, because sum was called only once
```

### sham.mock([obj])

```javascript
var file = sham.mock();

file.spy('read').return('some text').called();
file.spy('write').args('another text').called();

var contents = file.read(); // contents is now 'some text'

file.check(); // this throws an error, because write wasn't called

file.write('another text');

file.check(); // this doesn't throw
```

You can mock classes too:

```javascript
function Foo() {}

var mock = sham.mock(Foo);
mock.spy('bar').return('baz');

console.log(mock.bar()) // outputs 'baz'
```
