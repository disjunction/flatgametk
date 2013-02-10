module.exports = function() {
	this.vowels = ['a', 'e', 'i', 'o', 'u'];
	this.consonants = ['b', 'd', 'f', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 't', 's', 'z'];
	
	/**
	 * returns a random element of given array
	 * @param array a
	 */
	this.randElement = function(a) {
		pos = Math.floor(Math.random() * a.length);
		return a[pos];
	};
	
	this.generate = function() {
		var n = '';
		n += this.randElement(this.consonants);
		n += this.randElement(this.vowels);
		n += this.randElement(this.consonants);
		n += this.randElement(this.vowels);
		n += this.randElement(this.consonants);
		
		if (Math.random()>=0.5) {
			n += 'a';
		}
		
		return n;
	};

};