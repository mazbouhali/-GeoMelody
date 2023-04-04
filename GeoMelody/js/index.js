
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


const axios = require("axios");

const options = {
  method: 'GET',
  url: 'https://shazam.p.rapidapi.com/shazam-events/list', //Shazam API Endpoint
  //Parameters needed to retrieve the list of Shazam events
  params: {artistId: '73406786', l: 'en-US', from: '2022-12-31', limit: '50', offset: '0'},
  headers: {
    'X-RapidAPI-Key': '745ce762a9msh0536864325395c8p1d4713jsne89175c7ad35',
    'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
  }
};


//Sends the GET request to the API endpoint with the 'options' object as a parameter
axios.request(options).then(function (response) {
  //The response data from the Shazam API is logged to the console
	console.log(response.data);
}).catch(function (error) { //Error handling
	console.error(error);
});

const form = document.getElementById('musicRecognitionForm');
const input = document.getElementById('audioFile');

form.addEventListener('submit', (event) => {
  event.preventDefault(); // prevent the form from submitting

  const file = input.files[0];
  const reader = new FileReader();

  reader.onloadend = function() {
    const data = new FormData();
    data.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://shazam.p.rapidapi.com/shazam-events/list', true);
    xhr.setRequestHeader('x-rapidapi-key', '745ce762a9msh0536864325395c8p1d4713jsne89175c7ad3');
    xhr.setRequestHeader('x-rapidapi-host', 'shazam.p.rapidapi.com');

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        console.log(response);
      }
    }

    xhr.send(data);
  };

  reader.readAsDataURL(file);
  
});
