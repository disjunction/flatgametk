"use strict";

var
    geo    = require('pointExtension'),
    smog   = require('smog'),
    config = smog.app.config,
    ccp    = geo.ccp;

/**
 * @param mixed opts
 */
function Thing(opts) {
	if (typeof opts == 'string') {
		this.type = opts;
	}
	
	Thing.superclass.constructor.call(this);
	this._l = ccp(0,0);
	this._a = 0;
	this.ac = true; // shows angle changed (recalc needed)
	this.nodes = {};
}

Thing.inherit(Object, {
	get location() {return this._l;},
	set location(v) {
		this._l = v;
		for (var key in this.nodes) {
			this.nodes[key].position = geo.ccpMult(v, ccp(config.ppm, config.ppm));
		}
	},
	_l: null,
	
	get angle() {return this._a;},
	set angle(v) {
		this._a = v;
		this.ac = true;
		for (var key in this.nodes) {
			this.nodes[key].rotation = geo.radiansToDegrees(-v);
		}
	},
	_a: 0,
	
	_t: '',
	get type() {return this._t;},
	set type(v) {this._t = v;},
	
	syncBody: function(body) {
		body.SetPosition(this.location);
		body.SetAngle(this.angle);
	}
});

module.exports = Thing;