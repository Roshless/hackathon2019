var icon_schodygreen = L.icon({
	iconUrl: 'ikony/schodygreen.png',

	iconSize:     [50, 50], // size of the icon
	iconAnchor:   [40, 45], // point of the icon which will correspond to marker's location
	popupAnchor:  [-14, -48] // point from which the popup should open relative to the iconAnchor
});

var icon_schodyred = L.icon({
	iconUrl: 'ikony/schodyred.png',

	iconSize:     [50, 50], // size of the icon
	iconAnchor:   [40, 45], // point of the icon which will correspond to marker's location
	popupAnchor:  [-14, -48] // point from which the popup should open relative to the iconAnchor
});

var icon_podjazdgreen = L.icon({
	iconUrl: 'ikony/podjazdgreen.png',

	iconSize:     [50, 50], // size of the icon
	iconAnchor:   [40, 45], // point of the icon which will correspond to marker's location
	popupAnchor:  [-14, -48] // point from which the popup should open relative to the iconAnchor
});

var icon_podjazdred = L.icon({
	iconUrl: 'ikony/podjazdred.png',

	iconSize:     [50, 50], // size of the icon
	iconAnchor:   [40, 45], // point of the icon which will correspond to marker's location
	popupAnchor:  [-14, -48] // point from which the popup should open relative to the iconAnchor
});

var icon_windared = L.icon({
	iconUrl: 'ikony/windared.png',

	iconSize:     [50, 50], // size of the icon
	iconAnchor:   [40, 45], // point of the icon which will correspond to marker's location
	popupAnchor:  [-14, -48] // point from which the popup should open relative to the iconAnchor
});

var icon_windagreen = L.icon({
	iconUrl: 'ikony/windagreen.png',

	iconSize:     [50, 50], // size of the icon
	iconAnchor:   [40, 45], // point of the icon which will correspond to marker's location
	popupAnchor:  [-14, -48] // point from which the popup should open relative to the iconAnchor
});

var icon_zapytaniegreen = L.icon({
	iconUrl: 'ikony/zapytaniegreen.png',

	iconSize:     [50, 50], // size of the icon
	iconAnchor:   [40, 45], // point of the icon which will correspond to marker's location
	popupAnchor:  [-14, -48] // point from which the popup should open relative to the iconAnchor
});

var icon_zapytaniered = L.icon({
	iconUrl: 'ikony/zapytaniered.png',

	iconSize:     [50, 50], // size of the icon
	iconAnchor:   [40, 45], // point of the icon which will correspond to marker's location
	popupAnchor:  [-14, -48] // point from which the popup should open relative to the iconAnchor
});

class theMarker {
	constructor(text, lat, lng, icon) {
		this.text = text;
		this.latitude = lat;
		this.longitude = lng;
		this.icon = icon
	}
}

let db;
let dbReq = indexedDB.open('map', 3);

dbReq.onupgradeneeded = function(event) {
	// Set the db variable to our database so we can use it!  
	db = event.target.result;

	// Create an object store named notes. Object stores
	// in databases are where data are stored.
	let markers = db.createObjectStore('markers', {autoIncrement: true});
}
dbReq.onsuccess = function(event) {
	db = event.target.result;
}

dbReq.onerror = function(event) {
	alert('error opening database ' + event.target.errorCode);
}

function addMarker(db, message, lat, lng, icon_name) {
  // Start a database transaction and get the notes object store
  let tx = db.transaction('markers', 'readwrite');
  let store = tx.objectStore('markers');

  // Put the sticky note into the object store
  let marker = new theMarker(message, lat, lng, icon_name);
  store.add(marker);

  // Wait for the database transaction to complete
  tx.oncomplete = function() { console.log('stored note!') }
  tx.onerror = function(event) {
	alert('error storing note ' + event.target.errorCode);
  }
}

function getAllMarkers(db) {
	// Start a database transaction and get the notes object store
	let tx = db.transaction('markers', 'readwrite');
	let store = tx.objectStore('markers');


	store.openCursor().onsuccess = function (e) {
		 var cursor = e.target.result;
		 if (cursor) {
			 L.marker([cursor.value.latitude, cursor.value.longitude], {icon: window[cursor.value.icon]}).addTo(mymap).bindPopup(cursor.value.text).openPopup();
			 cursor.continue();
		 }
	 }
}

var mymap = L.map('map').fitWorld();

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Hello world',
	id: 'mapbox.streets'
}).addTo(mymap);

var lat, lng;

var popup = L.popup();
var new_mark;

function onMapClick(e) {
	if (new_mark) { // check
		mymap.removeLayer(new_mark); // remove
	}
	new_mark = L.marker().setLatLng(e.latlng).addTo(mymap);
	lat = e.latlng.lat;
	lng = e.latlng.lng;
}

function addMarkerWithComment() {
	var comment = document.getElementById("comment").value;
	if (comment == "") {
		comment = "brak komentarza";
	}
	var local_icon;
	
	if(document.getElementById("icon_podjazd").checked && document.getElementById("colors_red").checked) {
		local_icon = "icon_podjazdred";
	} else if(document.getElementById("icon_podjazd").checked && document.getElementById("colors_green").checked) {
		local_icon = "icon_podjazdgreen";
	} else if(document.getElementById("icon_schody").checked && document.getElementById("colors_red").checked) {
		local_icon = "icon_schodyred";
	} else if(document.getElementById("icon_schody").checked && document.getElementById("colors_green").checked) {
		local_icon = "icon_schodygreen";
	} else if(document.getElementById("icon_winda").checked && document.getElementById("colors_green").checked) {
		local_icon = "icon_windagreen";
	} else if(document.getElementById("icon_winda").checked && document.getElementById("colors_red").checked) {
		local_icon = "icon_windared";
	} else if(document.getElementById("icon_zapytanie").checked && document.getElementById("colors_green").checked) {
		local_icon = "icon_zapytaniegreen";
	} else if(document.getElementById("icon_zapytanie").checked && document.getElementById("colors_red").checked) {
		local_icon = "icon_zapytaniered";
	}
	
	addMarker(db, comment, lat, lng, local_icon);
	document.getElementById('comment').value = "";
	new_mark.setIcon(window[local_icon]).bindPopup(comment).openPopup();
	new_mark = null;
}

mymap.locate({setView: true, maxZoom: 16});

mymap.on('click', onMapClick);

window.onload = function() {
	getAllMarkers(db);
};
