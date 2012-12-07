"use strict";

var
    geo    = require('geometry'),
    smog   = require('smog'),
    config = smog.app.config,
    ccp    = geo.ccp;
/**
 * Used as a structured container for visual elements; encapsulates node factory and layers
 * @param NodeFactory nodeFactory
 * @param Director director
 */
function Viewport(nodeFactory, director) {
	Viewport.superclass.constructor.call(this);
	this.director = director;
	this.nf = nodeFactory;

	this.far = this.nf.makeNode();
	this.scrolled = this.nf.makeNode();
	this.hud = this.nf.makeNode();
	
	this.size = director.winSize;
	this.cameraAnchor = ccp(this.size.width/2, this.size.height/2);
	
	this.bg = this.nf.makeNode(); this.scrolled.addChild(this.bg);
	this.obstacle = this.nf.makeNode(); this.scrolled.addChild(this.obstacle);
	this.main = this.nf.makeNode(); this.scrolled.addChild(this.main);
	this.stuff = this.nf.makeNode(); this.scrolled.addChild(this.stuff);
	this.targets = this.nf.makeNode(); this.scrolled.addChild(this.targets);
}

Viewport.inherit(Object, {
	addLayersTo: function(layer) {
		layer.addChild(this.far);
		layer.addChild(this.scrolled);
		layer.addChild(this.hud);
	},
	moveCameraTo: function(point) {
		this.scrolled.position = geo.ccpAdd(ccp(-point.x,-point.y), this.cameraAnchor);
	}
});

module.exports = Viewport;