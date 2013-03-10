"use strict";

var Protagonist = require('../engine/Protagonist'),
	FieldEngine = require('../engine/FieldEngine'),
	NodeMock =  require('./NodeMock'),
	NodeFactoryMock =  require('./NodeFactoryMock'),
	DirectorMock =  require('./DirectorMock'),
	AudioFactoryMock =  require('./AudioFactoryMock'),
	jsein = require('jsein');

exports.makeProtagonist = function(ProtagonistClass) {
	var opts = {
			'NodeFactoryClass': exports.NodeFactoryMock,
			'director': new exports.DirectorMock(),
			'ProtagonistClass': ProtagonistClass? ProtagonistClass : Protagonist,
		};
	
	return Protagonist.make(opts);
};

exports.makeProtagonistWithFieldEngine = function(fieldEngine, ProtagonistClass) {
	if (!fieldEngine) {
		fieldEngine = FieldEngine.make({defRepo: new jsein.JsonRepo()});
	}
	var opts = {
			'NodeFactoryClass': exports.NodeFactoryMock,
			'director': new exports.DirectorMock(),
			'ProtagonistClass': ProtagonistClass? ProtagonistClass : Protagonist,
			'fieldEngine': fieldEngine
		};
	
	return Protagonist.make(opts);
};


exports.NodeMock = NodeMock; 
exports.NodeFactoryMock = NodeFactoryMock;
exports.DirectorMock = DirectorMock;
exports.AudioFactoryMock = AudioFactoryMock;