"use strict";

var
    geo      = require('pointExtension'),
    ccp      = geo.ccp,
    smog     = require('smog'),
    config   = smog.app.config,
    flame    = require('flame'),
    Idealist = smog.util.Idealist,
    box2d    = require('box2d'),
	jsein    = require('jsein');

function ThingNodeBuilder(viewport, defRepo) {
	this.viewport = viewport;
	this.defRepo = defRepo;
}

/**
 * wrapper for atomicAnimateNode with animator verification and multiple action support
 * @param node
 * @param animateDef
 * @param Node|Layer layer - optional, needed only if node.layer is empty
 */
ThingNodeBuilder.prototype.animateNode = function(node, animateDef, layer) {
	if (!this.viewport.animator) return;
	
	if (Array.isArray(animateDef)) {
		for (var i in animateDef) {
			this.animateNodeAttomic(node, animateDef[i], layer);
		}
	} else {
		this.animateNodeAttomic(node, animateDef, layer);
	}
};

ThingNodeBuilder.prototype.animateNodeAttomic = function(node, animateDef, layer) {
	if (!layer && node.layer) {
		layer = this.viewport[node.layer];
	}
	
	if (animateDef.action == 'Remove') {
		if (!animateDef.delay) {
			throw new Error('Remove action requires param "delay"');
		}
		
		this.viewport.animator.remove(node, animateDef.delay, layer);
		if (animateDef.removeThing) {
			// just to guarantee it happens after node removal + 0.1
			node.removeThing = {delay: animateDef.delay + 0.1};
		}
		return;
	}
	this.viewport.animator.animateNode(node, animateDef);
};

ThingNodeBuilder.prototype.makeNodeByDef = function(nodeDef) {
	var node = false;
	if (!nodeDef.type  || nodeDef.type == 'sprite') {
		node = this.viewport.nf.makeSprite(nodeDef.opts);
	}

	if (nodeDef.type == 'animatedSprite') {
		node = this.viewport.nf.makeAnimatedSprite(nodeDef.opts);
	}
	
	if (!node) throw new Error('unknown node type ' + nodeDef.type);
	return node;
};

ThingNodeBuilder.prototype.envisionNodeByDef = function(nodeDef, nodeName, thing) {
	if (thing.scale) {
		nodeDef = jsein.clone(nodeDef);
		nodeDef.opts.scale = thing.scale;
	}
	var node = this.makeNodeByDef(nodeDef);

	node.position = geo.ccpMult(thing.location, config.ppm);
	thing.nodes[nodeName] = node;
	
	// layer name in viewport array, needed for future removal, see sestroyNodes()
	var viewportLayer;
	
	if (nodeDef.layer) {
		viewportLayer = nodeDef.layer;
	} else if (this.viewport[nodeName]) {
		viewportLayer = nodeName;
	} else {
		throw new Error('cannot find appropriate viewport layer creating node ' + nodeName + ' in thing ' + thing.type);
	}
	
	node.layer = viewportLayer;
	this.viewport[viewportLayer].addChild(node);
	
	if (node.autoaction) {
		node.runAction(node.autoaction);
	}
	if (nodeDef.animate) {
		this.animateNode(node, nodeDef.animate, this.viewport[viewportLayer]);
	}
	return node;
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
		var node = this.envisionNodeByDef(def.nodes[k], k, thing);
		if (node.removeThing) {
			thing.removeThing = node.removeThing;
		}
	}
};

ThingNodeBuilder.prototype.destroyNodes = function(thing) {
	for (var k in thing.nodes) {	
		var viewportLayer;
		if (thing.nodes[k].layer) {
			viewportLayer = thing.nodes[k].layer;
		} else if (this.viewport[k]) {
			viewportLayer = k;
		} else {
			throw new Error('cannot find appropriate viewport layer removing node ' + k + ' in thing ' + thing.type);
		}
		
		this.viewport[viewportLayer].removeChild(thing.nodes[k]);
	}
	thing.nodes = {};
};

module.exports = ThingNodeBuilder;
