var
    geo    = require('geometry'),
    ccp    = geo.ccp;

function NodeMock(opts) {
	this.children = [];
	this.actions = [];
	
	// this will allow checking which options were used in node factory
	this.mockOpts = opts;
}

NodeMock.inherit(Object, {
	addChild: function(o) {
		this.children.push(o);
	},
	runAction: function(o) {
		this.actions.push(o);
	},
	_boundingBox: {
		size: {
			width: 70,
			height: 40
		}
	}
});

module.exports = NodeMock;