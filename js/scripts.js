dataStorage = window.localStorage;
// Initialize and add the map
function initMap() {
  //lat and lng of cdu campus
  var cduCasCampus = {lat: -12.372, lng: 130.869};
  // The map, centered at Casuarina Campus
  //-12.371766, 130.868918

  var cduCasuarinaCampusLIB = {lat: -12.371610, lng: 130.869377};
  //Library longitude -12.371610 and latitude 130.869377

  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 16, center: cduCasCampus});

  //var cduCasCampusMarker = new google.maps.Marker({position: cduCasCampus, map: map});

  //var cduCasLibMarker = new google.maps.Marker({position:cduCasuarinaCampusLIB, map: map, animation:google.maps.Animation.BOUNCE});

  //define paths for cdu lib polygon
  var cduCasCoords = [
    {lat: -12.371339, lng: 130.869756}, //top right corner of lib -12.371339, 130.869756
    {lat: -12.371222, lng: 130.869624}, //moving anti-clockwise corner, -12.371222, 130.869624
    {lat: -12.371461, lng: 130.869405}, //-12.371461, 130.869405
    {lat: -12.371201, lng: 130.869109}, //-12.371201, 130.869109
    {lat: -12.371443, lng: 130.869118}, //-12.371443, 130.869118
    {lat: -12.371592, lng: 130.869284}, //-12.371592, 130.869284
    {lat: -12.371927, lng: 130.868976}, //-12.371927, 130.868976
    {lat: -12.372042, lng: 130.869107} //-12.372042, 130.869107
  ];

  var cduLibPolygon= new google.maps.Polygon({
  paths: cduCasCoords,
  map: map,
  strokeColor:"red",
  strokeOpacity:0.8,
  strokeWeight:2,
  fillColor:"light red",
  fillOpacity:0.4
  });

  cduLibPolygon.addListener('click', function (){
    window.location.href = 'https://www.cdu.edu.au/library';
  });

  if (localStorage.length >= 1){
    for (var index = 0; index < localStorage.length; index++){
      var locName = localStorage.key(index);
      var locDetails = JSON.parse(localStorage.getItem(locName));
      var ltd = parseFloat(locDetails.ltd);
      var lng = parseFloat(locDetails.lng);
      var locCoords = {lat: ltd, lng: lng};
      console.log(locCoords);

      if (locDetails.Type == "Recycling"){
        var locName = new google.maps.Circle({
          center: locCoords,
          radius:10,
          map: map,
          strokeColor: 'yellow',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: 'light yellow',
          fillOpacity: 0.35
        });
      } else if(locDetails.Type === "General"){
        var locName = new google.maps.Circle({
          center: locCoords,
          radius:10,
          map: map,
          strokeColor: 'black',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: 'grey',
          fillOpacity: 0.35
        });
      }
    }
  }

  if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {

            var userIcon = {
              url : 'https://img.icons8.com/dusk/16/000000/user-location.png', //LINK to icons: https://icons8.com/icons/set/user-16x16
              size: new google.maps.Size(16, 16)
            }

            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            var userLocationMarker = new google.maps.Marker({position: pos, map: map, icon: userIcon});
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }
}

//get all bin locations
function displayAllLocations(){
  for (var index = 0; index < localStorage.length; index++){
    var locName = localStorage.key(index);
    var locDetails = JSON.parse(localStorage.getItem(locName));
    var ltd = parseInt(locDetails.ltd);
    var lng = parseInt(locDetails.lng);
    var locCoords = {lat: -12.371575, lng: 130.868705};

    var locName = new google.maps.Circle({
      center: locCoords,
      radius:200,
      map: map,
      strokeColor: 'black',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: 'grey',
      fillOpacity: 0.35
    });

  }
}

//function to get user lngInput
function getInputValue(){
  var locName = document.getElementById("locNameInput").value;
  var ltdVal = document.getElementById("ltdInput").value;
  var lngVal = document.getElementById("lngInput").value;
  var wasteType = document.getElementById("wasteType").value;

  var locationDetails = {ltd: ltdVal, lng: lngVal, Type: wasteType};
  var locationDetailsJSON = JSON.stringify(locationDetails);

  localStorage.setItem(locName, locationDetailsJSON);
  initMap();
}
