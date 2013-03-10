var path = require('../../bootstrap.js').projectPath,
	box2d = require('box2d'),
	RayCaster = require('RayCaster'),
	geo = require('pointExtension');
/**
 * Sets up a world with 3 bodies:
 * 
 * |-------|   |-------|   |-------|
 * |  b1   |   |  b2   |   |  b3   |
 * | (1,1) |   | (5,1) |   | (10,2)|
 * |-------|   |-------|   |-------|
 * 
 */
exports.setUp = function (callback) {
	this.world = new box2d.b2World(
            new box2d.b2Vec2(0, 0), //gravity
            false //allow sleep
        );
    
    var fixDef = new box2d.b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.5;
    fixDef.shape = new box2d.b2PolygonShape;
    fixDef.shape.SetAsBox(1, 1);
    
    var bodyDef = new box2d.b2BodyDef;
    bodyDef.type = box2d.b2Body.b2_dynamicBody;
    
    bodyDef.position.Set(1,1);
    this.b1 = this.world.CreateBody(bodyDef);
    this.b1.CreateFixture(fixDef);
    this.b1.childId = 'a';
    
    bodyDef.position.Set(5,1);
    this.b2 = this.world.CreateBody(bodyDef);
    this.b2.CreateFixture(fixDef);
    this.b2.childId = 'b';
    
    bodyDef.position.Set(10,1);
    this.b3 = this.world.CreateBody(bodyDef);
    this.b3.CreateFixture(fixDef);
    this.b3.childId = 'c';
    
    this.caster = new RayCaster(this.world);
    
    callback();
};

exports.testRayCastOne = function(test) {
    var r = this.caster.RayCastOne(geo.ccp(-10, 1), geo.ccp(20, 1));
    test.equal(1, r.body.GetPosition().x);
    
    var r = this.caster.RayCastOne(geo.ccp(20, 1), geo.ccp(-10, 1));
    test.equal(10, r.body.GetPosition().x);
    
    var r = this.caster.RayCastOne(geo.ccp(5, -10), geo.ccp(5, 10));
    test.equal(5, r.body.GetPosition().x);
    test.equal(-1, r.normal.y);
    
    test.done();
};


exports.testRayCastOneWithExcludes = function(test) {
    // test excluding by childId
    var r = this.caster.RayCastOne(geo.ccp(-10, 1), geo.ccp(20, 1), ['a', 'b']);
    test.equal(10, r.body.GetPosition().x);
    
    // test excluding by body object
    var r = this.caster.RayCastOne(geo.ccp(-10, 1), geo.ccp(20, 1), [this.b1]);
    test.equal(5, r.body.GetPosition().x);
    
    test.done();
};

exports.testRayCastOneMiss  = function(test) {
    var r = this.caster.RayCastOne(geo.ccp(-10, 10), geo.ccp(20, 10));
    test.equal(null, r);

    test.done();
};

exports.testRayCastOneAngular = function(test) {
	// too short cast
	var r = this.caster.RayCastOneAngular(geo.ccp(-10, 1), 1, 0);
    test.equal(null, r);
    
    // good cast
    var r = this.caster.RayCastOneAngular(geo.ccp(-10, 1), 100, 0);
    test.equal(1, r.body.GetPosition().x);
    
	test.done();
};

exports.testRayCastOneExcludeFunction = function(test) {
	// usual cast
    var r = this.caster.RayCastOne(geo.ccp(-10, 1), geo.ccp(30, 1), null);
    test.equal(1, r.body.GetPosition().x);
	
	// this will be used as a filter condition
	this.b1.filtered = true;
    
	// bypass b1
    var r = this.caster.RayCastOne(geo.ccp(-10, 1), geo.ccp(30, 1), null, function(body) {
    	if (body.filtered) return true;
    });
    test.equal(5, r.body.GetPosition().x);
    
	test.done();
};