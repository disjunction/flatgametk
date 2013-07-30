"use strict";

var
    geo      = require('pointExtension'),
    ccp      = geo.ccp,
    smog     = require('smog'),
    config   = smog.app.config,
    flame    = require('flame'),
    Idealist = smog.util.Idealist,
	jsein    = require('jsein');

/**
 * builds visual nodes according to visualization definitions (defRepo),
 * encapsulates viewport so that game models don't have this dependency (except for Protagonist)
 * 
 * @param viewport
 * @param defRepo
 */
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

/**
 * animates given node according to animateDef
 * @param node
 * @param animateDef
 * @param Node|Layer layer - optional, needed only if node.layer is empty
 */
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

/**
 * @param nodeDef
 * @returns Node|false
 */
ThingNodeBuilder.prototype.makeNodeByDef = function(nodeDef) {
	var node = false;
	if (!nodeDef.type  || nodeDef.type == 'sprite') {
		node = this.viewport.nf.makeSprite(nodeDef.opts);
	}

	if (nodeDef.type == 'label') {
		node = this.viewport.nf.makeLabel(nodeDef.opts);
	}
	
	if (nodeDef.type == 'animatedSprite') {
		node = this.viewport.nf.makeAnimatedSprite(nodeDef.opts);
	}
	
	if (!node) throw new Error('unknown node type ' + nodeDef.type);
	return node;
};

ThingNodeBuilder.prototype.placeNode = function(node, location) {
	node.position = geo.ccpMult(location, config.ppm);
};

/**
 * common case for simple single-node objects - create and envision node for given thing
 * 
 * this is handy for creating particles, such as snow, explosions etc.
 * 
 * @param nodeDef
 * @param nodeName
 * @param thing
 * @returns Node
 */
ThingNodeBuilder.prototype.envisionNodeByDef = function(nodeDef, nodeName, thing) {
	if (thing.scale) {
		nodeDef = jsein.clone(nodeDef);
		nodeDef.opts.scale = thing.scale;
	}
	var node = this.makeNodeByDef(nodeDef);
	if (!node) {
	    throw new Error('cant envison non-creatable node');
	}
	
	this.placeNode(node, thing.location);
	thing.nodes[nodeName] = node;
	
	// layer name in viewport array, needed for future removal, see destroyNodes()
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

/**
 * special initialization for Stretcher things (ropes, lasers)
 * @param Sretcher thing
 * @param node
 */
ThingNodeBuilder.prototype.stretchScaleRotate = function(thing, node) {
	if (!node.initialSize) {
		// size  has to be clone, otherwise we don't know how to resize each time
		node.initialSize = jsein.clone(node._boundingBox.size);
	}
	var angle = Math.atan2(thing.endLocation.y - thing.startLocation.y, thing.endLocation.x - thing.startLocation.x),
		distance = geo.ccpDistance(thing.startLocation, thing.endLocation);
	node.scaleX = distance * config.ppm / node.initialSize.width;
	node.rotation = geo.radiansToDegrees(-angle);
};

/**
 * helper method for stretcher movement
 * @param Stretcher thing
 * @param node
 */
ThingNodeBuilder.prototype.stretchPlaceNode = function(thing, node) {
	this.placeNode(node, thing.middleLocation);
};

/**
 * commonly used wrapper around ::stretchScaleRotate()
 * @param Stretcher thing
 * @param node
 */
ThingNodeBuilder.prototype.stretchUpdateNode = function(thing, node) {
	thing.location = thing.middleLocation;
	this.stretchScaleRotate(thing, node);
};

/**
 * initialization for composite stretchers
 * @param thing
 */
ThingNodeBuilder.prototype.stretch = function(thing) {
	for (var key in thing.nodes) {
		this.stretchUpdateNode(thing, thing.nodes[key]);
	}
};

/**
 * common wrapper for ::envisionNodeByDef() with implicit definition resolve
 * @param thing
 */
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
	if (thing.stretch) {
		this.stretch(thing);
	}
};

/**
 * destroys all nodes for given thing
 * 
 * placed here as it has a strong logical connection to node creation
 * @param thing
 */
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
