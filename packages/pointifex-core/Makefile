SHELL := /bin/bash

build:
	@interleave client/pointifex-client.js --path static --output pointifex.js
	@bake static/pointifex.js --output ./static