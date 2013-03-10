var path = require('../../../bootstrap').projectPath,
	flame = require('flame'),
	Interactor = flame.viewport.Interactor;

exports.testLayoutAndApplier = function(test) {
	var protagonist = flame.mock.makeProtagonist(),
		applier = new Interactor.ProtagonistApplier({protagonist: protagonist}),
		layout = {keys: {}};
	
	protagonist.ego = new flame.entity.Thing();
	
    layout.keys[Interactor.ARROW_UP] = {type: 'state', state: 'up'};
    
    var interactor = new Interactor({
    	applier: applier,
    	layout: layout
    });
    
    test.ok(!interactor.state.up);
    
    interactor.keyDown({keyCode: Interactor.ARROW_UP});
    test.ok(interactor.state.up);
    test.ok(protagonist.ego.state.up);
    
    test.done();
};

exports.testLayoutWithArray = function(test) {
	var protagonist = flame.mock.makeProtagonist(),
		applier = new Interactor.ProtagonistApplier({protagonist: protagonist}),
		layout = {keys: {}};
	
	protagonist.ego = new flame.entity.Thing();
	
    layout.keys[Interactor.SPACE] = [
          {type: 'state', state: 'up'},
          {type: 'state', state: 'up2'}];
    
    var interactor = new Interactor({
    	applier: applier,
    	layout: layout
    });
    
    test.ok(!interactor.state.up);
    
    interactor.keyDown({keyCode: Interactor.SPACE});
    test.ok(interactor.state.up);
    test.ok(interactor.state.up2);
    test.ok(!interactor.state.up3);
    
    test.done();
};