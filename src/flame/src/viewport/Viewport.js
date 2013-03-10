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
	this.viewport = null;
	this.soundPlayer = null;
	
	Viewport.superclass.constructor.call(this);
	
	this.scale = 1;
	
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
	
	// where does the camera look at
	this.point = ccp(0, 0);
	
	// main cocos2d layer, see addLayersTo()
	this.layer = null;
}

Viewport.inherit(Object, {
	makeAnimator: function() {
		var Animator = require('./Animator');
		this.animator = new Animator(this.nf, config);
	},

	addLayersTo: function(layer) {
		layer.addChild(this.far);
		layer.addChild(this.scrolled);
		layer.addChild(this.hud);
		
		this.layer = layer;
	},
	
	moveCameraTo: function(point, duration) {
		if (!duration) duration = 0;
		this.point = point;
		var position = geo.ccpAdd(geo.ccpMult(ccp(-point.x,-point.y), this.scale), this.cameraAnchor);
		if (!duration || !this.animator) {
			this.scrolled.position = position;
		} else {
			this.animator.moveTo(this.scrolled, position, duration);
		}
	},
	
	/**
	 * creates zoom camera effect
	 * @param scale
	 * @param duration in seconds
	 */
	scaleCameraTo: function(scale, duration) {
		this.scale = scale;
		if (!duration) duration = 0;
		if (this.animator) {
			this.animator.scaleTo(this.scrolled, scale, duration);
		}
	},
	
	/**
	 * shortcut and wrapper for checking if soundPlayer is set
	 * if overridden, you can add filtering by location
	 * @param soundId
	 */
	play: function(soundId, location) {
		if (this.soundPlayer) {
			this.soundPlayer.play(soundId);
		}
	}
});

module.exports = Viewport;