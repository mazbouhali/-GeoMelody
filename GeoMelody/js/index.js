
import { initializeApp } from 'firebase/app'
import {getFirestore, collection, getDocs, addDoc, doc, deleteDoc, onSnapshot, query, where, orderBy, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'

//Allows us to connect firebase to our project
const firebaseConfig = {
  apiKey: "AIzaSyCJkcepY6HJgxynvSewRpW0oXkalE9nFH0",
  authDomain: "sample-b60fb.firebaseapp.com",
  projectId: "sample-b60fb",
  storageBucket: "sample-b60fb.appspot.com",
  messagingSenderId: "686259038560",
  appId: "1:686259038560:web:34ff96dcbde01de57c9605"
};

console.log("Hello from index.js")

initializeApp(firebaseConfig)

// Authentication services
const auth = getAuth()

// init services
const db = getFirestore()

// collection reference
const colRef = collection(db, 'songs')

// queries
const q = query(colRef, orderBy('createdAt'))

// get real time collection data
onSnapshot(colRef, (snapshot) => {
    let songs = []
    snapshot.docs.forEach((doc) => {
      songs.push({ ...doc.data(), id: doc.id })
    })
    console.log(songs)
})

/*
//adding docs
const addSongForm = document.querySelector('.add')
addSongForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
    Title: addSongForm.title.value,
    Artist: addSongForm.artist.value,
    createdAt: serverTimestamp()
  })
})
*/

//deleting docs
const deleteSongForm = document.querySelector('.delete')
deleteSongForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'songs', deleteSongForm.id.value)

  deleteDoc(docRef)
  .then(() => {
    deleteSongForm.reset()
  })
})

///////////////////////////////////////////////////////////////////////////////
////////////////////////////// AUD-D API / Google Maps API ////////////////////
///////////////////////////////////////////////////////////////////////////////
const button = document.getElementById('audD');
var axios = require("axios");

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

      const url = document.getElementById('audioUrl').value;
      var data = {
        'api_token': 'ea9ce5f98f4ac6388733c8efe213c884',
        'url': url,
        'accurate_offsets': 'true',
        'skip': '3',
        'every': '1',
        'lat': latitude,  // Add latitude parameter to API request
        'lng': longitude  // Add longitude parameter to API request
      };

      axios({
        method: 'post',
        url: 'https://enterprise.audd.io/',
        data: data,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        const artist = response.data.result[0].songs[0].artist;
        const title = response.data.result[0].songs[0].title;
        addDoc(colRef, {
          Artist: artist,
          Title: title,
          createdAt: serverTimestamp()
        })
        .then(() => {
          console.log(`Added ${title} by ${artist} to Firestore`);
          const notification = document.createElement('div');
          notification.classList.add('notification');
          notification.textContent = `This song is ${title} by ${artist}`;
          document.body.appendChild(notification);
          setTimeout(() => {
            notification.remove();
          }, 5000);

          // Call the initMap function with the user's current location
          initMap(latitude, longitude);
        })
        .catch((error) => {
          console.error(`Error adding ${title} by ${artist} to Firestore: `, error);
        });
      })
      .catch((error) =>  {
        console.log(error);
      });
    });
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

button.addEventListener('click', (event) => {
  event.preventDefault();
  getLocation();  // Call the getLocation() function to get the user's location
});

function initMap(latitude, longitude) {
  // Create a map centered on the user's location
  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: latitude, lng: longitude },
    zoom: 15
  });

  // Add a marker for the user's location
  const marker = new google.maps.Marker({
    position: { lat: latitude, lng: longitude },
    map: map,
    title: 'Your location'
  });
}

//////////////////////////////////////////////////////////////////////
///////////////////////Google Maps API////////////////////////////////
//////////////////////////////////////////////////////////////////////
/*
// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 6,
  });
  infoWindow = new google.maps.InfoWindow();

  const locationButton = document.createElement("button");

  locationButton.textContent = "Pan to Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

window.initMap = initMap;
*/