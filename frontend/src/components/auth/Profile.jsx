import './Profile.css'

import React from 'react'
import { signOut } from './auth.js'
import { useState, useEffect } from 'react'
import { useAuth } from './auth.jsx'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
    const { currentUser } = useAuth()
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (currentUser) {
            setUser({
                email: currentUser.email,
                name: currentUser.displayName || "User",
            })
        }
    }, [currentUser])


    const handleSignout = async () => {
        try {
            await signOut()
            navigate('/')
        }
        catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <div>
            {user && (
                <div>
                    <h1>Welcome, {user.name}</h1>
                    <p>{user.email}</p>
                    <button onClick={handleSignout}>Sign Out</button>



                </div>

            )}
        </div>
    )
}


export default Profile