var path = require('../../../../bootstrap').projectPath,
	flame = require('flame'),
	HudObserver = flame.viewport.hud.HudObserver;

exports.testGenericEvents = function(test) {
	var protagonist = flame.mock.makeProtagonist(),
		ho = new HudObserver({viewport: protagonist.viewport}),
		testVal = 1;

	test.ok(ho.viewport);
	
	
	ho.addListener('some1', function(){testVal = 2;} );
	
	test.equals(1, testVal);
	ho.dispatch('some1');
	test.equals(2, testVal);
	
	test.done();
};

/**
 * the test below sets a hudObserver, which actually doesn't do any hud
 * It just changes a property diff if hello is changed
 * @param test
 */
exports.testPropertyEvent = function(test) {
	var protagonist = flame.mock.makeProtagonist(),
		testVal = 1;
	
	function SomeHudObserver(opts) {
		SomeHudObserver.superclass.constructor.call(this, opts);
	};
	SomeHudObserver.inherit(HudObserver, {
		propertyListener: function(event) {
			if (event.property == 'hello') {
				event.subj.diff = event.newValue - event.oldValue;
			}
		}
	});
	
	function TestThing() {
		TestThing.superclass.constructor.call(this);
	}
	TestThing.inherit(flame.entity.Thing, {
		set bla(v) {
			this.setter('bla', v);
		},
		get bla() {return this._bla;},
		
		set hello(v) {
			this.setter('hello', v);
		},
		get hello() {return this._hello;}
	});
	
	var ho = new SomeHudObserver({viewport: protagonist.viewport}),
		thing = new TestThing();
	
	thing.ed = ho;
	
	thing.bla = 15;
	test.equals(15, thing.bla);	
	test.equals(1, testVal);
	
	thing.hello = 7;
	test.ok(thing.hello);

	thing.hello = 42;
	test.equal(35, thing.diff); // this should be set by propertyListener	
	
	test.done();
};