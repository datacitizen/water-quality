#!/bin/bash
nodeunit test/nodeunit
phantomjs test/run-jasmine.js "$1/_design/water-quality/static/js/spec/SpecRunner.html"