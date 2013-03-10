var path = require('../../../bootstrap').projectPath,
	geo = require('pointExtension'),
	ccp = geo.ccp,
	flame = require('flame'),
	Stretcher = flame.entity.Stretcher,
	Thing = flame.entity.Thing;

exports.testBasic = function(test) {
	var s = new Stretcher(),
	    t1 = new Thing(),
	    t2 = new Thing();
	
	t1.location = ccp(2,3);
	t2.location = ccp(8,7);
	
	s.stretch = {start: {thing: t1, anchor: {point: ccp(0,0)}},
				 end: {thing: t2, anchor: {point: ccp(0,0)}}};
	
	var middle = s.middleLocation;
	
	test.equal(5, middle.x);
	test.equal(5, middle.y);
	
	test.done();
};

exports.testBasicNoAnchors = function(test) {
	var s = new Stretcher(),
	    t1 = new Thing(),
	    t2 = new Thing();
	
	t1.location = ccp(2,3);
	t2.location = ccp(8,7);
	
	s.stretch = {start: {thing: t1},
				 end: {thing: t2}};
	var middle = s.middleLocation;
	test.equal(5, middle.y);
	test.done();
};
