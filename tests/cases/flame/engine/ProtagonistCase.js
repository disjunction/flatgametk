var tests = require('../../../bootstrap'),
	path = tests.projectPath,
	flame = require('flame'),
	geo = require('pointExtension'),
	ccp = geo.ccp,
	Protagonist = flame.engine.Protagonist,
	FieldEngine = flame.engine.FieldEngine;

exports.testMakeWithoutField = function(test) {
	var opts = {
			'NodeFactoryClass': flame.mock.NodeFactoryMock,
			'director': new flame.mock.DirectorMock(),
			'ProtagonistClass': flame.engine.Protagonist
		};
	test.ok(Protagonist.make(opts));
	test.done();
};

exports.testMakeWithFieldEngine = function(test) {
	var fe = FieldEngine.make();
	var opts = {
			'NodeFactoryClass': flame.mock.NodeFactoryMock,
			'director': new flame.mock.DirectorMock(),
			'ProtagonistClass': flame.engine.Protagonist,
			'fieldEngine': fe
		};
	test.ok(Protagonist.make(opts));
	test.done();
};

exports.testMakeWithEgo = function(test) {
	var ego = new flame.entity.Thing();
	var opts = {
			'NodeFactoryClass': flame.mock.NodeFactoryMock,
			'director': new flame.mock.DirectorMock(),
			'ProtagonistClass': flame.engine.Protagonist,
			'ego': ego
		};
	test.ok(Protagonist.make(opts));
	test.done();
};

exports.testMakeWithEgoAndFieldEngine = function(test) {
	var ego = new flame.entity.Thing(),
		fe = FieldEngine.make();
	var opts = {
			'NodeFactoryClass': flame.mock.NodeFactoryMock,
			'director': new flame.mock.DirectorMock(),
			'ProtagonistClass': flame.engine.Protagonist,
			'ego': ego,
			'fieldEngine': fe
		};
	test.ok(Protagonist.make(opts));
	test.done();
};
