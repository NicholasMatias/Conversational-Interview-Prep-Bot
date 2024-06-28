import './Signup.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from './auth.js'
import { useState } from 'react'
import { updateProfile } from 'firebase/auth'

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
        navigate('/')
    }

    return (
        <div className='signup-form'>
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
                <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required/>
                <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type='submit'>Signup</button>
            </form>
            {error && <p>{errorMessage}</p>}

            <p className='form-footer'>Already have an account? <button onClick={backToLogin}>Login</button></p>
        </div>
    )
}

export default Signup