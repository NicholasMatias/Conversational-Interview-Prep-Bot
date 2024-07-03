import './Profile.css'

import React from 'react'
import { signOut } from './auth.js'
import { useState, useEffect } from 'react'
import { useAuth } from './auth.jsx'
import { useNavigate } from 'react-router-dom'

// const Profile = () => {
//     const { currentUser } = useAuth()
//     const [user, setUser] = useState(null)
//     const navigate = useNavigate()

//     useEffect(() => {
//         if (currentUser) {
//             setUser({
//                 email: currentUser.email,
//                 name: currentUser.displayName || "User",
//             })
//         }
//     }, [currentUser])


//     const handleSignout = async () => {
//         try {
//             await signOut()
//             navigate('/')
//         }
//         catch (error) {
//             console.error('Error signing out:', error)
//         }
//     }

//     return (
//         <div>
//             {user && (
//                 <div>
//                     <h1>Welcome, {user.name}</h1>
//                     <p>{user.email}</p>
//                     <button onClick={handleSignout}>Sign Out</button>



//                 </div>

//             )}
//         </div>
//     )
// }


// export default Profile









const Profile = () => {
    const { currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            setUser({
                email: currentUser.email,
                name: currentUser.displayName || "User",
            });
        }
    }, [currentUser]);

    const handleSignout = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out', error);
        }
    };

    const sendMessage = async () => {
        if (input.trim()) {
            const userMessage = { role: "user", content: input };
            setMessages([...messages, userMessage]);

            try {
                const response = await fetch('http://localhost:5000/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: input }),
                });
                const data = await response.json();
                const botMessage = { role: "Interviewer", content: data.response };
                setMessages([...messages, userMessage, botMessage]);
            } catch (error) {
                console.error('Error sending message:', error);
            }

            setInput("");
        }
    };

    return (
        <div>
            {user && (
                <>
                    <h1>Welcome, {user.name}</h1>
                    <p>{user.email}</p>
                    <button onClick={handleSignout}>Sign Out</button>
                </>
            )}
            <div>
                <div>
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <strong>{msg.role === "user" ? "You" : "Interviewer"}:</strong> {msg.content}
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message here..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Profile;
