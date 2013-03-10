var path = require('../../../bootstrap.js').projectPath,
	flame = require('flame'),
	jsein = require('jsein');

exports.testUriParsing = function(test) {
	var window = {
			location: {
				href: 'http://some.site.com/der/path',
				search: '?a=1234&truth=freedom'
			}
		},
		page = new flame.viewport.Webpage({window: window});
	test.equal('some.site.com', page.host);
	
	test.equal('1234', page.params.a);
	test.equal('freedom', page.params.truth);
	
	test.done();
};
