"use strict";

function App(opts) {
	this.config = {};
}

App.prototype.mergeConfig = function(config) {
	for (var key in config) {
		this.config[key] = config[key];
	}
};

module.exports = App;