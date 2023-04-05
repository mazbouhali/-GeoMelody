
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

///////////////////////////////////////////////////////////////////////////////
////////////////////////////// AUD-D API /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const button = document.getElementById('audD');
var axios = require("axios");

button.addEventListener('click', (event) => {
  event.preventDefault();
  const url = document.getElementById('audioUrl').value;

  var data = {
    'api_token': 'ea9ce5f98f4ac6388733c8efe213c884',
    'url': url,
    'accurate_offsets': 'true',
    'skip': '3',
    'every': '1',
  };
  
  axios({
    method: 'post',
    url: 'https://enterprise.audd.io/',
    data: data,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  .then((response) => {
    console.log(response);
  })
  .catch((error) =>  {
    console.log(error);
  });
});
