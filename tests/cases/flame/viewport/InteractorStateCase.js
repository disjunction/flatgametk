var path = require('../../../bootstrap').projectPath,
	flame = require('flame'),
	InteractorState = flame.viewport.InteractorState;

exports.testOnOff = function(test) {
	var s = new InteractorState();
	s.on('up');
	test.ok(s.changed);
	test.ok(s.up);

	s.changed = 0;
	s.on('up');
	test.ok(!s.changed);
	s.off('up');
	test.ok(s.changed);
	test.ok(!s.up);

	test.done();
};
