/**
 * JavaScript Audio API Abstracton
 * @see tests/cases/libs/jsaaaCase.js
 */


/**
 * factory is used to make the other components testable without the audio
 */
var AudioFactory = function(){};
AudioFactory.prototype.makeAudio = function(url){
	return new Audio(url);
};

/**
 * A player controlled by a hierarchical playlist
 * 
 * the API is as close as possible to Sound Manager:
 * http://www.schillmania.com/projects/soundmanager2
 */
var SoundPlayer = function(af){
	this.af = af? af : new AudioFactory();
	this.registry = {};
};

SoundPlayer.prototype.createSound = function(opts) {
	if (typeof opts == 'string') opts = {url: opts};
	if (!opts.url) throw new Error('jsaaa.createSound requires url option');
	if (!opts.id) opts.id = opts.url;
	this.registry[opts.id] = this.makeSound(opts);
};

SoundPlayer.prototype.makeSound = function(opts) {
	opts.audio = this.af.makeAudio(opts.url);
	opts.audio.loop = false;
	opts.audio.load();
	if (typeof opts.volume != 'undefined') {
		opts.audio.volume = opts.volume;
	}
	return opts;
};

SoundPlayer.prototype.play = function(id) {
	if (!this.registry[id]) {
		console.log('sound ' + id + ' not registered');
		return;
	}
	
	if (this.registry[id].audio.ended || this.registry[id].audio.currentTime == 0) {
		this.registry[id].audio.play();
	} else {
		var entry = this.makeSound(this.registry[id]);
		entry.audio.play();
	}
};

var Playlist = function(sp){
	this.sp = sp;
	this.ids = [];
	this.loop = true;
	this.push = function(id) {
		this.ids.push(id);
	};
	
	this.pos = 0;
	
	this.play = function() {
		this.sp.play(this.ids[this.pos]);

		this.sp.registry[this.ids[this.pos]].audio.addEventListener('ended', function(){
			this.playNext();
		}.bind(this));
	};
	
	this.playNext = function() {
		if (this.ids.length > this.pos + 1) {
			this.pos++;
			this.play();
		}
	};
};
/**
 * Sequence of tracks
 */
var PlaylistPlayer = function(sp){
	this.sp = sp;
	this.playlists = {};
	this.addPlaylist = function(id, pl) {
		this.playlists[id] = pl;
	};
	
	this.play = function(id) {
		this.playlists[id].play();
	};
};

exports.AudioFactory = AudioFactory;
exports.Playlist = Playlist;
exports.PlaylistPlayer = PlaylistPlayer;
exports.SoundPlayer = SoundPlayer;