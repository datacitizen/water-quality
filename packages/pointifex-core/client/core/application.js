/**
  The PointifexApplication forms the core of a Pointifex based application
 **/
function PointifexApplication(couchApp, options) {
    this.couchApp = couchApp;
    this.components = {};
}

/**
  Registers a Leaflet map with the application
 **/
PointifexApplication.prototype.addMap = function(map, options) {
    return this.components['map'] = new PointifexMap(map);
}