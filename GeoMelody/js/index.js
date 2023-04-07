
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

      const geocoder = new google.maps.Geocoder();
      const latlng = { lat: latitude, lng: longitude };

      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            const address = results[0].formatted_address;
            console.log(`Address: ${address}`);

            const url = document.getElementById('audioUrl').value;
            const data = {
              'api_token': 'ea9ce5f98f4ac6388733c8efe213c884',
              'url': url,
              'accurate_offsets': 'true',
              'skip': '3',
              'every': '1',
              'address': address // Add address parameter to API request
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
                Address: address, // Add address field to Firestore document
                createdAt: serverTimestamp()
              })
              .then(() => {
                //console.log(`Added ${title} by ${artist} with address ${address} to Firestore`);
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
                console.error(`Error adding ${title} by ${artist} with address ${address} to Firestore: `, error);
              });
            })
            .catch((error) =>  {
              console.log(error);
            });
          } else {
            console.log('No results found');
          }
        } else {
          console.log(`Geocoder failed due to: ${status}`);
        }
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