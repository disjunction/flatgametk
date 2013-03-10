var path = require('../../bootstrap.js').projectPath,
	jsein = require('jsein');

exports.testStringify = function(test) {
	function cl() {
		this.getBla = function(){return 'bla';};
	};
	
	function another(p1,p2) {
		this.z = p1;
		this.x = p2;
	};
    var o = new cl();

	o.a = 5;
	o.c = new another(123, 22);
	var str = jsein.stringify(o);
	test.ok(str.length > 0);
	
	o = {a: [1,2]};
	str = jsein.stringify(o);
	test.ok(str.length > 0);
	
	test.done();
};

exports.testClone = function(test) {
	var cl = function(){this.getBla = function(){return 'bla';};},
	    o = new cl();
	
	o.a = 5;
	o.c =  {z:123, x:22};
	
	o2 = jsein.clone(o);
	
	o.a = 7;
	
	// make sure that cloned object still has old value
	test.equals(5, o2.a);
	
	// make sure nested values were cloned
	test.equals(22, o2.c.x);
	
	// make sure the methods were also cloned
	test.equals('bla', o2.getBla());

	// test onlyContent flag of clone
	o2 = jsein.clone(o, true);
	test.equals('undefined', typeof o2.getBla);
	
	test.done();
};

exports.testGetClass = function(test) {
	function some() {};
	var o = new some(),
		notO = 123;
	test.equals('some', jsein.getClass(o));
	
	// getClass on non-object causes exception
	test.throws(function(){jsein.getClass(notO);});

	test.done();
};

exports.testRecover = function(test) {
	var data = {message: 'hello', _t: 'Error'};
	var o = jsein.recover(data);
	test.equals('hello', o.message);
	test.equals('Error', o.name);
	test.done();
};

exports.testCtorLocators = function(test) {
	var tmp = jsein.ctorLocators;
	jsein.ctorLocators = [];
	jsein.registerCtorLocator(require('../../data/CtorLocator'));
	var data = {some: 'world', _t: 'Thing'};
	var o = jsein.recover(data);
	
	test.equals('world', o.some);
	test.ok(o.location);
	
	jsein.ctorLocators = tmp;
	
	test.done();
};

exports.testRecoverArray = function(test) {
	var jsonSrc = '{"a" : [{"b":5, "c":"hello"}]}';
	var o = jsein.parse(jsonSrc);
	test.ok(Array.isArray(o.a));
	test.done();
};

exports.testParseFloat = function(test) {
	test.equal(0, jsein.parseFloat(undefined));
	
	test.equal(1.654, jsein.parseFloat(1.654));
	
	var rand = jsein.parseFloat({min: -10, max: 5});
	test.ok(rand > -10);
	test.ok(rand < 5);
	
	test.done();
};
