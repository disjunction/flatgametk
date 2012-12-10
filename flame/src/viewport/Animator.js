var
	cocos2d = require('cocos2d'),
	nodes = cocos2d.nodes,
	actions = cocos2d.actions,
    geo    = require('pointExtension'),
    ccp    = geo.ccp;

/**
 * factory is here more for the consistency
 * 
 * the class depends on cocos2d.actions anyway :\
 * 
 * @param Layer layer
 * @param NodeFactory nodeFactory
 */
function Animator(nodeFactory, config) {
	this.config = config;
	this.nodeFactory = nodeFactory;
}

Animator.prototype.showSpriteAndFadeOutRemove = function(spriteOpts, dur1, dur2, layer) {
	var sprite = this.nodeFactory.makeSprite(spriteOpts);
	
	layer.addChild(sprite);
	this.fadeOutRemove(sprite, dur1, dur2);
	if (spriteOpts.rotateBy) {
		this.rotateBy(sprite, spriteOpts.rotateBy, dur1 + dur2);
	}
	if (spriteOpts.scaleBy) {
		this.scaleBy(sprite, spriteOpts.scaleBy, dur1 + dur2);
	}
};

Animator.prototype.rotateBy = function(node, angle, dur) {
	node.runAction(new actions.RotateBy({duration: dur, angle: geo.radiansToDegrees(angle)}));
};

Animator.prototype.scaleBy = function(node, scale, dur) {
	node.runAction(new actions.ScaleBy({duration: dur, scale: scale}));
};
Animator.prototype.scaleTo = function(node, scale, dur) {
	node.runAction(new actions.ScaleTo({duration: dur, scale: scale}));
};

Animator.prototype.fadeOutRemove = function(node, dur1, dur2, layer) {
	var sequence = new actions.Sequence({actions: [
	    new actions.DelayTime({duration: dur1}),
		new actions.FadeTo({duration: dur2, toOpacity: 0})
	]});
	
	node.runAction(sequence);
	setTimeout(function remove() {
		layer.removeChild(node);
	}.bind(this), (dur1+dur2) * 1000);
};

Animator.prototype.backAndForth = function(node, distance, backDur, forthDur) {
	var shift = ccp(distance * Math.cos(geo.degreesToRadians(node.rotation)) * config.ppm,
					distance * -Math.sin(geo.degreesToRadians(node.rotation)) * config.ppm);
	var pos = ccp(node.position.x,node.position.y);
	var sequence = new actions.Sequence({actions: [
	    new actions.MoveBy({duration: backDur, position: geo.ccpNeg(shift)}),
		new actions.MoveBy({duration: forthDur, position: shift}),
		new actions.MoveTo({duration: 0, position: pos})
	]});
	node.runAction(sequence);
};

Animator.prototype.fadeTo = function(node, opacity, duration) {
	var action = new actions.FadeTo({toOpacity: opacity, duration: duration});
	node.runAction(action);
};


module.exports = Animator;