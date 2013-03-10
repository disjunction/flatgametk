"use strict";

var
    EventDispatcher = require('EventDispatcher'),
    geo    = require('pointExtension'),
    ccp    = geo.ccp;

/**
 * opts:
 * * viewport
 * 
 * @param Object opts
 */
function HudObserver(opts) {
	this.viewport = opts.viewport;
	
	HudObserver.superclass.constructor.call(this);
	
	if (this.propertyListener) {
		this.addListener('property', this.propertyListener.bind(this));
	}	
}

HudObserver.inherit(EventDispatcher, {
	/**
	 * shorter signature
	 */
	dispatchProperty: function(subj, property, oldValue, newValue) {
		this.dispatch({type: 'property',
					   subj: subj,
					   property: property,
					   oldValue: oldValue,
					   newValue: newValue});
	},

	/**
	 * define this if you want to react to property changes, called via Thing.setter
	 * @param event
	 */
	propertyListener: false
});

module.exports = HudObserver;