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
    
    if (opts.box) {
	    fixDef.shape = new box2d.b2PolygonShape;
	    fixDef.shape.SetAsBox(opts.box.width / 2, opts.box.height / 2);
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
	bodyDef.angularDamping = def.angularDamping? def.linearDamping : this.defaults.angularDamping;
    
    var body = this.world.CreateBody(bodyDef);
    for (var k in def.fixtures)
    	body.CreateFixture(this.makeFixtureDef(def.fixtures[k]));
    return body;
};

ThingBodyBuilder.prototype.embody = function(thing) {
	var def = this.defRepo.get(thing.type);
	if (!def) {
		throw new Error('no def for thing ' + thing.type);
	}
	if (!def.body) {
		throw new Error('no def.body for thing ' + thing.type);
	}

	var body = this.makeBodyByDef(def.body);
	thing.syncBody(body);
	return body;
};

module.exports = ThingBodyBuilder;