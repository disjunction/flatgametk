"use strict";

var Protagonist = require('../engine/Protagonist'),
	NodeMock =  require('./NodeMock'),
	NodeFactoryMock =  require('./NodeFactoryMock'),
	DirectorMock =  require('./DirectorMock'),
	AudioFactoryMock =  require('./AudioFactoryMock');

exports.makeProtagonist = function(ProtagonistClass) {
	var opts = {
			'NodeFactoryClass': exports.NodeFactoryMock,
			'director': new exports.DirectorMock(),
			'ProtagonistClass': ProtagonistClass? ProtagonistClass : Protagonist
		};
	return Protagonist.make(opts);
};

exports.NodeMock = NodeMock; 
exports.NodeFactoryMock = NodeFactoryMock;
exports.DirectorMock = DirectorMock;
exports.AudioFactoryMock = AudioFactoryMock;