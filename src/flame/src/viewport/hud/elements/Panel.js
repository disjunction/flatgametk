"use strict";
var
	geo         = require('pointExtension'),
	ccp         = geo.ccp;

/**
 * opts:
 * * node
 * 
 * @param opts
 */
function Panel(opts) {
	this.node = opts.node;
	this.elements = {};
	this.shiftX = 10;
	this.shiftY = 10;
}

Panel.inherit(Object, {
	get mySize() {
		if (this.size) return this.size;
		if (this.node && this.node._boundingBox) {
			return this.node._boundingBox.size;
		}
		return {width:0, height:0};
	},
	
	positionNode: function(node, position) {
		if (!position) {
			position = {point: ccp(this.shiftX, this.shiftY)};
		}
		if (position.point) {
			node.position = ccp(position.point.x, this.mySize.height - position.point.y);
		}
	},
	addElement: function(name, element, position) {
		this.elements[name] = element;
		var target = typeof element.node == 'undefined'? element : element.node;
		
		this.positionNode(target, position);
		
		this.node.addChild(target);
	}
});

module.exports = Panel;