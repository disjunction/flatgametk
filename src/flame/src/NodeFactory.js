var
	cocos2d = require('cocos2d'),
	nodes = cocos2d.nodes,
    geo    = require('pointExtension'),
    ccp    = geo.ccp;

/**
 * The main goal of this factory is to make it mockable,
 * so that full application with the nodes and scenes can be tested in console
 */
function NodeFactory(config) {
	this.config = config;
	this.nfConfig = this.config.nodeFactory? this.config.nodeFactory : {};
}

NodeFactory.inherit(Object, {
	
    makeNode: function(opts) {
		if (null == opts) {
			opts = {};
		}
		return this.applyOpts(new nodes.Node(opts), opts);
	},
	
	makeSprite: function(opts) {
		return this.applyOpts(new nodes.Sprite(opts), opts);
	},
	
	makeAnimatedSprite: function(opts) {
		if (!opts.file || !opts.frames || !opts.delay) {
			throw new Error('animatedFrame requires file, frames and delay options');
		}
		
		var texture = new cocos2d.Texture2D({ file: opts.file });
		
		var frames = [];
		for (var i in opts.frames) {
			var rect = opts.frames[i];
			if (!rect.size) rect.size = opts.size;
			var frame = new cocos2d.SpriteFrame({texture: texture, rect: rect});
			frames.push(frame);
		}
		var node = new nodes.Sprite({frame: frames[0]}),
			animation = new cocos2d.Animation({frames: frames, delay: opts.delay}),
			animate = new cocos2d.actions.Animate({animation: animation, restoreOriginalFrame: false});
			wrapper = opts.endless? new cocos2d.actions.RepeatForever(animate) : animate;
		
		node.autoaction = wrapper;
		
		return this.applyOpts(node, opts);
	},
	makeMap: function(opts) {
		return new nodes.TMXTiledMap(opts);
	},
	
	/**
	 * opts:
	 * * fontName
	 * * fontSize
     * * fontColor
     * * ... all other label opts
	 * @param opts
	 * @return cocos2d.nodes.Label
	 */
	makeLabel: function(opts) {
		if (!opts.fontName && this.nfConfig.fontName) opts.fontName = this.nfConfig.fontName;
		if (!opts.fontSize && this.nfConfig.fontSize) opts.fontSize = this.nfConfig.fontSize;
		if (!opts.fontColor && this.nfConfig.fontColor) opts.fontColor = this.nfConfig.fontColor;
		
		var label = new nodes.Label(opts);
		label.anchorPoint = ccp(0,1);
		return this.applyOpts(label, opts);
	},
	
	/**
	 * applies opts - not supported natively in cocos2d contructors
	 * @param Node node
	 * @param assoc opts
	 * @return Node
	 */
	applyOpts: function(node, opts) {
		for (var i in opts) {
			switch (i) {
			case 'rotation':
				node.rotation = opts[i];
				break;
			case 'position':
				node.position = opts[i];
				break;
			case '_a':
				node.rotation = geo.radiansToDegrees(opts[i]);
				break;
			case '_l':
				node.position = ccp(opts[i].x * this.config.ppm, opts[i].y * this.config.ppm);
				break;
			case 'opacity':
				node.opacity = opts[i];
				break;
			case 'scale':
				node.scale = opts[i];
				break;
			case 'anchorPoint':
				node.anchorPoint = opts[i];
				break;
			}
		}
		return node;
	}
	
});

module.exports = NodeFactory;