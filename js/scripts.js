dataStorage = window.localStorage;

var coordinatePickingMode = false;

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

  //var cduLibPolygon= new google.maps.Polygon({
  //paths: cduCasCoords,
  //map: map,
  //strokeColor:"red",
  //strokeOpacity:0.8,
  //strokeWeight:2,
  //fillColor:"light red",
  //fillOpacity:0.4
  //});

  //cduLibPolygon.addListener('click', function (){
    //window.location.href = 'https://www.cdu.edu.au/library';
  //});

  if (localStorage.length >= 1){
    for (var index = 0; index < localStorage.length; index++){
      var locName = localStorage.key(index);
      var key = locName;
      var locDetails = JSON.parse(localStorage.getItem(locName));
      var ltd = parseFloat(locDetails.ltd);
      var lng = parseFloat(locDetails.lng);
      var rec = locDetails.rec;
      var co = locDetails.co;
      var gen = locDetails.gen;
      var spe = locDetails.spe;
      var locCoords = {lat: ltd, lng: lng};

      var locName = new google.maps.Circle({
        title: key,
        center: locCoords,
        radius:1,
        map: map,
        strokeColor: 'grey',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'grey',
        fillOpacity: 0.35
      });

      google.maps.event.addListener( locName, 'click', function (evt){
        var key = this.get('title');
        window.location.href = '#'+key;
        var locNameTd = document.getElementById(key);
        locNameTd.classList.add("viewedTd");
        setTimeout(() => { locNameTd.classList.remove("viewedTd"); }, 3000);
      });

      if (rec == true){
        recCoords = {lat: ltd + 0.000005, lng: lng}
        var locNameRec = new google.maps.Circle({
          center: recCoords,
          radius:0.25,
          map: map,
          strokeColor: 'yellow',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: 'yellow',
          fillOpacity: 0.35
        });
      }

      if (co == true){
        coCoords = {lat: ltd, lng: lng - 0.000005}
        var locNameCo = new google.maps.Circle({
          center: coCoords,
          radius:0.25,
          map: map,
          strokeColor: 'red',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: 'yellow',
          fillOpacity: 0.35
        });
      }

      if (gen == true){
        genCoords = {lat: ltd, lng: lng + 0.000005}
        var locNameGen = new google.maps.Circle({
          center: genCoords,
          radius:0.25,
          map: map,
          strokeColor: 'green',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: 'green',
          fillOpacity: 0.35
        });
      }

      if (spe == true){
        speCoords = {lat: ltd - 0.000005, lng: lng}
        var locNamespe = new google.maps.Circle({
          center: speCoords,
          radius:0.25,
          map: map,
          strokeColor: 'blue',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: 'blue',
          fillOpacity: 0.35
        });
      }

    }
  }

  listAllLocations();

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

        map.addListener('click', function(e) {
          if (coordinatePickingMode === true){
            GetCoordinatesFromMap(e.latLng, map);
          } else {
            // do nothing so that map can be operated normally
          }
        });

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }
}

//get all bin locations
function listAllLocations(){
  document.getElementById("outputTable").innerHTML = "";
  if (localStorage.length >= 1) {

    const binLocations = [];

    for (var index = 0; index < localStorage.length; index++) {
      var locName = localStorage.key(index);
      var locDetails = JSON.parse(localStorage.getItem(locName));
      binLocations.push({locName: locName, locInfo: locDetails});
    }

    binLocations.forEach((location) => {
        listLocations(location.locName, location.locInfo);
      });

  };

}

//filter bin locations
function filterCheck(){
  var recFilCheck = document.getElementById("recFilter").checked;
  var coFilCheck = document.getElementById("coFilter").checked;
  var genFilCheck = document.getElementById("genFilter").checked;
  var speFilCheck = document.getElementById("speFilter").checked;
  if (recFilCheck==false && coFilCheck==false && genFilCheck==false && speFilCheck==false){
    listAllLocations();
  } else{
    document.getElementById("outputTable").innerHTML = "";
    if (localStorage.length >= 1) {

      const binLocations = [];

      for (var index = 0; index < localStorage.length; index++) {
        var locName = localStorage.key(index);
        var locDetails = JSON.parse(localStorage.getItem(locName));
        if (locDetails.rec == true && recFilCheck == true){
          binLocations.push({locName: locName, locInfo: locDetails});
        }
        if (locDetails.co == true && coFilCheck == true){
          binLocations.push({locName: locName, locInfo: locDetails});
        }
        if (locDetails.gen == true && genFilCheck == true){
          binLocations.push({locName: locName, locInfo: locDetails});
        }
        if (locDetails.spe == true && speFilCheck == true){
          binLocations.push({locName: locName, locInfo: locDetails});
        }

      }

      binLocations.forEach((location) => {
          listLocations(location.locName, location.locInfo);
        });

    };
  }


}

//function to get user lngInput
function getInputValue(){
  var locName = document.getElementById("locNameInput").value;
  var ltdVal = document.getElementById("ltdInput").value;
  var lngVal = document.getElementById("lngInput").value;

  var recycle = document.getElementById("recycle").checked;
  var comingled = document.getElementById("comingled").checked;
  var general = document.getElementById("general").checked;
  var special = document.getElementById("special").checked;

  var locationDetails = {ltd: ltdVal, lng: lngVal, rec: recycle, co: comingled, gen: general, spe: special};
  var locationDetailsJSON = JSON.stringify(locationDetails);

  localStorage.setItem(locName, locationDetailsJSON);
  clearForm();
  location.reload();
}

// Clear form
function clearForm(){
  var locNameInputField = document.querySelector("#locNameInput");
  var ltdInputField = document.querySelector("#ltdInput");
  var lngInputField = document.querySelector("#lngInput");
  var recCheckBox = document.querySelector("#recycle");
  var coCheckBox = document.querySelector("#comingled");
  var speCheckBox = document.querySelector("#special");
  var genCheckBox = document.querySelector("#general");

  locNameInputField.value = "";
  ltdInputField.value = 0;
  lngInputField.value = 0;

  recCheckBox.checked = false;

  coCheckBox.checked = false;

  genCheckBox.checked = false;

  speCheckBox.checked = false;

}


// Function for getting coordinates from map
function GetCoordinatesFromMap(latLng, map) {
  //Optional code for if we want to add a marker on the map too
  // var marker = new google.maps.Marker({
  //   position: latLng,
  //   map: map
  // });
  // map.panTo(latLng);
  alert("New map marker added, lat: " + latLng.lat() + " lng: " + latLng.lng());
  console.log("New map marker added, lat: " + latLng.lat() + " lng: " + latLng.lng());
  // Insert picked coordinates to form fields
  document.getElementById("ltdInput").value = latLng.lat();
  document.getElementById("lngInput").value = latLng.lng();
  //create a temporary Marker

  var tempMarker = new google.maps.Marker({
    position: {lat: latLng.lat(), lng: latLng.lng()},
    map: map,
  });
  // Disable coordinatePickingMode
  coordinatePickingMode = false;
  document.getElementById("pickFromMapBtn").innerHTML = "Retrieve coodinate from map";

}

//We only want to pick coordinates when button is pressed so we handle that with this function for now
function checkPicking(){
  if (coordinatePickingMode == true){
    coordinatePickingMode = false;
    document.getElementById("mapZone").classList.remove("pickingModeActive");
    document.getElementById("pickFromMapBtn").innerHTML = "Retrieve coodinate from map";
    return;
  }

  if (coordinatePickingMode == false){
    coordinatePickingMode = true;
    document.getElementById("mapZone").classList.add("pickingModeActive");
    document.getElementById("pickFromMapBtn").innerHTML = "Stop retrieving coodinate from map";
    return;
  }
}

function editClicked(evt) {
  var locName = evt.target.dataset.key;
  var locDetails = JSON.parse(localStorage.getItem(locName));
  var locNameInputField = document.querySelector("#locNameInput");
  var ltdInputField = document.querySelector("#ltdInput");
  var lngInputField = document.querySelector("#lngInput");
  var recCheckBox = document.querySelector("#recycle");
  var coCheckBox = document.querySelector("#comingled");
  var speCheckBox = document.querySelector("#special");
  var genCheckBox = document.querySelector("#general");
  locNameInputField.value = locName;
  ltdInputField.value = parseFloat(locDetails.ltd);
  lngInputField.value = parseFloat(locDetails.lng);

  if (locDetails.rec == true){
    recCheckBox.checked = true;
  } else{
    recCheckBox.checked = false;
  }

  if (locDetails.co == true){
    coCheckBox.checked = true;
  } else{
    coCheckBox.checked = false;
  }

  if (locDetails.gen == true){
    genCheckBox.checked = true;
  } else{
    genCheckBox.checked = false;
  }

  if (locDetails.spe == true){
    speCheckBox.checked = true;
  } else{
    speCheckBox.checked = false;
  }

};

function promptDeletion(evt) {
  evt.preventDefault();
  key = evt.target.dataset.key;
  confirm("Are you sure you want to delete this location?");

  localStorage.removeItem(evt.target.dataset.key);

  location.reload();
};

function viewOnMap(evt) {
  evt.preventDefault();
  locName = evt.target.dataset.key;
  var locDetails = JSON.parse(localStorage.getItem(locName));
  var ltd = parseFloat(locDetails.ltd);
  var lng = parseFloat(locDetails.lng);
  toViewCoords = {lat: ltd, lng: lng};

  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 25, center: toViewCoords});

  if (localStorage.length >= 1){
    for (var index = 0; index < localStorage.length; index++){
      var locName = localStorage.key(index);
      var key = locName;
      var locDetails = JSON.parse(localStorage.getItem(locName));
      var ltd = parseFloat(locDetails.ltd);
      var lng = parseFloat(locDetails.lng);
      var rec = locDetails.rec;
      var co = locDetails.co;
      var gen = locDetails.gen;
      var spe = locDetails.spe;
      var locCoords = {lat: ltd, lng: lng};

      var locName = new google.maps.Circle({
        title: key,
        center: locCoords,
        radius:1,
        map: map,
        strokeColor: 'grey',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'grey',
        fillOpacity: 0.35
      });

      google.maps.event.addListener( locName, 'click', function (evt){
        var key = this.get('title');
        window.location.href = '#'+key;
        var locNameTd = document.getElementById(key);
        locNameTd.classList.add("viewedTd");
        setTimeout(() => { locNameTd.classList.remove("viewedTd"); }, 3000);
      });

      if (rec == true){
        recCoords = {lat: ltd + 0.000005, lng: lng}
        var locNameRec = new google.maps.Circle({
          center: recCoords,
          radius:0.25,
          map: map,
          strokeColor: 'yellow',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: 'yellow',
          fillOpacity: 0.35
        });
      }

      if (co == true){
        coCoords = {lat: ltd, lng: lng - 0.000005}
        var locNameCo = new google.maps.Circle({
          center: coCoords,
          radius:0.25,
          map: map,
          strokeColor: 'red',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: 'yellow',
          fillOpacity: 0.35
        });
      }

      if (gen == true){
        genCoords = {lat: ltd, lng: lng + 0.000005}
        var locNameGen = new google.maps.Circle({
          center: genCoords,
          radius:0.25,
          map: map,
          strokeColor: 'green',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: 'green',
          fillOpacity: 0.35
        });
      }

      if (spe == true){
        speCoords = {lat: ltd - 0.000005, lng: lng}
        var locNamespe = new google.maps.Circle({
          center: speCoords,
          radius:0.25,
          map: map,
          strokeColor: 'blue',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: 'blue',
          fillOpacity: 0.35
        });
      }

    }
  }

  listAllLocations();

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

        map.addListener('click', function(e) {
          if (coordinatePickingMode === true){
            GetCoordinatesFromMap(e.latLng, map);
          } else {
            // do nothing so that map can be operated normally
          }
        });

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }
      filterCheck();
};


function listLocations(key, value){

  var row = document.createElement('tr');

  var locNameTd = document.createElement('td');
  locNameTd.innerHTML = key;
  locNameTd.setAttribute("id", key);

  //var ltdTd = document.createElement('td');
  //ltdTd.innerHTML = parseFloat(value.ltd).toFixed(2);

  //var lngTd = document.createElement('td');
  //lngTd.innerHTML = parseFloat(value.lng).toFixed(2);

  var recTd = document.createElement('td');
  if (value.rec == true){
    recTd.style.backgroundColor = "lightgreen";
  } else {
    recTd.style.backgroundColor = "grey";
  }

  var coTd = document.createElement('td');
  if (value.co == true){
    coTd.style.backgroundColor = "lightgreen";
  } else {
    coTd.style.backgroundColor = "grey";
  }

  var genTd = document.createElement('td');
  if (value.gen == true){
    genTd.style.backgroundColor = "lightgreen";
  } else {
    genTd.style.backgroundColor = "grey";
  }

  var speTd = document.createElement('td');
  if (value.spe == true){
    speTd.style.backgroundColor = "lightgreen";
  } else {
    speTd.style.backgroundColor = "grey";
  }

  var editButtonTd = document.createElement('td');
  var editButton = document.createElement('button');
  editButton.className = 'listButtons';
  editButton.dataset.key = key;
  editButtonTd.appendChild(editButton);
  editButton.innerHTML = 'Edit';
  editButton.addEventListener('click', editClicked);

  var viewButtonTd = document.createElement('td');
  var viewButton = document.createElement('button');
  viewButton.className = 'listButtons';
  viewButton.dataset.key = key;
  viewButtonTd.appendChild(viewButton);
  viewButton.innerHTML = 'View';
  viewButton.addEventListener('click', viewOnMap);

  var deleteButtonTd = document.createElement('td');
  var deleteButton = document.createElement('button');
  deleteButton.className = 'listButtons';
  deleteButton.dataset.key = key;
  deleteButtonTd.appendChild(deleteButton);
  deleteButton.innerHTML = 'Delete';
  deleteButton.addEventListener('click', promptDeletion);

  row.appendChild(locNameTd);
  //col.appendChild(ltdTd);
  //col.appendChild(lngTd);
  row.appendChild(recTd);
  row.appendChild(coTd);
  row.appendChild(genTd);
  row.appendChild(speTd);
  row.appendChild(editButtonTd);
  row.appendChild(viewButtonTd);
  row.appendChild(deleteButtonTd);

  document.getElementById('outputTable').appendChild(row);
  return row;

}
