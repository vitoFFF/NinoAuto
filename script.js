var map = L.map('map').setView([41.923258, 42.005999], 17.0);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);





var streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

var satelliteLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 20,
  subdomains:['mt0','mt1','mt2','mt3']
});

var currentLayer = streetLayer; // Start with street map layer

function toggleMapStyle() {
  if (currentLayer === streetLayer) {
    map.removeLayer(streetLayer);
    map.addLayer(satelliteLayer);
    currentLayer = satelliteLayer;
  } else {
    map.removeLayer(satelliteLayer);
    map.addLayer(streetLayer);
    currentLayer = streetLayer;
  }
}






var leftIcon = L.icon({
  iconUrl: 'icons/turn-left-90.png',
  iconSize: [28, 28],
  iconAnchor: [12, 12],
  popupAnchor: [0, -10],
});

var rightIcon = L.icon({
  iconUrl: 'icons/turn-right-90.png',
  iconSize: [28, 28],
  iconAnchor: [12, 12],
  popupAnchor: [0, -10],
});

var crossroad2 = L.marker([41.923599, 42.005671], { icon: leftIcon }).addTo(map).bindPopup('Crossroad 2');
var crossroad3 = L.marker([41.923045, 42.005638], { icon: rightIcon }).addTo(map).bindPopup('Crossroad 3');

var startPoint = L.circleMarker([41.925038, 42.012815], { color: 'red', fillColor: 'blue', fillOpacity: 1, radius: 10 }).addTo(map).bindPopup('Start Point');
var endPoint = L.circleMarker([41.923094, 42.003497], { color: 'red', fillColor: 'blue', fillOpacity: 1, radius: 10 }).addTo(map).bindPopup('End Point');

var polyline = L.polyline([
  [41.925038, 42.012815], 
  [41.924499, 42.011045], 
  [41.923822, 42.007521], 
  [41.923599, 42.005671], 
  [41.923045, 42.005638], 
  [41.923094, 42.003497]  
], {color: 'blue', weight: 8}).addTo(map);

map.on('zoomend', function() {
  var zoomLevel = map.getZoom();
  var scaleFactor = 1 + (zoomLevel - 15); // Adjust this value as needed
  var minIconSize = 2; // Define a minimum size for the icon

  var newIconSize = 25 * scaleFactor;
  if (newIconSize < minIconSize) {
    newIconSize = minIconSize;
  }

  leftIcon.options.iconSize = [newIconSize, newIconSize];
  rightIcon.options.iconSize = [newIconSize, newIconSize];
  
  // Update icon sizes using setStyle()
  crossroad2.setStyle({icon: leftIcon});
  crossroad3.setStyle({icon: rightIcon});
});

function startExam() {
  // Add functionality for "Start Exam" button
  alert("Starting exam...");
}

var bigCircle = L.circle([41.925038, 42.012815], {
  color: 'red',
  fillColor: 'yellow',
  fillOpacity: 0.8,
  radius: 20 // Adjust the radius as needed to make it bigger
}).addTo(map).bindPopup('Big Circle at Start Point');


function resetAnimation() {
  clearInterval(animationInterval); // Stop the animation
  bigCircle.setLatLng([41.925038, 42.012815]); // Reset the position of the bigCircle to the start point
}


var audioPlayed = false; // Flag to track if the audio has been played

function startAnimation() {

  // Play the start audio
  var startAudio = document.getElementById("startAudio");
  startAudio.play();

  var polylineCoords = [
    [41.925038, 42.012815], 
    [41.924499, 42.011045], 
    [41.923822, 42.007521], 
    [41.923599, 42.005671], 
    [41.923045, 42.005638], 
    [41.923094, 42.003497]
  ];

  var currentIndex = 0;
  var totalSteps = 200; // Increased total steps for finer interpolation
  var currentStep = 0;

  animationInterval = setInterval(function() {
    if (currentIndex === polylineCoords.length - 1) {
      clearInterval(animationInterval); // Stop the animation when reaching the end of the polyline
      return;
    }

    var startPoint = polylineCoords[currentIndex];
    var endPoint = polylineCoords[currentIndex + 1];
    var interpolatedPoint = [
      startPoint[0] + (endPoint[0] - startPoint[0]) * (currentStep / totalSteps),
      startPoint[1] + (endPoint[1] - startPoint[1]) * (currentStep / totalSteps)
    ];

    bigCircle.setLatLng(interpolatedPoint); // Set the position of the bigCircle to the interpolated point

    // Check if the bigCircle is near crossroad2
    var distanceToCrossroad2 = bigCircle.getLatLng().distanceTo(crossroad2.getLatLng());
    var alertThreshold = 400; // Define the threshold distance for triggering the alert

    if (!audioPlayed && distanceToCrossroad2 < alertThreshold) {
      var audioPlayer = document.getElementById("audioPlayer");
      audioPlayer.play(); // Play the audio only if it hasn't been played already
      audioPlayed = true; // Set the flag to true to indicate that the audio has been played
    }

    currentStep++;
    if (currentStep > totalSteps) {
      currentIndex++; // Move to the next segment of the polyline
      currentStep = 0; // Reset current step
    }
  }, 50); // Decreased interval duration for smoother animation
}

function stopAudio() {
  var audioPlayer = document.getElementById("audioPlayer");
  audioPlayer.pause(); // Pause the audio when it finishes playing
}

function resetAnimation() {
  clearInterval(animationInterval); // Stop the animation
  var audioPlayer = document.getElementById("audioPlayer");
  audioPlayer.pause(); // Pause the audio
  audioPlayed = false; // Reset the flag to indicate that the audio hasn't been played
  
  // Reset the position of the bigCircle to the start point
  bigCircle.setLatLng([41.925038, 42.012815]);
}
