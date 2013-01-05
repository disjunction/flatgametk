"use strict";

var
    geo      = require('pointExtension'),
    ccp      = geo.ccp,
    smog     = require('smog'),
    config   = smog.app.config,
    flame    = require('flame'),
    Idealist = smog.util.Idealist,
    box2d     = require('box2d');

function Protagonist(viewport) {
	this.fe = null;
	this.ego = null;
	this.viewport = viewport;
	this.cameraPoint = ccp(0,0);
}

Protagonist.prototype.location2position = function(location) {
	return geo.ccpMult(location, config.ppm);
};

Protagonist.prototype.setFieldEngine = function(fe) {
	this.fe = fe;
};

Protagonist.prototype.syncCamera = function() {
	var body = this.fe.get(this.ego.bodyId);
	if (body) {
		this.cameraPoint = this.location2position(body.GetPosition());
	}
	this.viewport.moveCameraTo(this.cameraPoint);
};

/**
 * another fat factory with all injections configurable
 * 
 * @param opts
 * * NodeFactoryClass: ctor
 * * config: object
 * * director: Director (cocs2d)
 * * ViewportClass: class
 * 
 * @returns Protagonist
 */
Protagonist.make = function(opts) {
	if (!opts) opts = {};
	
	var
		nfClass = opts['NodeFactoryClass']? opts['NodeFactoryClass'] : require(flame.srcPath + '/NodeFactory'),
	    config = opts['config']? opts['config'] : smog.app.config,
	    nf = new nfClass(config),
	    director = opts['director']? opts['director'] : require('cocos2d').Director.sharedDirector,
	    viewportClass = opts['ViewportClass']? opts['ViewportClass'] : flame.viewport.Viewport,
	    viewport = new viewportClass(nf, director),
	    protagonistClass = opts['ProtagonistClass']? opts['ProtagonistClass'] : flame.engine.Protagonist;
	
	return new protagonistClass(viewport);
};


module.exports = Protagonist;