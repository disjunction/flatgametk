var path = require('../../../bootstrap').projectPath,
	geo = require('pointExtension'),
	flame = require('flame');


exports.testSquare = function(test) {
	var m = new flame.entity.Movable;
	
	m.size = new geo.sizeMake(2, 5);
	test.equal(10, m.square);
	
	test.done();
};

exports.testNodes = function(test) {
	var m = new flame.entity.Movable;
	
	m.nodes.a = 'some';
	test.equal('some', m.nodes.a);

	test.done();
};


