var
    NodeMock = require('./NodeMock'),
	jsein = require('jsein');

function NodeFactoryMock() {
}

NodeFactoryMock.inherit(Object, {
	makeNode: function(opts) {
		if (!opts) opts = {};
		var newOpts = jsein.clone(opts);
		newOpts.nodeType = 'node';
		return new NodeMock(newOpts);
	},
    makeAnimatedSprite: function(opts) {
		return this.makeSprite(opts);
	},
	makeSprite: function(opts) {
		if (!opts) opts = {};
		var newOpts = jsein.clone(opts);
		newOpts.nodeType = 'sprite';
		return new NodeMock(newOpts);
	},
	makeMap: function(opts) {
		if (!opts) opts = {};
		var newOpts = jsein.clone(opts);
		newOpts.nodeType = 'map';
		return new NodeMock(newOpts);
	},
});

module.exports = NodeFactoryMock;
