"use strict";

var box2d = require('./box2d'),
	geo = require('geometry');
/**
 * This entire class is just a workaround for world.RayCast
 * which didn't work for me in box2d.js :(
 * 
 * @uses b2Fixture.RayCast
 */
var RayCaster = function(world){
	this.world = world;
};

/**
 * @param b2Vec2 p1
 * @param b2Vec2 p2
 * @param Array excludes
 * @param Function excludeFunction(body)
 * @return {body: ..., fraction: 0.zzz, normal: {x,y}}
 */
RayCaster.prototype.RayCastOne = function(p1, p2, excludes, excludeFunction) {
	
	var hitBodies = [];
	
	var input = new box2d.b2RayCastInput;
    input.p1 = p1;
    input.p2 = p2;
    input.maxFraction = 1;
    
    // loops throw aabb results and puts hit bodies into temp hitBodies array 
    var bodyLocator = function(fixture) {
    	if (excludes) {
    		if (Array.isArray(excludes)) {
    			for (var i in excludes) {
    				if (typeof excludes[i] == 'string' && 
    					fixture.GetBody().childId == excludes[i]) return true;
    				
    				if (typeof excludes[i] == 'object' && 
        					fixture.GetBody() == excludes[i]) return true;
    			}
    		}
    	}
    	
    	if (excludeFunction) {
    		if (excludeFunction(fixture.GetBody())) return true;
    	}
    	
    	var output = new box2d.b2RayCastOutput,
    		hit = fixture.RayCast(output, input);
    	if (hit) {
    		output.body = fixture.GetBody();
    		hitBodies.push(output);
    	}
    	return true;
    };
	
    var aabb = new box2d.b2AABB();
    
    // make aabb query independent from relative location of bounds
    aabb.lowerBound = geo.ccp(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y));
    aabb.upperBound = geo.ccp(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y));
    
    this.world.QueryAABB(bodyLocator, aabb);
    
    // select the hit body with smallest fraction (distance from ray start)
    var selectedOutput = null, fraction = null;
    for (var i in hitBodies) {
    	if (fraction === null || hitBodies[i].fraction < fraction) {
    		fraction = hitBodies[i].fraction;
    		selectedOutput = hitBodies[i];
    	}
    }
    
    return selectedOutput;
};

/**
 * A helper wraper, since normally we know the shooter, angle and the distance
 * @param p1
 * @param distance
 * @param angle
 * @param excludes
 * @param excludeFunction
 * @returns see RayCastOne
 */
RayCaster.prototype.RayCastOneAngular = function(p1, distance, angle, excludes, excludeFunction) {
	var p2 = geo.ccp(p1.x + distance * Math.cos(angle),
			 p1.y + distance * Math.sin(angle));
	return this.RayCastOne(p1, p2, excludes, excludeFunction);
};

module.exports = RayCaster;