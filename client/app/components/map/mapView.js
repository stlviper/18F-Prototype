openfdaviz.directive('openfdavizMap', function(){
  return{
    restrict: 'AE',
    replace: 'true',
    scope: false,
    templateUrl: '/app/components/map/mapView.html',
    link: function (scope, element, attrs) {
      // create a map in the "map" div, set the view to a given place and zoom
      var map = L.map('map', {center: [38, 264], zoom: 4, minZoom: 2});

      L.Icon.Default.imagePath = scope.imagePath;

      // add an OpenStreetMap tile layer
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // add a marker in the given location, attach some popup content to it and open the popup
      L.marker([38.4623, 267.69799]).addTo(map)
        .bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
        .openPopup();

      // testing the heatmap
      var heatmap = new L.TileLayer.HeatCanvas("Heat Canvas", map, {},
        {step:0.8, degree:HeatCanvas.QUAD, opacity:0.7});
      heatmap.pushData(38.4623, 267.69799, map.getZoom()*4);
      heatmap.pushData(38.3, 267.69799, map.getZoom()*4);
      map.addLayer(heatmap);

      map.on('zoomend', function() {
        heatmap.clear();
        heatmap.pushData(38.4623, 267.69799, map.getZoom()*4);
        heatmap.pushData(38.3, 267.69799, map.getZoom()*4);
      });
    }
  }
});