"use strict";

var  smog   = require('smog');

function Field() {
	Field.superclass.constructor.call(this);
}

Field.inherit(smog.util.Idealist, {
});

module.exports = Field;