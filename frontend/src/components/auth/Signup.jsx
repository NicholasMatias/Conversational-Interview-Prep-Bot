import './Signup.css'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'

const Signup = () =>{
    const [email, setEmail]= useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSignup = async(e) => {
        e.preventDefault()
        try{
            await createUserWithEmailAndPassword(email,password)
            navigate('/profile')
        }
        catch(error){
            console.error(error)
        }
    }


    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
                <input type='email' placeholder='Email' value={email} onChange={(e)=> setEmail(e.target.value)}/>
                <input type='password' placeholder='Password' value={password} onChange={(e)=> setPassword(e.target.value)}/>
                <button type='submit'>Signup</button>
            </form>
        </div>
    )
}

export default Signup