import './Profile.css'

import React from 'react'
import { signOut } from './auth.js'
import { useState, useEffect } from 'react'
import { useAuth } from './auth.jsx'
import { useNavigate } from 'react-router-dom'
import Record from '../Record.jsx'

const interviewQuestions = [
    "Can you tell me about a time you worked on a team to complete a project? What was your role, and what did you learn from the experience?",
    "How do you handle tight deadlines? Can you provide an example?",
    "quit"
    // "What is your greatest strength and how does it help you in your work?",
    // Add more questions as needed
];

const Profile = () => {
    const { currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [expectingFollowUp, setExpectingFollowUp] = useState(false); // Track follow-up state
    const [lastQuestionCheck, setLastQuestionCheck] = useState("")
    const [prevIsFollowUp, setPrevIsFollowUp] = useState(false)
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

    const handleTranscription = (transcribedText) =>{
        setInput(transcribedText);
        sendMessage(transcribedText);
    }

    const sendMessage = async (transcribedText) => {
        // if (input.trim()) {
        //     const userMessage = { role: "user", content: input };
        //     setMessages([...messages, userMessage]);



        const messageText = transcribedText || input;
        if(messageText.trim()){
            const userMessage = {role:"user", content: messageText};
            setMessages([...messages, userMessage]);
        




            const currentQuestion = interviewQuestions[currentQuestionIndex];
            const context = `Question: ${currentQuestion}`;
            if (interviewQuestions.length > 2) {
                setLastQuestionCheck(interviewQuestions[currentQuestionIndex + 2])

            }
            try {
                const response = await fetch('http://localhost:5000/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: input, context, lastQuestionCheck, prevIsFollowUp }),
                });
                const data = await response.json();
                const botMessage = { role: "bot", content: data.response };
                setMessages([...messages, userMessage, botMessage]);
                setInput("");

                if (data.followUp) {
                    // Process follow-up question
                    setPrevIsFollowUp(true)
                    if (!data.response.includes(data.followUp)) {
                        setMessages(prevMessages => [
                            ...prevMessages,
                            { role: "bot", content: data.followUp }
                        ]);
                    }

                    setExpectingFollowUp(true);
                } else {
                    setPrevIsFollowUp(false)
                    // Move to the next question if available
                    if (currentQuestionIndex < interviewQuestions.length - 1) {
                        console.log("Current question index:", currentQuestionIndex)
                        setCurrentQuestionIndex(currentQuestionIndex + 1);

                        const nextQuestion = interviewQuestions[currentQuestionIndex + 1];
                        setMessages(prevMessages => [
                            ...prevMessages,
                            { role: "bot", content: nextQuestion }
                        ]);
                        setExpectingFollowUp(false);
                    }



                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    const startInterview = () => {
        setInterviewStarted(true);
        const welcomeMessage = "Hello, excited to interview you!";
        const firstQuestion = interviewQuestions[0];
        setMessages([
            { role: "bot", content: welcomeMessage },
            { role: "bot", content: firstQuestion }
        ]);
        if (interviewQuestions[1] == "quit") {
            setLastQuestionCheck("quit")
        }
        setExpectingFollowUp(false);
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
            {!interviewStarted ? (
                <button onClick={startInterview}>Start Interview</button>
            ) : (
                // <div>
                //     <div>
                //         {messages.map((msg, index) => (
                //             <div key={index}>
                //                 <strong>{msg.role === "user" ? "You" : "Interviewer"}:</strong> {msg.content=="quit"? "That concludes your interview. Thank you for using our platform.": msg.content}
                //             </div>
                //         ))}
                //     </div>
                //     <input
                //         type="text"
                //         value={input}
                //         onChange={(e) => setInput(e.target.value)}
                //         placeholder="Type your message here..."
                //     />
                //     <button onClick={sendMessage}>Send</button>
                // </div>
                <div>
                    <div>
                        {messages.map((msg, index) => (<div key={index}>
                            <strong>{msg.role === "user" ? "You" : "Interviewer"}:</strong> {msg.content == "quit" ? "That concludes your interview. Thank you for using our platform." : msg.content} </div>
                        ))}
                    </div> <Record onTranscriptionComplete={handleTranscription} />
                </div>
            )}

        </div>
    );
};

export default Profile;
