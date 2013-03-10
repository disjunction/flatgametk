var path = require('../bootstrap').projectPath,
	smog = require('smog'),
	flame = require('flame');


exports.testHello = function(test) {
	var player = new smog.entity.Player,
		config = smog.app.config,
		t = new flame.entity.Thing;
	
	test.ok(config.ppm > 1);
		
	test.done();
};
