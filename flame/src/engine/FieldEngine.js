 "use strict";

var
    geo      = require('pointExtension'),
    ccp      = geo.ccp,
    smog     = require('smog'),
    config   = smog.app.config,
    flame    = require('flame'),
    Idealist = smog.util.Idealist,
    jsein    = require('jsein'),
    box2d    = require('box2d');

function FieldEngine(field) {
	this.field = field;
	
	// thing corresponding to the player. 
	// Can be used to detect the relevant area in simulation and skip the rest 
	this.ego = null;
    
	FieldEngine.superclass.constructor.call(this);
    this.prevStep = null;
    this.nodeBuilder = null;
    this.bodyBuilder = null;
    this.defRepo = null;
}

FieldEngine.inherit(Idealist, {
	// shortcut
	envision: function(thing) {
		this.nodeBuilder.envision(thing);
	},
	// shortcut
	embody: function(thing) {
		this.bodyBuilder.embody(thing);
	},
	/**
	 * it's not to store gravity, use world.GetGravity instead
	 * @param opts
	 * @returns {box2d.b2World}
	 */
	makeWorld: function(opts) {
		var gravity = opts && opts['gravity']? opts['gravity'] : new box2d.b2Vec2(0, 0);
		return this.world = new box2d.b2World(gravity, true);
	},

	updateThingNodes: function(thing) {
		for (var key in thing.nodes) {
			var node = thing.nodes[key];
			node.position = geo.ccpMult(thing.location, ccp(config.ppm, config.ppm));
		    node.rotation = geo.radiansToDegrees(-thing.angle);
		}
	},
	
	addThing: function(thing) {
		if (!thing.ii || !this.field.get(thing.ii)) {
			this.field.add(thing);
		}
		
		if (!thing.nobody) {
			var body = this.bodyBuilder.embody(thing);
			body.thing = thing;
			this.add(body);
			
			// backlink through id to avoid recursive references
			thing.bodyId = body.ii;
		}
	},
	
	removeThing: function(thing, leaveNodes) {
		if (typeof thing == 'string') {
			thing = this.field.get(thing);
		}
		
		// remove from field
		if (thing.ii) {
			this.field.remove(thing.ii);
		}
		
		// remove from world
		if (thing.bodyId) {
			var body = this.get(thing.bodyId);
			if (body) this.world.DestroyBody(body);
		}
		
		if (!leaveNodes && this.nodeBuilder) {
			this.nodeBuilder.destroyNodes(thing);
		}
	},
	
	step: function() {
		if (!this.oldTime) this.oldTime = (new Date()).getTime();
		var newTime = (new Date()).getTime();
		
		this.preStep();
		
		this.world.Step((newTime - this.oldTime)/1000, 10, 10);
		this.world.ClearForces();
		
		this.postStep();
		
		this.oldTime = newTime;
	},
	
	preStepPlugins: function() {
		
	},
	
	preStep: function() {
		this.preStepPlugins();
	},
	
	postStep: function() {
		this.postStepPlugins();
		for (var key in this.items) {
			var thing = this.items[key].thing;
			thing.location = this.items[key].GetPosition();
			thing.angle = this.items[key].GetAngle();
		}
	},
	
	postStepPlugins: function() {
	}
});

/**
 * Fat factory method, doing needed ctor injections,
 * so that bootstrap for the app or unittest is done using "one" line
 * 
 * @param opts 
 * 
 * * config: object (only if protagonist is not set)
 * * field: Field,
 * * FieldEngineClass: ctor,
 * * worldOpts: object (options for makeWorld)
 * * BodyBuilderClass: ctor,
 * * NodeBuilderClass: ctor
 * * defRepo: JsonRepo
 * 
 * @returns FieldEngine
 */
FieldEngine.make = function(opts) {
	if (!opts) opts = {};
	
	var
		field = opts['field']? opts['field'] : new flame.entity.Field(),
	    feClass = opts['FieldEngineClass']? opts['FieldEngineClass'] : FieldEngine,
	    fe = new feClass(field),
	    worldOpts = opts['worldOpts']? opts['worldOpts'] : {},
	    world = fe.makeWorld(worldOpts),
	    
	    defRepo = opts['defRepo']? opts['defRepo'] : new jsein.JsonRepo(),
	    
	    bodyBuilderClass = opts['BodyBuilderClass']? opts['BodyBuilderClass'] : require('./ThingBodyBuilder'),
	    bodyBuilder = new bodyBuilderClass(world, defRepo);
	    
    if (opts['protagonist']) {
    	var p = opts['protagonist'];
    	fe.config = p.config;
    	var nodeBuilderClass = opts['NodeBuilderClass']? opts['NodeBuilderClass'] : require('./ThingNodeBuilder');
    	fe.nodeBuilder = new nodeBuilderClass(p.viewport, defRepo);
    	
    	p.fe = fe;
    	if (p.ego) this.ego = p.ego;
    } else {
    	this.config = opts['config']? opts['config'] : smog.app.config;
    }
	    
	fe.bodyBuilder = bodyBuilder;
	fe.defRepo = defRepo;
	
	return fe;
};

module.exports = FieldEngine;