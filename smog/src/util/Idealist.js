var intpacker = new (require('Intpacker'))();

/**
 * list containing persistent objects
 * 
 * every object added to the list gets unique id (ii).
 * The assigned ii becomes a property of an object
 * 
 * we use ii, cause "id" seems to be a magical field
 */
function Idealist() {
	this.items = {};
	this.counter = 0;
}

Idealist.inherit(Object, {
	items: {},
	counter: 0,
	
	get keys() {
		var keys = [];
		for (var i in this.items) keys.push(i);
		return keys;
	},
	add: function(item) {
		if (item.ii == null || item.ii.length == 0) {
			while (item.ii == null || this.items[item.ii] != null)
				item.ii = intpacker.pack(this.counter++);
		}
		this.items[item.ii] = item;
	},
	get: function(ii) {
		return this.items[ii];
	},
	remove: function(ii) {
		delete this.items[ii];
	}
});

module.exports = Idealist;