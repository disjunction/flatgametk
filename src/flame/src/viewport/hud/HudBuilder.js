"use strict";

var
    geo      = require('pointExtension'),
    ccp      = geo.ccp,
    Panel    = require('./elements/Panel');

function HudBuilder(viewport, defRepo) {
	this.viewport = viewport;
	this.defRepo = defRepo;
}

HudBuilder.inherit(Object, {
	/**
	 * opts:
	 * * sprite: nf def
	 * @param opts
	 */
	makePanel: function(opts) {
		var node;
		if (opts.node) {
			node = this.viewport.nf.makeNode(opts);
		} else if (opts.sprite) {
			node = this.viewport.nf.makeSprite(opts.sprite);
		} else {
			throw new Error('makePanel requires node or sprite option in opts');
		}
		
		node.anchorPoint = ccp(0,1);
		opts.node = node;
		
		return new Panel(opts);
	},
	
	getSize: function(element) {
		if (element.size) return this.size;
		if (element._boundingBox) {
			return element._boundingBox.size;
		}
		if (element.node && element.node._boundingBox) {
			return element.node._boundingBox.size;
		}
		return {width:0, height:0};
	}
});

module.exports = HudBuilder;