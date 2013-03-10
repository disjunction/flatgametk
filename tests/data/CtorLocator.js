var flame = require('flame'),
	container = {
		Thing: require(flame.srcPath + '/entity/Thing')
	};

function ctorLocator(name) {
	if (container[name]) {
		return container[name];
	}
	return false;
}

module.exports = ctorLocator;