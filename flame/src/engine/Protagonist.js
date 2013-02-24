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
	fe.config = this.config;

	if (fe.isVisual) {
		fe.injectViewport(this.viewport);
	}
	
	if (this.ego) {
		this.fe.setEgo(this.ego);
	}
};

Protagonist.prototype.setLayer = function(layer) {
	this.viewport.addLayersTo(layer);
};

Protagonist.prototype.setEgo = function(ego) {
	this.ego = ego;
	
	// the following duplicates functionality in setFieldEngine, 
	// but it's fine since there is no preferred order between ego and fe
	if (this.fe) {
		this.fe.setEgo(this.ego);
	}
};

/**
 * normally you just need to provide soundRepo,
 * protagonist will create and set up sound player for you
 * @param jsein.JsonRepo soundRepo
 */
Protagonist.prototype.setSoundRepo = function(soundRepo) {
	this.viewport.soundPlayer = flame.viewport.SoundPlayer.make({soundRepo: soundRepo, config: this.config});
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
	
	var config = opts.config;
	if (!config) {
		config = opts.fieldEngine? opts.fieldEngine.config : smog.app.config;
	}
	
	var
		nfClass = opts['NodeFactoryClass']? opts['NodeFactoryClass'] : require(flame.srcPath + '/NodeFactory'),
	    nf = new nfClass(config),
	    director = opts['director']? opts['director'] : require('cocos2d').Director.sharedDirector,
	    viewportClass = opts['ViewportClass']? opts['ViewportClass'] : flame.viewport.Viewport,
	    viewport = new viewportClass(nf, director),
	    protagonistClass = opts['ProtagonistClass']? opts['ProtagonistClass'] : flame.engine.Protagonist,
	    p = new protagonistClass(viewport);
	    
	p.config = config;

	if (opts.fieldEngine) {
		p.setFieldEngine(opts.fieldEngine);
	}
	
	if (opts.layer) {
		p.setLayer(opts.layer);
	}
	
	if (opts.ego) {
		p.setEgo(opts.ego);
	}
	
	return p;
};


module.exports = Protagonist;