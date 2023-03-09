import { initializeApp } from 'firebase/app'
import {getFirestore, collection, getDocs, addDoc, doc, deleteDoc, onSnapshot, query, where, orderBy, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from 'firebase/auth'
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCJkcepY6HJgxynvSewRpW0oXkalE9nFH0",
    authDomain: "sample-b60fb.firebaseapp.com",
    projectId: "sample-b60fb",
    storageBucket: "sample-b60fb.appspot.com",
    messagingSenderId: "686259038560",
    appId: "1:686259038560:web:34ff96dcbde01de57c9605"
  };

initializeApp(firebaseConfig)
const auth = getAuth()

// init services
const db = getFirestore()

// collection ref
const colRef = collection(db, 'songs')

// queries
const q = query(colRef, orderBy('createdAt'))

//database
const dataBase = getDatabase()

onSnapshot(colRef, (snapshot) => {
    let songs = []
    snapshot.docs.forEach((doc) => {
      songs.push({ ...doc.data(), id: doc.id })
    })
    console.log(songs)
})

//adding songs
const addSongForm = document.querySelector('.add')
addSongForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    addDoc(colRef, {
        artist: addSongForm.artist.value,
        title: addSongForm.title.value,
        createdAt: serverTimestamp()
    })
    .then(() => {
        addSongForm.reset()
    })

})

//deleting songs
const deleteSongForm = document.querySelector('.delete')
deleteSongForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'songs', deleteSongForm.id.value)
    deleteDoc(docRef)
       .then(() => {
          deleteSongForm.reset()
       })

})

// get a single doc
const docRef = doc(db, 'songs', 'izsHhIoYfdMohCIWBfbA')

onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
})

//Update a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'songs', updateForm.id.value)
    updateDoc(docRef, {
        title: 'updated title'
    })
    .then(() => {
        updateForm.reset()
    })
})

//signing a user up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value

    createUserWithEmailAndPassword(auth, email, password)
       .then((cred) => {
        console.log("user created:", cred.user)
        signupForm.reset()
       })
       .catch((err) => {
        console.log(err.message)
       })
})

const logoutButton = document.querySelector('.login')
logoutButton.addEventListener('click', () => {
    signOut(auth)
       .then(() => {
        console.log('The user signed out')
       })
       .catch((err) => {
        console.log(err.message)
       })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password)
       .then((cred) => {
        console.log('user logged in', cred.user)
       })
       .catch((err) => {
        console.log(err.message)
       })
})
