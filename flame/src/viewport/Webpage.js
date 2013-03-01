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
		/https?:\/\/([^/]+)/.exec(url);
		return RegExp.$1;
	}
});

module.exports = Webpage;