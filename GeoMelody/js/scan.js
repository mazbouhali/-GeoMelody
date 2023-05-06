import { initializeApp } from 'firebase/app';
import {getFirestore, collection, getDocs, addDoc, doc, deleteDoc, onSnapshot, query, where, orderBy, serverTimestamp, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import MicRecorder from 'mic-recorder-to-mp3';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
const recorder = new MicRecorder({
  bitRate: 128
});

//Allows us to connect firebase to our project
const firebaseConfig = {
  apiKey: "AIzaSyCJkcepY6HJgxynvSewRpW0oXkalE9nFH0",
  authDomain: "sample-b60fb.firebaseapp.com",
  projectId: "sample-b60fb",
  storageBucket: "sample-b60fb.appspot.com",
  messagingSenderId: "686259038560",
  appId: "1:686259038560:web:34ff96dcbde01de57c9605"
};

// Authentication services
initializeApp(firebaseConfig);
const storage = getStorage();
const auth = getAuth();

// Initialize Firestore service
const db = getFirestore();

// Get current user ID
let currentUserID;
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserID = user.uid;

    // Check if the user ID already exists in the user collection
    const userDocRef = doc(db, 'users', currentUserID);
    getDoc(userDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          console.log(`User ${currentUserID} already exists in the database.`);
        } else {
          // If the user ID doesn't exist, create a new document named after the user ID
          const userData = { id: currentUserID };
          setDoc(userDocRef, userData)
            .then(() => {
              console.log(`New user document created for user ${currentUserID}.`);
              
              // Create a new subcollection named 'data' for the user document
              const userDataRef = collection(db, 'users', currentUserID, 'data');
              addDoc(userDataRef, { message: 'Welcome to your new data subcollection!' })
                .then(() => {
                  console.log(`New data subcollection created for user ${currentUserID}.`);
                })
                .catch((error) => {
                  console.log(`Error creating data subcollection: ${error}`);
                });
            })
            .catch((error) => {
              console.log(`Error creating user document: ${error}`);
            });
        }
      })
      .catch((error) => {
        console.log(`Error checking user document: ${error}`);
      });
  }
});

// collection reference
const colRef = collection(db, 'songs')

// queries
const q = query(colRef, orderBy('createdAt'))

// get real time collection data
let songs = [];
onSnapshot(colRef, (snapshot) => {
    snapshot.docs.forEach((doc) => {
      songs.push({ ...doc.data(), id: doc.id })
    })
    console.log(songs)
})

// deleting docs
// const deleteSongForm = document.querySelector('.delete')
// deleteSongForm.addEventListener('submit', (e) => {
//   e.preventDefault()

//   const docRef = doc(db, 'songs', deleteSongForm.id.value)

//   deleteDoc(docRef)
//   .then(() => {
//     deleteSongForm.reset()
//   })
// })

///////////////////////////////////////////////////////////////////////////////
////////////////////////////// AUD-D API / Google Maps API ////////////////////
///////////////////////////////////////////////////////////////////////////////

const button = document.getElementById('audD');
const input = document.getElementById('audioFile');
var axios = require("axios");
const musicRecognitionForm = document.querySelector('#musicRecognitionForm');
musicRecognitionForm.addEventListener('submit', (event) => {
  event.preventDefault(); // prevent the form from submitting
});

button.addEventListener('click', (event) => {
  recordAudio();
    // Call the getLocation() function to get the user's location
});
let globalaudio;

function recordAudio() {
  // Start recording
recorder.start().then(() => {
  console.log('Recording started');

  // Stop recording after 7 seconds
  setTimeout(() => {
    recorder.stop().getMp3().then(([buffer, blob]) => {
    console.log('Recording stopped');
    // Create a reference to the audio file with a unique name
    const storageRef = ref(storage, `${currentUserID}_${Date.now()}.mp3`);

        // Upload the audio file to Firebase Storage
        uploadBytes(storageRef, blob).then(() => {
        console.log('Audio file uploaded to Firebase Storage.');

        // Get the download URL of the uploaded audio file
        getDownloadURL(storageRef).then((audioUrl) => {
        console.log('Audio file download URL:', audioUrl);
        globalaudio = audioUrl
        console.log(globalaudio)

        // Set the source of the recorded audio element to the audio URL
        //const recordedAudio = document.querySelector('#recordedAudio');
        //recordedAudio.src = audioUrl;

        getLocation();
    });
  });
});
  }, 7000);
});

}

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  
        const geocoder = new google.maps.Geocoder();
        const latlng = { lat: latitude, lng: longitude };
  
        geocoder.geocode({ location: latlng, language: 'en'  }, (results, status) => {
          if (status === "OK") {
            if (results[0]) {
              const address = results[0].formatted_address;
              console.log(`Address: ${address}`);

              const data = {
                'api_token': 'ea9ce5f98f4ac6388733c8efe213c884',
                'url': globalaudio,
                'address': address,
            };
            console.log("Testing globalaudio", globalaudio)
              axios({
                method: 'post',
                url: 'https://api.audd.io/',
                data: data,
                headers: { 'Content-Type': 'multipart/form-data' },
              })
                .then((response) => {
                  console.log('Response status:', response.status);
                  console.log('Artist:', response.data.result.artist);
                    const artist = response.data.result.artist;
                    const title = response.data.result.title;
                    const userDocRef = doc(db, "users", currentUserID);
                    addDoc(collection(userDocRef, "data"), {
                      Artist: artist,
                      Title: title,
                      Address: address,
                      createdAt: serverTimestamp()
                    })
                    .catch((error) => {
                      console.error(`Error adding ${title} by ${artist} with address ${address} to Firestore: `, error);
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
                  document.getElementById("map").style.display = "block";
                })
                .catch((error) => {
                  console.error(`Error adding ${title} by ${artist} with address ${address} to Firestore: `, error);
                });
              })
              .catch((error) =>  {
                console.log(error);
              });
              
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
