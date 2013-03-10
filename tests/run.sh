#!/bin/sh
export NODE_PATH=/usr/local/lib/node_modules/cocos2d/src/libs:/usr/local/lib/node_modules:../src/util:../src
nodeunit cases cases/flame/entity \
		 cases/flame/viewport \
		 cases/flame/viewport/hud \
		 cases/flame/engine \
		 cases/smog/util \
		 cases/util
