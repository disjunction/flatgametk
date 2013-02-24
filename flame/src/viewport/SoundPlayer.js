var
	flame = require('flame'),
	smog  = require('smog'),
	jsaaa = require('jsaaa');

function SoundPlayer(af, config) {
	this.config = config;
	SoundPlayer.superclass.constructor.call(this, af);
}

SoundPlayer.inherit(jsaaa.SoundPlayer, {
	createSound: function(opts) {
		if (opts.url && opts.url.substring(0, 1) == '.') {
			opts.url = this.config.extras.baseUrl + opts.url.substring(1);
		}
		SoundPlayer.superclass.createSound.call(this, opts);
	},
	
	loadSoundRepo: function(repo) {
		for (var k in repo.defs) {
			repo.defs[k].id = k;
			this.createSound(repo.defs[k]);
		}
	}
});

SoundPlayer.make = function(opts) {
	var
		spClass = opts['SoundPlayerClass']? opts['SoundPlayerClass'] : SoundPlayer,
		afClass = opts['AudioFactoryClass']? opts['AudioFactoryClass'] : jsaaa.AudioFactory,
		af = opts['audioFactory']? opts['audioFactory'] : new afClass(),
		config = opts['config']? opts['config'] : smog.app.config,
		sp = new spClass(af, config);
	if (opts['soundRepo']) {
		sp.loadSoundRepo(opts['soundRepo']);
	}
	return sp;
};

module.exports = SoundPlayer;