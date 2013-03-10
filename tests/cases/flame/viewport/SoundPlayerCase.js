var path = require('../../../bootstrap').projectPath,
	smog = require('smog'),
	flame = require('flame');

exports.testPlay = function(test) {
	var opts = {
			'AudioFactoryClass': flame.mock.AudioFactoryMock
		},
		sp = flame.viewport.SoundPlayer.make(opts);
	
	sp.createSound('some.ogg');
	sp.play('some.ogg');
	test.done();
};
