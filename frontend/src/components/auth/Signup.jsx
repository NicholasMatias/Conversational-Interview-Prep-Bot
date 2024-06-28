import './Signup.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from './auth.js'
import { useState } from 'react'
import { updateProfile } from 'firebase/auth'

const Signup = () =>{
    const [email, setEmail]= useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const navigate = useNavigate()

    const handleSignup = async(e) => {
        e.preventDefault()
        try{
            const userCredential = await createUserWithEmailAndPassword( email, password)
            const user = userCredential.user
            await updateProfile(user,{
                displayName:username
            })
            navigate('/profile')
        }
        catch(error){
            console.error('Error during signup:',error)
        }
    }

    const backToLogin = () =>{
        navigate('/')
    }

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
                <input type='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)}/>
                <input type='email' placeholder='Email' value={email} onChange={(e)=> setEmail(e.target.value)}/>
                <input type='password' placeholder='Password' value={password} onChange={(e)=> setPassword(e.target.value)}/>
                <button type='submit'>Signup</button>
            </form>
            <button onClick={backToLogin}>Login</button>
        </div>
    )
}

export default Signup