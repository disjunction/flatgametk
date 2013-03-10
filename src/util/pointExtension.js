/**
 * additions to cocos2d-js geometry.js in accordance with iphone version:
 * https://github.com/cocos2d/cocos2d-iphone/blob/master-v2/cocos2d/Support/CGPointExtension.m
 */

// include geo from cocos2d
var geo = require('geometry');

geo.ccpLengthSQ = function(v) {
	return v.x * v.x + v.y * v.y;
};

geo.ccpLength = function(v) {
	return Math.sqrt(geo.ccpLengthSQ(v));
};


geo.ccpDistance = function(v1, v2) {
	return geo.ccpLength(geo.ccpSub(v1, v2));
};

geo.ccpRotateByAngle = function(v, pivot, angle) {
	var r = geo.ccpSub(v, pivot),
		cosa = Math.cos(angle),
		sina = Math.sin(angle),
		t = r.x;
	
	r.x = t*cosa - r.y*sina + pivot.x;
	r.y = t*sina + r.y*cosa + pivot.y;
	return r;
};

geo.ccpNormalize = function(v) {
	return geo.ccpMult(v, 1/geo.ccpLength(v));
};

geo.ccpForAngle = function(a) {
	return geo.ccp(Math.cos(a), Math.sin(a));
};

/////// OVERRIDEN

geo.ccpMult = function (p1, p2) {
	if (typeof p2 != 'object') p2 = geo.ccp(p2, p2);
    return geo.ccp(p1.x * p2.x, p1.y * p2.y);
},


/////// ADDITIONAL (non-cocos2d extensions)

geo.ccp2Angle = function(point) {
	return Math.atan2(point.y, point.x);
};

/**
 * converts any angle to [-pi; pi]
 * @param Float a
 * @returns Float
 */
geo.floorAngle = function(a) {
	var pi = Math.PI;
	if (a > pi || a < -pi) {
		a -= Math.floor(a / 2 / pi) * 2 * pi;
		if (a > pi) a -= 2 * pi;
		if (a < -pi) a += 2 * pi;
	}
	return a;
};

/**
 * 
 * @param Float a1
 * @param Float a2
 * @returns
 */
geo.closestRotation = function(a1, a2) {
	a1 = geo.floorAngle(a1);
	a2 = geo.floorAngle(a2);
	if ( a1 < -Math.PI / 2 && a2 > Math.PI / 2 ) a1 += Math.PI * 2;
	if ( a1 > Math.PI / 2 && a2 < -Math.PI / 2 ) a1 -= Math.PI * 2;

	return a2 - a1;	
};

geo.sign = function(v) {
	if (v == 0) return 0;
	return v > 0? 1 : -1;
};


module.exports = geo;