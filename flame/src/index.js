exports.engine = {};
exports.engine.Protagonist = require('./engine/Protagonist');
exports.engine.FieldEngine = require('./engine/FieldEngine');
exports.engine.ThingNodeBuilder = require('./engine/ThingNodeBuilder');
exports.engine.ThingBodyBuilder = require('./engine/ThingBodyBuilder');

exports.entity = {};
exports.entity.Thing = require('./entity/Thing');
exports.entity.Movable = require('./entity/Movable');
exports.entity.Field = require('./entity/Field');

exports.viewport = {
    //Animator is excluded from autoload, because it contains dependencies on cocos2d
	Viewport: require('./viewport/Viewport'),
	Interactor: require('./viewport/Interactor'),
	InteractorState: require('./viewport/InteractorState'),
	SoundPlayer: require('./viewport/SoundPlayer'),
	hud: {
		HudObserver: require('./viewport/hud/HudObserver'),
		EgoHud: require('./viewport/hud/EgoHud'),
		HudBuilder: require('./viewport/hud/HudBuilder'),
		elements: {
			Panel: require('./viewport/hud/elements/Panel'),
		}
	}
};

// mock package... just to reduce unit test boilerplate
exports.mock = require('./mock/index');

// this is used for including the classes, 
// which are not automatically included above
// e.g. mocks
exports.srcPath = __dirname;