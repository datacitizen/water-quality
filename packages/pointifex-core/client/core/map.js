/**
  Pointifex Map wraps Pointifex functionality around a map
 **/
function PointifexMap(map) {
    
    var self = this;
    
    this.map = map;
    this.overlays = {};
    
    this.map.on('viewreset', function() {
        var bounds = self.map.getBounds();
        _.each(self.overlays, function(value, key) {
            value.fire('updateBounds', {bounds: bounds});
        });
    });
}

/**
  Toggles the Pointifex data overlay on the map that updates it's data
  when the map is moved
 **/
PointifexMap.prototype.overlay = function() {
    
    if (this.overlays.pointifex) {
        this.map.removeLayer(this.overlays.pointifex);
        delete this.overlays.pointifex;
    } else {
        var overlay = this.overlays['pointifex'] = new L.PointifexLayer();
        this.map.addLayer(overlay);        
        overlay.fire('updateBounds', {bounds: this.map.getBounds()});
    }
    
}