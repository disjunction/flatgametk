"use strict";

var
    geo      = require('pointExtension'),
    ccp      = geo.ccp,
    jsein    = require('jsein'),
    box2d    = require('box2d');



function ThingBodyBuilder(world, defRepo, materialRepo) {
	if (!materialRepo) {
		materialRepo = new jsein.JsonRepo(this.getMaterials()); 
	}
	this.materialRepo = materialRepo;
	this.defRepo = defRepo;
	this.world = world;
	this.defaults = this.getDefaults();
}

ThingBodyBuilder.prototype.getMaterials = function() {
	return {
		iron: {
			friction: 0.70,
			restitution: 0.3
		},
		wood: {
			friction: 0.90,
			restitution: 0.6
		},
		gum: {
			friction: 0.95,
			restitution: 0.9
		},
		pitch: {
			friction: 100,
			restitution: 0
		}
	};
};

ThingBodyBuilder.prototype.getDefaults = function() {
	return {
		material: 'gum',
		density: 1,
		linearDamping: 0.3,
		angularDamping: 0.3
	};
};

ThingBodyBuilder.prototype.makeFixtureDef = function(opts) {
	if (!opts.material) opts.material = this.defaults.material;
	
	var material = this.materialRepo.get(opts['material']);
	
	var fixDef = new box2d.b2FixtureDef;
    fixDef.friction = material.friction;
    fixDef.restitution = material.restitution;
    fixDef.density = opts.density? opts.density : this.defaults.density;;
    
    if (opts.filter) for (var i in opts.filter) {
    	fixDef.filter[i] = opts.filter[i];
    }
    
    if (opts.box) {
    	fixDef.shape = new box2d.b2PolygonShape;
	    fixDef.shape.SetAsBox(opts.box.width / 2, opts.box.height / 2);
    } else if (opts.polygon) {
    	fixDef.shape = new box2d.b2PolygonShape;
    	var verts = opts.polygon.vertices;
    	fixDef.shape.SetAsArray(verts, verts.length);
    } else if (opts.radius) {
    	fixDef.shape = new box2d.b2CircleShape(opts.radius);
    } else {
    	throw new Error('unknown fixture type');
    }
    
    return fixDef;
};

ThingBodyBuilder.prototype.makeBodyByDef = function(def) {
	var bodyDef = new box2d.b2BodyDef;
	switch (def.type) {
	case 'dynamic':
		bodyDef.type = box2d.b2Body.b2_dynamicBody;
		break;
	case 'static':
	default:
		bodyDef.type = box2d.b2Body.b2_staticBody;
	}
    
	bodyDef.linearDamping = def.linearDamping? def.linearDamping : this.defaults.linearDamping;
    bodyDef.angularDamping = def.angularDamping? def.angularDamping : this.defaults.angularDamping;
    if (def.bullet) bodyDef.bullet = true;
    
    var body = this.world.CreateBody(bodyDef);
    for (var k in def.fixtures)
    	body.CreateFixture(this.makeFixtureDef(def.fixtures[k]));
    
    // initializing body state by def
    
    if (def.linearVelocity) {
    	body.SetLinearVelocity(def.linearVelocity);
    }
    
    if (def.angularVelocity) {
    	body.SetAngularVelocity(jsein.parseFloat(def.angularVelocity));
    }
    
    if (def.angle) {
    	body.SetAngle(jsein.parseFloat(def.angle));
    }
    
    return body;
};

ThingBodyBuilder.prototype.embody = function(thing) {
	var def = this.defRepo.get(thing.type);
	
	if (!def) {
	    throw new Error('no def for thing ' + thing.type);    
	}
	
	// if thing was defined as nobody, then let's not throw anything
	if (def.nobody) return null;
	
	if (!def.body) {
		throw new Error('no def.body for thing ' + thing.type);
	}

	var body = this.makeBodyByDef(def.body);
	thing.syncBody(body);
	return body;
};

module.exports = ThingBodyBuilder;