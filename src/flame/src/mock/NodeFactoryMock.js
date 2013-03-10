var
    NodeMock = require('./NodeMock'),
	jsein = require('jsein');

function NodeFactoryMock() {
}

NodeFactoryMock.inherit(Object, {
	_cloneOpts: function(opts, type) {
		if (!opts) opts = {};
		var newOpts = jsein.clone(opts);
		newOpts.nodeType = 'node';
		return newOpts;
	},
	makeNode: function(opts) {
		opts = this._cloneOpts(opts, 'node');
		return new NodeMock(opts);
	},
    makeAnimatedSprite: function(opts) {
		return this.makeSprite(opts);
	},
	makeSprite: function(opts) {
		opts = this._cloneOpts(opts, 'sprite');
		return new NodeMock(opts);
	},
	makeMap: function(opts) {
		opts = this._cloneOpts(opts, 'map');
		return new NodeMock(opts);
	},
	makeLabel: function(opts) {
		opts = this._cloneOpts(opts, 'label');
		return new NodeMock(opts);
	}
});

module.exports = NodeFactoryMock;
