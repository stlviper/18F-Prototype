openfdaviz.directive('openfdavizMap', function(){
  return{
    restrict: 'AE',
    replace: 'true',
    scope: false,
    templateUrl: '/app/components/map/mapView.html',
    link: function (scope, element, attrs) {
      // create a map in the "map" div, set the view to a given place and zoom
      var map = L.map('map').setView([51.505, -0.09], 13);
      map.panTo(new L.LatLng(38.8750, -77.4025));

      L.Icon.Default.imagePath = scope.imagePath;

      // add an OpenStreetMap tile layer
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // add a marker in the given location, attach some popup content to it and open the popup
      L.marker([51.5, -0.09]).addTo(map)
        .bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
        .openPopup();

      // testing the heatmap
      var heatmap = new L.TileLayer.HeatCanvas("Heat Canvas", map, {},
        {step:0.3, degree:HeatCanvas.QUAD, opacity:0.7});
      heatmap.pushData(51.5, -0.09, 100);
      heatmap.pushData(51.49, -0.09, 100);
      map.addLayer(heatmap);
    }
  }
});