var path = require('../../../bootstrap').projectPath,
	geo = require('pointExtension'),
	smog = require('smog');


exports.testAdd = function(test) {
	var l = new smog.util.Idealist,
		a = {some: 'hello'},
		b = {ii: 'C', other: 'world'};
	
	l.add(a);
	l.add(b);
	
	test.equal('hello', l.get('A').some);
	test.equal('world', l.get('C').other);
	
	test.ok(null != l.get('A'));
	l.remove('A');
	test.equal(null, l.get('A'));

	test.done();
};
