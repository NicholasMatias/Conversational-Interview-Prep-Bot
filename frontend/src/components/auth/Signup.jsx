import './Signup.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from './auth.js'
import { useState } from 'react'
import { updateProfile } from 'firebase/auth'
import Spacing from '../landing_page/spacing/Spacing.jsx'
import Footer from '../landing_page/footer/Footer.jsx'
import { doc,  setDoc ,collection, addDoc} from "firebase/firestore";
import { db } from "../../../../backend/firebase/firebase.config.js";


const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate()

    const handleSignup = async (e) => {
        e.preventDefault()
        try {
            const userCredential = await createUserWithEmailAndPassword(email, password)
            const user = userCredential.user



            const userid = user.uid;
            try {
                await setDoc(doc(db, "users", userid), {
                    username: username,
                    email: email,
                    folderNames: [`${username}'s Default Folder`]
                });

                const foldersRef = collection(db,"users", userid, `${username}'s Default Folder`);
                await addDoc(foldersRef,{
                    folderName: `${username}'s Default Folder`,
                    createdAt: new Date(),
                })

            } catch (e) {
                console.error("Error adding document: ", e);
            }



            await updateProfile(user, {
                displayName: username
            })
            navigate('/profile')
        }
        catch (err) {
            const errorMessage = err.message;
            const errorCode = err.code;

            setError(true);

            switch (errorCode) {
                case "auth/weak-password":
                    setErrorMessage("The password is too weak.");
                    break;
                case "auth/email-already-in-use":
                    setErrorMessage(
                        "This email address is already in use by another account."
                    );
                case "auth/invalid-email":
                    setErrorMessage("This email address is invalid.");
                    break;
                case "auth/operation-not-allowed":
                    setErrorMessage("Email/password accounts are not enabled.");
                    break;
                default:
                    setErrorMessage(errorMessage);
                    break;
            }
        }
    }

    const backToLogin = () => {
        navigate('/login')
    }

    const handleHome =() =>{
        navigate('/')
    }

    return (
        <>
            <nav className='navBar-container'>
                <div className="navbar">
                    <div className="brand">
                        InterviewMe
                    </div>
                    <ul className="nav-links">
                        <li><a type='button' onClick={handleHome} >Home</a></li>

                    </ul>
                </div>
            </nav>
            <Spacing/>
            <div className='signup-form'>
                <h2>Signup</h2>
                <form onSubmit={handleSignup}>
                    <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type='submit'>Signup</button>
                </form>
                {error && <p className='error-message'>{errorMessage}</p>}

                <p className='form-footer'>Already have an account? </p>
                <button className = "login-button"onClick={backToLogin}>Login</button>
            </div>
            <Spacing />
            <Footer />
        </>

    )
}

export default Signup