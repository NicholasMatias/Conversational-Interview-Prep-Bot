import './Profile.css'

import React from 'react'
import { signOut } from 'firebase/auth'
import { useState,useEffect } from 'react'


const Profile = () => {
    const { currentUser }  = useAuth()
    const [user, setUser] = useState(null)
    
    useEffect (()=>{
        if( currentUser){
            setUser({
                email: currentUser.email,
                name: currentUser.displayName || "User",
            })
        }
    }, [currentUser])


    return (
        <div>
            {user && (
                <div>
                    <h1>Welcome, {user.name}</h1>
                    <p>{user.email}</p>
                    <button onClick={() => signOut()}>Sign Out</button>



                </div>
                
            )}
        </div>
    )
}


export default Profile