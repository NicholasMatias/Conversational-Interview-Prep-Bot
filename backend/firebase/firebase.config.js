
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup } from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyCjFjyMbmiEZDeu9Pb6IluxC3cXydh4E2Q",
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