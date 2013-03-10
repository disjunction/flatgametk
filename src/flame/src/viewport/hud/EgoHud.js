var
    geo         = require('pointExtension'),
    ccp         = geo.ccp,
    HudObserver = require('./HudObserver');

/**
 * opts
 *  * viewport
 *  * ego
 *  * hudBuilder
 * 
 * @param opts
 */
function EgoHud(opts) {
	this.ego = opts.ego;
	this.ego.ed = this; // register itself as event dispatcher for ego thing
	this.hudBuilder = opts.hudBuilder;
	EgoHud.superclass.constructor.call(this, opts);
	
	//make a virtual panel covering entire screen
	this.root = this.hudBuilder.makePanel({
		node: {}
	});
	this.root.size = this.viewport.size;
	this.root.node.position = ccp(0,0);
	this.viewport.hud.addChild(this.root.node);
	
}

EgoHud.inherit(HudObserver, {
	
});

module.exports = EgoHud;