var     
	geo = require('pointExtension');

function DirectorMock(opts) {
	this.winSize = geo.sizeMake(300, 300);
}

module.exports = DirectorMock;