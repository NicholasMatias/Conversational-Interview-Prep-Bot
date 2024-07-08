import { auth } from '../../../../backend/firebase/firebase.config'

import {
    signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
    createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup
} from '../../../../backend/firebase/firebase.config';

export const signInWithEmailAndPassword = (email, password) => {
    return firebaseSignInWithEmailAndPassword(auth, email, password);
};

export const createUserWithEmailAndPassword = (email, password) => {
    return firebaseCreateUserWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
};

export const signInWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    return signInWithPopup(auth, provider);
};

export const signOut = () => {
    return firebaseSignOut(auth);
};



