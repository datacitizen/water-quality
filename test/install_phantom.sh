#!/bin/bash
apt-get install libqtwebkit-dev -y
git clone git://github.com/ariya/phantomjs.git
cd phantomjs
qmake-qt4
make
cp bin/phantomjs /usr/local/bin/ 