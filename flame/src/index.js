exports.engine = {};
exports.engine.Protagonist = require('./engine/Protagonist');
exports.engine.FieldEngine = require('./engine/FieldEngine');
exports.engine.ThingNodeBuilder = require('./engine/ThingNodeBuilder');
exports.engine.ThingBodyBuilder = require('./engine/ThingBodyBuilder');

exports.entity = {};
exports.entity.Thing = require('./entity/Thing');
exports.entity.Movable = require('./entity/Movable');
exports.entity.Field = require('./entity/Field');

exports.viewport = {};
exports.viewport.Viewport = require('./viewport/Viewport');

// mock package... just to reduce unittest boilerplate
exports.mock = require('./mock/index');

// this is used for including the classes, 
// which are not automatically included above
// e.g. mocks
exports.srcPath = __dirname;