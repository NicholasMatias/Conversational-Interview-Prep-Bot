import { auth } from '../../../../backend/firebase/firebase'

import {
    signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
    createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup
} from 'firebase/auth';

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



//may implement password reset, email verification, and password change. Seems easy enough to add. 

// export const doPasswordReset = (email) => {
//     return sendPasswordResetEmail(auth, email)
// }

// export const doPasswordChange = (password) => {
//     return updatePassword(auth.currentUser, password)
// }


// export const doSendEmailVerification = () => {
//     return sendEmailVerification(auth.currentUser, {
//         url: `${window.location.origin}/home`,
//     })
// }