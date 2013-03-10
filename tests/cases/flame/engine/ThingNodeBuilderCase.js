var tests = require('../../../bootstrap'),
	path = tests.projectPath,
	geo = require('pointExtension'),
	ccp = geo.ccp,
	flame = require('flame'),
	ThingNodeBuilder = flame.engine.ThingNodeBuilder,
	jsein  = require('jsein'),
	defs = new jsein.JsonRepo(require(tests.testsPath + '/data/test_defs'));

exports.testEnvisionStretcher = function(test) {
	var protagonist = flame.mock.makeProtagonist(),
		nb = new ThingNodeBuilder(protagonist.viewport, defs),
		s = new flame.entity.Stretcher('ZepSelf'),
		t1 = new flame.entity.Thing(),
		t2 = new flame.entity.Thing();

	t1.location = ccp(2,3);
	t2.location = ccp(8,7);
	s.stretch = {start: {thing: t1, anchor: {point: ccp(0,0)}},
			     end: {thing: t2, anchor: {point: ccp(0,0)}}};

	nb.envision(s);
	
	test.done();
};
