import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    updateProfile,
} from "firebase/auth";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    addDoc,
    collection,
    getDocs,
    arrayRemove,
    arrayUnion,
    updateDoc,
    deleteDoc,
    query,
    limit,
    serverTimestamp,
} from "firebase/firestore";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCjFjyMbmiEZDeu9Pb6IluxC3cXydh4E2Q",
    authDomain: "interviewme-e1d7b.firebaseapp.com",
    projectId: "interviewme-e1d7b",
    storageBucket: "interviewme-e1d7b.appspot.com",
    messagingSenderId: "37245466823",
    appId: "1:37245466823:web:db8e2d92e3cfcacbc4a6e2",
    measurementId: "G-VNZQTR221J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export {
    db,
    app,
    auth,
    storage,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    doc,
    setDoc,
    getDoc,
    addDoc,
    collection,
    updateProfile,
    getDocs,
    getFirestore,
    deleteDoc,
    arrayRemove,
    updateDoc,
    arrayUnion,
    query,
    limit,
    serverTimestamp,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
};
