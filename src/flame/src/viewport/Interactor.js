"use strict";

var jsein = require('jsein'),
	InteractorState = require('./InteractorState');


/**
 * opts.layer - cocs2d.nodes.Layer to bind to
 * opts.applier - see ProtagonistApplier below 
 * opts.layout = {
 *     keys: {
 *     		// up
 *          38: { 
 *          	type: 'state',
 *              state: 'up'
 *          },
 *          
 *          // space
 *          32: {
 *          	type: 'event',
 *          	on: 'keyUp',
 *              event: 'shoot'
 *          }
 *     }
 * }
 */
function Interactor(opts){
	this.state = new InteractorState();
	if (opts.applier) {
		this.applier = opts.applier;
	}
	this.layout = (opts.layout)? opts.layout : {keys: {}};
	
	if (opts.layer) {
		this.bindToLayer(opts.layer);
	}
}

Interactor.inherit(Object, {
	bindToLayer: function(layer) {
		if (this.keyUp) {
		    layer.isKeyboardEnabled = true;
			layer.keyUp = this.keyUp.bind(this);
		}
		if (this.keyDown) {
		    layer.isKeyboardEnabled = true;
			layer.keyDown = this.keyDown.bind(this);
		}
		if (this.mouseDown) {
		    layer.isMouseEnabled = true;
			layer.mouseDown = this.mouseDown.bind(this);
		}
		if (this.mouseUp) {
		    layer.isMouseEnabled = true;
			layer.mouseUp = this.mouseUp.bind(this);
		}
	},
	processKey: function(evt, type, on, key) {
		if (!this.state.enabled) return;
		
		switch (key.type) {
		case 'state':
			var stateCode = key.state;
			on? this.state.on(stateCode) : this.state.off(stateCode);
			break;
		case 'event':
			if (key.on == type)
				if (this.applier) this.applier.applyEvent(evt, key.event);
			break;
		default:
			throw new Error('unknown layout entry type for key ' + evt.keyCode);
		}
	},
	processEvent: function(evt, type, on) {		
		var code = evt.keyCode;
		
		// if it's not keyboard but a mouse
		if (typeof evt.button != 'undefined') {
			code = (evt.button == 2)? Interactor.RMB : Interactor.LMB;
		}
		
		for (var keyCode in this.layout.keys) {
			if (code == keyCode) {
				
				// if key contains an array, then try to execute all of them
				if (Array.isArray(this.layout.keys[code])) {
					for (var i in this.layout.keys[code]) {
						this.processKey(evt, type, on, this.layout.keys[code][i]);
					}
				// else there is only single operation 
				} else {
					this.processKey(evt, type, on, this.layout.keys[code]);
				}
			}
		}
		this.afterInteract(evt);
	},
	
	keyDown: function(evt) {
		this.processEvent(evt, 'keyDown', true);
	},
	
	keyUp: function(evt) {
		this.processEvent(evt, 'keyUp', false);
	},
	mouseDown: function(evt) {
		this.processEvent(evt, 'mouseDown', true);
	},
	mouseUp: function(evt) {
		this.processEvent(evt, 'mouseUp', false);
	},
	
	afterInteract: function(evt) {
		if (this.state.changed && this.applier) {
			this.applier.applyState(this.state);
		}
		this.state.changed = 0;
	}
	
});

var keyMap = {
	ARROW_LEFT: 37,
	ARROW_UP: 38,
	ARROW_RIGHT: 39,
	ARROW_DOWN: 40,
	
	KEY_A: 65,
	KEY_B: 66,
	KEY_C: 67,
	KEY_D: 68,
	KEY_E: 69,
	KEY_F: 70,
	KEY_G: 71,
	KEY_H: 72,
	KEY_I: 73,
	KEY_J: 74,
	KEY_K: 75,
	KEY_L: 76,
	KEY_M: 77,
	KEY_N: 78,
	KEY_O: 79,
	KEY_P: 80,
	KEY_Q: 81,
	KEY_R: 82,
	KEY_S: 83,
	KEY_T: 84,
	KEY_U: 85,
	KEY_V: 86,
	KEY_W: 87,
	KEY_X: 88,
	KEY_Y: 89,
	KEY_Z: 95,
	
	SPACE: 32,
	
	LMB: 1001,
	RMB: 1002
};
for (var i in keyMap) {
	Interactor[i] = keyMap[i];
}

//// PROTAGONIST APPLIER

Interactor.ProtagonistApplier = function(opts) {
	this.p = opts.protagonist;
};

Interactor.ProtagonistApplier.prototype.applyState = function(state) {
	this.p.ego.state = state;
};

Interactor.ProtagonistApplier.prototype.applyEvent = function(evt, defEvent) {
	console.log('untracked event: ' + defEvent);
};

module.exports = Interactor;
