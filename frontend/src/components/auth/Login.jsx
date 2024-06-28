import './Login.css'

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, signInWithFacebook, signInWithGoogle} from './auth'
import { useState } from 'react'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(email, password)
            navigate('/profile')
        }
        catch (error) {
            console.error('Error during email/ password sign-in',error)
        }
    }


    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle()
            navigate('/profile')

        }
        catch (error) {
            console.error(error)
        }
    }

    const handleFacebookLogin = async () => {
        try {
            await signInWithFacebook()
            navigate('/profile')

        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type='submit'>Login</button>
            </form>
            <button onClick={handleFacebookLogin}>Login with Facebook</button>
            <button onClick={handleGoogleLogin}>Login with Google</button>
        </div>
    )


}

export default Login