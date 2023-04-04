
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

initializeApp(firebaseConfig)

console.log("hello from signIn.html")

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


const logoutButton = document.querySelector('.logout')
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
        console.log('user logged in:', cred.user)
       })
       .catch((err) => {
        console.log(err.message)
       })
})

onAuthStateChanged(auth, (user) => {
    console.log("user status changed: ", user)
})
