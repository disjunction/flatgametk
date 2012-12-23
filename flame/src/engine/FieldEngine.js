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
    
    this.preStepPlugins = [];
    this.postStepPlugins = [];
}

FieldEngine.inherit(Idealist, {
	// adds support of thing auto-removal
	envision: function(thing) {
		this.nodeBuilder.envision(thing);
		if (thing.removeThing) {
			setTimeout(function(){
				this.removeThing(thing);
			}.bind(this), thing.removeThing.delay * 1000);
			delete thing.removeThing;
		}
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
	
	applyModifiers: function(thing, modifiers) {
		var body = false;
		if (thing.bodyId) body = this.get(thing.bodyId);
		for (var k in modifiers) {
			switch (k) {
			case 'angle':
				thing.angle = modifiers[k];
				if (body) body.SetAngle(modifiers[k]);
				break;
			case 'location':
				thing.location = modifiers[k];
				if (body) body.SetPosition(modifiers[k]);
				break;
			case 'linearVelocity':
				if (body) body.SetLinearVelocity(modifiers[k]);
				break;
			}
		}
	},
	
	spawnThing: function(spawnThingDef) {
		var def = this.defRepo.get(spawnThingDef.type),
			thing;
		
		if (def.className) {
			thing = jsein.create(def.className, spawnThingDef.type);
		} else {
			thing = new flame.entity.Thing(spawnThingDef.type);
		}
		
		if (def.nobody) thing.nobody = true;

		this.addThing(thing);
		this.applyModifiers(thing, spawnThingDef); // set location and stuff
		
		if (def.nodes) {
			this.envision(thing);
		}
		return thing;
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
	
	runPreStepPlugins: function() {
		for (var i in this.preStepPlugins) {
			this.preStepPlugins[i].call();
		}
	},
	
	preStep: function() {
		this.runPreStepPlugins();
	},
	
	postStep: function() {
		this.runPostStepPlugins();
		for (var key in this.items) {
			var thing = this.items[key].thing;
			thing.location = this.items[key].GetPosition();
			thing.angle = this.items[key].GetAngle();
		}
	},
	
	runPostStepPlugins: function() {
		for (var i in this.postStepPlugins) {
			this.postStepPlugins[i].call();
		}
	},

	/**
	 * returns definition in this.defRepo for given thing
	 * @param Thing thing
	 * @returns Array
	 */
	getDefByThing: function(thing) {
		if (!thing.type) {
			throw new Error('trying to call getDefByThing on a not typed thing');
		}
		var def = this.defRepo.get(thing.type);
		if (!def) {
			throw new Error('no defintion found for type ' + thing.type);
		}
		return def;
	},
	
	get rayCaster() {
		if (!this._rayCaster) {
			this._rayCaster = new (require('RayCaster'))(this.world);
		}
		return this._rayCaster;
	},
	/**
	 * opts:
     *		fromPoint: Point
	 *		distance: Number,
	 *		angle: Number,
	 *	    subject: Thing, // optional
	 *		impact: Number, // optional
	 *		recoil: Number, // optional
	 *		excludes: [Thing], // optional
	 *		excludeFunction: Function(Thing), // optional
	 */
	rayShot: function(opts) {
		var subjectBody = null;
		if (opts.subject && opts.subject.bodyId) {
			subjectBody = this.get(opts.subject.bodyId);
			if (!opts.excludes) {
				opts.excludes = [subjectBody];
			}
		}
		
		var r = this.rayCaster.RayCastOneAngular(
					opts.fromPoint,
					opts.distance,
					opts.angle,
					opts.excludes,
					opts.excludeFunction);
		
		if (subjectBody) {
			if (opts.recoil) {
				var recoilForce = ccp(-opts.recoil * Math.cos(opts.angle), 
									  -opts.recoil * Math.sin(opts.angle));
				subjectBody.ApplyForce(recoilForce, subjectBody.GetPosition());
			}
		}
		
		if (r) {
			if (r.body) {
				r.impactPoint = ccp(opts.fromPoint.x + opts.distance * r.fraction * Math.cos(opts.angle),
									opts.fromPoint.y + opts.distance * r.fraction * Math.sin(opts.angle));
				if (opts.impact) {
					// this allows to calculate the impact depending on the distance or other params
					if (opts.impactFunction) {
						opts.impact = opts.impactFunction.call(opts.impact, r);
					}
					var impactForce = geo.ccpMult(r.normal, -opts.impact);
					r.body.ApplyForce(impactForce, r.impactPoint);
					
				}
			}
		}
		return r;
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