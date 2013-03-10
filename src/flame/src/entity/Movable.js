"use strict";

var
	Thing  = require('./Thing'),
    geo    = require('pointExtension'),
    ccp    = geo.ccp;

/**
 * encapsulates generic functionality for moving physical body
 */
function Movable(opts) {
	Movable.superclass.constructor.call(this, opts);
}

Movable.inherit(Thing, {
	get size() {return this._s;},
	set size(v) {this._s = v; this.ac = true;},
	_s: null,
	
	get front() {if (this.ac) this.resetFront(); return this._f;},
	set front(v) {throw new Error('use resetFront instead of direct setting it');},
	_f: ccp(0, 0),
	
	get mass() {return this._m;},
	set mass(v) {this._m = v;},
	_m: 1,
	
	resetFront: function() {
		var half = this.size.width / 2;
		this._f.x = half * Math.cos(this.angle);
		this._f.y = half * Math.sin(this.angle);
		this.ac = false;
	},
	
	get rear() {return geo.ccpNeg(this.front);},
	get frontPoint() { return geo.ccpAdd(this.location, this.front);},
	get rearPoint() { return geo.ccpAdd(this.location, this.rear);},
	
	get density() {
		return this.mass / this.square;
	},
	
	get square() {
		return this.size.width * this.size.height;
	},
	set square(v) {throw new Error('cannot set squere, set the size instead');}
});

module.exports = Movable;