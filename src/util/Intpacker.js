/**
 * baseX for integers
 */
"use strict";

var Intpacker = function(){
	// by default the std. base64 dictionary is used
	this.dictionary = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
};


/**
 * @param integer Number
 * @returns string
 */
Intpacker.prototype.pack = function (int) {
	var remainder = int % this.dictionary.length;
	var letter = this.dictionary.substring(remainder, remainder + 1);
	if (remainder != int) {
		return this.pack(Math.floor(int / this.dictionary.length)) + letter;
	} else {
		return letter;
	}
};

/**
 * @param string int
 * @returns Number
 */
Intpacker.prototype.unpack = function (packed) {
	var result = 0;
	while (packed.length > 0) {
		result *= this.dictionary.length;
		result += this.dictionary.indexOf(packed.substring(0, 1));
		packed = packed.substring(1);
	}
	return result;
};

module.exports = Intpacker;