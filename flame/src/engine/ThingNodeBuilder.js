"use strict";

var
    geo      = require('pointExtension'),
    ccp      = geo.ccp,
    smog     = require('smog'),
    config   = smog.app.config,
    flame    = require('flame'),
    Idealist = smog.util.Idealist,
    box2d     = require('box2d');

function ThingNodeBuilder(viewport, defRepo) {
	this.viewport = viewport;
	this.defRepo = defRepo;
}

ThingNodeBuilder.prototype.makeNodeByDef = function(nodeDef) {
	if (nodeDef.type == 'sprite') {
		var node = this.viewport.nf.makeSprite(nodeDef.opts);
		return node;
	}
	
	throw new Error('unknown node type ' + nodeDef.type);
};

ThingNodeBuilder.prototype.envision = function(thing) {
	var def = this.defRepo.get(thing.type);
	if (!def) {
		throw new Error('no def for thing ' + thing.type);
	}
	if (!def.nodes) {
		throw new Error('no def.nodes for thing ' + thing.type);
	}
	for (var k in def.nodes) {
		var nodeDef = def.nodes[k],
		    node = this.makeNodeByDef(nodeDef);
		
		node.position = geo.ccpMult(thing.location, config.ppm);
		thing.nodes[k] = node;
		
		var viewportLayer;
		if (nodeDef.layer) {
			viewportLayer = nodeDef.layer;
		} else if (this.viewport[k]) {
			viewportLayer = k;
		} else {
			throw new Error('cannot find appropriate viewport layer for node ' + k + ' in thing ' + thing.type);
		}
		
		this.viewport[viewportLayer].addChild(node);
	}
};

module.exports = ThingNodeBuilder;
