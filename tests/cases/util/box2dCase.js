"use strict";

var  path = require('../../bootstrap').projectPath,
     box2d = require('box2d'),
     geo = require('pointExtension');

exports.testSimpleBody = function(test) {
    var world = new box2d.b2World(
            new box2d.b2Vec2(0, 0), //gravity
            true //allow sleep
        );
    
    var fixDef = new box2d.b2FixtureDef;
    fixDef.density = 2.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;
    fixDef.shape = new box2d.b2PolygonShape
    fixDef.shape.SetAsBox(1, 1);
    
    
    var bodyDef = new box2d.b2BodyDef;
    bodyDef.type = box2d.b2Body.b2_dynamicBody;
    
    bodyDef.position.Set(2,2);
    bodyDef.linearDamping = 0.5;
    bodyDef.angularDamping = 0.1;
    
    var bdy = world.CreateBody(bodyDef);
    bdy.CreateFixture(fixDef);

    bdy.ApplyForce(new box2d.b2Vec2(10,0), new box2d.b2Vec2(2,2.5));
    for (var i=0; i<10; i++) {
    	world.Step(1/60);
    	world.ClearForces();
    }

    test.notEqual(0, bdy.GetAngle());
	test.done();
};

exports.testCollision = function(test) {
    var world = new box2d.b2World(
            new box2d.b2Vec2(0, 0), //gravity
            false //allow sleep
        );
    
    var fixDef = new box2d.b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.5;
    fixDef.shape = new box2d.b2CircleShape(1.5);
    
    var bodyDef = new box2d.b2BodyDef;
    bodyDef.type = box2d.b2Body.b2_dynamicBody;
    bodyDef.position.Set(4,2);
    bodyDef.linearDamping = 0;
    bodyDef.angularDamping = 0;
    
    var b1 = world.CreateBody(bodyDef);
    b1.CreateFixture(fixDef);
    
    fixDef.shape = new box2d.b2CircleShape(1.5);
    bodyDef.position.Set(2,2);
    bodyDef.bullet = true;
    var b2 = world.CreateBody(bodyDef);
    b2.CreateFixture(fixDef);

    b2.SetLinearVelocity(new box2d.b2Vec2(3,0));
    for (var i=0; i<100; i++) {
    	world.Step(1/60, 10, 10);
    	world.ClearForces();
    }

	test.done();	
};

exports.testRayCast = function(test) {
	var world = new box2d.b2World(
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
    var b1 = world.CreateBody(bodyDef);
    b1.CreateFixture(fixDef);
    
    bodyDef.position.Set(5,1);
    var b2 = world.CreateBody(bodyDef);
    b2.CreateFixture(fixDef);
    
    bodyDef.position.Set(10,1);
    var b3 = world.CreateBody(bodyDef);
    b3.CreateFixture(fixDef);
    
    world.Step(1/30, 10, 10);
    
    var cb = function callBack(p1, p2, p3, p4) {
    	return 1;
    };
    
    
    var r = world.RayCast(cb, box2d.b2Vec2(20,1), box2d.b2Vec2(-20,1)),
    	transform = new box2d.b2Transform();
    transform.SetIdentity();
    
    var input = new box2d.b2RayCastInput;
    input.p1.Set(-10, 2);
    input.p2.Set(-7, 2);
    input.maxFraction = 300;

    var output = new box2d.b2RayCastOutput;

    var shape = b2.GetFixtureList(); 
        
    var hit = shape.RayCast(output, input, transform);    
	test.done();
};

exports.testSettingCollisionFilters = function(test) {
	var world = new box2d.b2World(
            new box2d.b2Vec2(0, 0), //gravity
            false //allow sleep
        );
    
    var fixDef = new box2d.b2FixtureDef;
    fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.5;
    fixDef.shape = new box2d.b2PolygonShape;
    fixDef.shape.SetAsBox(1, 1);
    fixDef.filter.categoryBits = 2;
    fixDef.filter.maskBits = 65535 - 2;
    
    var bodyDef = new box2d.b2BodyDef;
    bodyDef.type = box2d.b2Body.b2_dynamicBody;
    
    bodyDef.position.Set(1,1);
    var b1 = world.CreateBody(bodyDef);
    b1.CreateFixture(fixDef);
    
    
    test.equal(2, b1.GetFixtureList().GetFilterData().categoryBits);
    test.equal(65535 - 2, b1.GetFixtureList().GetFilterData().maskBits);
    test.done();
};

exports.testShapeTestOverlap = function(test) {
    
    var shape1 = new box2d.b2PolygonShape;
    shape1.SetAsBox(1, 1);
    var t1 = new box2d.b2Transform;
    t1.position.Set(1, 1);

    var shape2 = new box2d.b2CircleShape(2);
    var t2 = new box2d.b2Transform;
    t2.position.Set(2, 2);
    
    var t3 = new box2d.b2Transform;
    t3.position.Set(5, 5);

    test.ok(box2d.b2Shape.TestOverlap(shape1, t1, shape2, t2));
    test.ok(! box2d.b2Shape.TestOverlap(shape1, t1, shape2, t3));

    test.done();
};

