var path = require('../../../../bootstrap').projectPath,
	flame = require('flame'),
	HudBuilder = flame.viewport.hud.HudBuilder;

exports.testGenericEvents = function(test) {
	var protagonist = flame.mock.makeProtagonist(),
		hb = new HudBuilder(protagonist.viewport, {});

	test.ok(hb.viewport);
	
	var panel = hb.makePanel({sprite: {}});
	
	test.done();
};
