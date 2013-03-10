"use strict";

function Webpage(opts) {
	if (!opts) opts = {};
	if (opts.window) {
		this.window = opts.window;
	} else if (window) {
		this.window = window.parent;
	} else {
		throw new Error('window object not provided and not found in global scope');
	}
}

Webpage.inherit(Object, {
	get host() {
		var url = this.window.location.href;
		    /https?:\/\/([^\/]+)/.exec(url);
		return RegExp.$1;
	},
	
	_params: null,
	get params() {
		if (this._params == null) {
			this._params = {};
			var match,
			    pl     = /\+/g,  // Regex for replacing addition symbol with a space
			    search = /([^&=]+)=?([^&]*)/g,
			    decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
			    query  = this.window.location.search.substring(1);
		    while (match = search.exec(query)) {
		    	this._params[decode(match[1])] = decode(match[2]);
		    }
		}
		return this._params;
	}
});

module.exports = Webpage;