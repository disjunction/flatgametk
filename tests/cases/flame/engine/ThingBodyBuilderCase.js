var tests = require('../../../bootstrap'),
	geo = require('pointExtension'),
	smog = require('smog'),
	flame = require('flame'),
	jsein = require('jsein');

exports.testMakeFixture = function(test) {
	var
		defs = new jsein.JsonRepo(require(tests.testsPath + '/data/test_defs')),
		fe = flame.engine.FieldEngine.make({defRepo: defs});
		f = fe.bodyBuilder.makeFixtureDef(defs.get('ZepSelf').body.fixtures.main);

	test.equal(0.3, f.restitution);
	test.done();
};

exports.testMakeBodyByDef = function(test) {
	var
		defs = new jsein.JsonRepo(require(tests.testsPath + '/data/test_defs')),
		fe = flame.engine.FieldEngine.make({defRepo: defs}),
		b = fe.bodyBuilder.makeBodyByDef(defs.get('ZepSelf').body);
	test.done();
};

exports.testEmbody = function(test) {
	var
		defs = new jsein.JsonRepo(require(tests.testsPath + '/data/test_defs')),
		fe = flame.engine.FieldEngine.make({defRepo: defs}),
		t = new flame.entity.Thing();
	
	t.type = 'ZepSelf';
	t.location = geo.ccp(5,7);
	var b = fe.bodyBuilder.embody(t);
	
	test.equal(7, b.GetPosition().y);
	test.done();
};