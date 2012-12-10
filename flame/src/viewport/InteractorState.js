"use strict";

function InteractorState(){
	this._c = 1; 
}

InteractorState.inherit(Object, {
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