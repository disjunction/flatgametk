"use strict";

var
	Thing  = require('./Thing'),
    geo    = require('pointExtension'),
    ccp    = geo.ccp;

/**
 * visual thing, binding 2 other things
 */
function Stretcher(opts) {
	Stretcher.superclass.constructor.call(this, opts);
}

Stretcher.inherit(Thing, {
	nobody: true,
	
	// this tells default FieldEngine to support actual state of the stretcher
	group: 'stretcher',
	
	stretch: {
		method: 'scale',
		start: {
			thing: null,
			anchor: {point: ccp(0,0)},
			follow: true
		},
		end: {
			thing: null,
			anchor: {point: ccp(0,0)},
			follow: true
		},
	},
	
	_getAnchorLocation: function(thing, anchor) {
		return anchor? geo.ccpAdd(thing.location, anchor.point) : thing.location;
	},
	
	get startLocation() {
		return this._getAnchorLocation(this.stretch.start.thing, this.stretch.start.anchor);
	},
	
	get endLocation() {
		return this._getAnchorLocation(this.stretch.end.thing, this.stretch.end.anchor);
	},
	
	get middleLocation() {
		return geo.ccp((this.startLocation.x + this.endLocation.x) / 2,
					   (this.startLocation.y + this.endLocation.y) / 2);
	}
});

module.exports = Stretcher;
