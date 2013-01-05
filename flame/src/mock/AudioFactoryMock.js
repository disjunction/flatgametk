var AudioFactoryMock = function(){};

AudioFactoryMock.prototype.makeAudio = function(url) {
	return new AudioFactoryMock.Audio(url);
};

AudioFactoryMock.Audio = function(url) {
	this.volume = 100;
	this.currentTime = 5;
	this.src = url;
	this.duration = 30;
	
	this.play = function(){};
	this.pause = function(){};
	this.load = function(){};
};


module.exports = AudioFactoryMock;