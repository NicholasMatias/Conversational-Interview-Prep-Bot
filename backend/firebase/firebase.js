
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const express = require('express')
// const cors = require('cors')
// require('dotenv').config()
import 'dotenv/config'



// console.log('Testing the process.env:',process.env)
const testKey = import.meta.env.API_KEY
console.log('Firebase api key:', testKey)

const firebaseConfig = {
    apiKey: import.meta.env.API_KEY,
    authDomain: "interviewme-e1d7b.firebaseapp.com",
    projectId: "interviewme-e1d7b",
    storageBucket: "interviewme-e1d7b.appspot.com",
    messagingSenderId: "37245466823",
    appId: "1:37245466823:web:db8e2d92e3cfcacbc4a6e2",
    measurementId: "G-VNZQTR221J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)


export { app, auth, GoogleAuthProvider, FacebookAuthProvider }
