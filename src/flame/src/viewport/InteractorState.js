"use strict";

function InteractorState(){
	this._c = 1;
}

InteractorState.inherit(Object, {
	// this is used to disable any keypress processing
	_enabled: true,
	get enabled() {return this._enabled;},
	set enabled(v) {
		if (!v && this._enabled) {
			// disabled whatever was on
			for (var key in this) {
				if (key.substr(0, 1) == '_') continue;
				if (typeof this[key] != 'function') {
					this.off(key);
				}
			}
		}
		this._enabled = v;
	},
	
	on: function(key) {
		if (!this[key]) this.changed = 1;
		this[key] = 1;
	},
	off: function(key) {
		if (this[key]) this.changed = 1;
		delete this[key];
	},
	
	get changed() {return this._c;},
	set changed(v) {
		this._c = v;
	}
});

module.exports = InteractorState;