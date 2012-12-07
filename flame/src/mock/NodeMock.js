var
    geo    = require('geometry'),
    ccp    = geo.ccp;

function NodeMock(opts) {
	this.children = [];
	
	// this will allow checking which options were used in node factory
	this.mockOpts = opts;
}

NodeMock.inherit(Object, {
	addChild: function(o) {
		this.children.push(o);
	},
	
});

module.exports = NodeMock;