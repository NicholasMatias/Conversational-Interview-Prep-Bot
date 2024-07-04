import './Profile.css'

import React from 'react'
import { signOut } from './auth.js'
import { useState, useEffect } from 'react'
import { useAuth } from './auth.jsx'
import { useNavigate } from 'react-router-dom'






// const interviewQuestions = [
//     "Can you tell me about a time you worked on a team to complete a project? What was your role, and what did you learn from the experience?",
//     "How do you handle tight deadlines? Can you provide an example?",
//     "What is your greatest strength and how does it help you in your work?",
//     // Add more questions as needed
// ];

// const Profile = () => {
//     const { currentUser } = useAuth();
//     const [user, setUser] = useState(null);
//     const [input, setInput] = useState("");
//     const [messages, setMessages] = useState([]);
//     const [interviewStarted, setInterviewStarted] = useState(false);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the current question
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (currentUser) {
//             setUser({
//                 email: currentUser.email,
//                 name: currentUser.displayName || "User",
//             });
//         }
//     }, [currentUser]);

//     const handleSignout = async () => {
//         try {
//             await signOut();
//             navigate('/');
//         } catch (error) {
//             console.error('Error signing out', error);
//         }
//     };

//     const sendMessage = async () => {
//         if (input.trim()) {
//             const userMessage = { role: "user", content: input };
//             setMessages([...messages, userMessage]);

//             try {
//                 const response = await fetch('http://localhost:5000/api/chat', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ message: input }),
//                 });
//                 const data = await response.json();
//                 const botMessage = { role: "bot", content: data.response };
//                 setMessages([...messages, userMessage, botMessage]);
//                 setInput("");

//                 // Move to the next question if available
//                 if (currentQuestionIndex < interviewQuestions.length - 1) {
//                     setCurrentQuestionIndex(currentQuestionIndex + 1);
//                     const nextQuestion = interviewQuestions[currentQuestionIndex + 1];
//                     setMessages(prevMessages => [
//                         ...prevMessages,
//                         { role: "bot", content: nextQuestion }
//                     ]);
//                 }
//             } catch (error) {
//                 console.error('Error sending message:', error);
//             }
//         }
//     };

//     const startInterview = () => {
//         setInterviewStarted(true);
//         const welcomeMessage = "Hello, excited to interview you!";
//         const firstQuestion = interviewQuestions[0];
//         setMessages([
//             { role: "bot", content: welcomeMessage },
//             { role: "bot", content: firstQuestion }
//         ]);
//     };

//     return (
//         <div>
//             {user && (
//                 <>
//                     <h1>Welcome, {user.name}</h1>
//                     <p>{user.email}</p>
//                     <button onClick={handleSignout}>Sign Out</button>
//                 </>
//             )}
//             {!interviewStarted ? (
//                 <button onClick={startInterview}>Start Interview</button>
//             ) : (
//                 <div>
//                     <div>
//                         {messages.map((msg, index) => (
//                             <div key={index}>
//                                 <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
//                             </div>
//                         ))}
//                     </div>
//                     <input
//                         type="text"
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         placeholder="Type your message here..."
//                     />
//                     <button onClick={sendMessage}>Send</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Profile;




// const interviewQuestions = [
//     "Can you tell me about a time you worked on a team to complete a project? What was your role, and what did you learn from the experience?",
//     "How do you handle tight deadlines? Can you provide an example?",
//     "What is your greatest strength and how does it help you in your work?",
//     // Add more questions as needed
// ];

// const Profile = () => {
//     const { currentUser } = useAuth();
//     const [user, setUser] = useState(null);
//     const [input, setInput] = useState("");
//     const [messages, setMessages] = useState([]);
//     const [interviewStarted, setInterviewStarted] = useState(false);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (currentUser) {
//             setUser({
//                 email: currentUser.email,
//                 name: currentUser.displayName || "User",
//             });
//         }
//     }, [currentUser]);

//     const handleSignout = async () => {
//         try {
//             await signOut();
//             navigate('/');
//         } catch (error) {
//             console.error('Error signing out', error);
//         }
//     };

//     const sendMessage = async () => {
//         if (input.trim()) {
//             const userMessage = { role: "user", content: input };
//             setMessages([...messages, userMessage]);

//             const currentQuestion = interviewQuestions[currentQuestionIndex];
//             const context = `Question: ${currentQuestion}`;

//             try {
//                 const response = await fetch('http://localhost:5000/api/chat', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ message: input, context }),
//                 });
//                 const data = await response.json();
//                 const botMessage = { role: "bot", content: data.response };
//                 setMessages([...messages, userMessage, botMessage]);
//                 setInput("");

//                 // Move to the next question if available
//                 if (currentQuestionIndex < interviewQuestions.length - 1) {
//                     setCurrentQuestionIndex(currentQuestionIndex + 1);
//                     const nextQuestion = interviewQuestions[currentQuestionIndex + 1];
//                     setMessages(prevMessages => [
//                         ...prevMessages,
//                         { role: "bot", content: nextQuestion }
//                     ]);
//                 }
//             } catch (error) {
//                 console.error('Error sending message:', error);
//             }
//         }
//     };

//     const startInterview = () => {
//         setInterviewStarted(true);
//         const welcomeMessage = "Hello, excited to interview you!";
//         const firstQuestion = interviewQuestions[0];
//         setMessages([
//             { role: "bot", content: welcomeMessage },
//             { role: "bot", content: firstQuestion }
//         ]);
//     };

//     return (
//         <div>
//             {user && (
//                 <>
//                     <h1>Welcome, {user.name}</h1>
//                     <p>{user.email}</p>
//                     <button onClick={handleSignout}>Sign Out</button>
//                 </>
//             )}
//             {!interviewStarted ? (
//                 <button onClick={startInterview}>Start Interview</button>
//             ) : (
//                 <div>
//                     <div>
//                         {messages.map((msg, index) => (
//                             <div key={index}>
//                                 <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
//                             </div>
//                         ))}
//                     </div>
//                     <input
//                         type="text"
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         placeholder="Type your message here..."
//                     />
//                     <button onClick={sendMessage}>Send</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Profile;





// const interviewQuestions = [
//     "Can you tell me about a time you worked on a team to complete a project? What was your role, and what did you learn from the experience?",
//     "How do you handle tight deadlines? Can you provide an example?",
//     "What is your greatest strength and how does it help you in your work?",
//     // Add more questions as needed
// ];

// const Profile = () => {
//     const { currentUser } = useAuth();
//     const [user, setUser] = useState(null);
//     const [input, setInput] = useState("");
//     const [messages, setMessages] = useState([]);
//     const [interviewStarted, setInterviewStarted] = useState(false);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [expectingFollowUp, setExpectingFollowUp] = useState(false); // Track follow-up state
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (currentUser) {
//             setUser({
//                 email: currentUser.email,
//                 name: currentUser.displayName || "User",
//             });
//         }
//     }, [currentUser]);

//     const handleSignout = async () => {
//         try {
//             await signOut();
//             navigate('/');
//         } catch (error) {
//             console.error('Error signing out', error);
//         }
//     };

//     const sendMessage = async () => {
//         if (input.trim()) {
//             const userMessage = { role: "user", content: input };
//             setMessages([...messages, userMessage]);

//             const currentQuestion = interviewQuestions[currentQuestionIndex];
//             const context = `Question: ${currentQuestion}`;

//             try {
//                 const response = await fetch('http://localhost:5000/api/chat', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ message: input, context }), // Ensure context is included here
//                 });
//                 const data = await response.json();
//                 const botMessage = { role: "bot", content: data.response };
//                 setMessages([...messages, userMessage, botMessage]);
//                 setInput("");

//                 if (data.followUp) {
//                     // Process follow-up question
//                     setMessages(prevMessages => [
//                         ...prevMessages,
//                         { role: "bot", content: data.followUp }
//                     ]);
//                     setExpectingFollowUp(true);
//                 } else {
//                     // Move to the next question if available
//                     if (currentQuestionIndex < interviewQuestions.length - 1) {
//                         setCurrentQuestionIndex(currentQuestionIndex + 1);
//                         const nextQuestion = interviewQuestions[currentQuestionIndex + 1];
//                         setMessages(prevMessages => [
//                             ...prevMessages,
//                             { role: "bot", content: nextQuestion }
//                         ]);
//                         setExpectingFollowUp(false);
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error sending message:', error);
//             }
//         }
//     };

//     const startInterview = () => {
//         setInterviewStarted(true);
//         const welcomeMessage = "Hello, excited to interview you!";
//         const firstQuestion = interviewQuestions[0];
//         setMessages([
//             { role: "bot", content: welcomeMessage },
//             { role: "bot", content: firstQuestion }
//         ]);
//         setExpectingFollowUp(false);
//     };

//     return (
//         <div>
//             {user && (
//                 <>
//                     <h1>Welcome, {user.name}</h1>
//                     <p>{user.email}</p>
//                     <button onClick={handleSignout}>Sign Out</button>
//                 </>
//             )}
//             {!interviewStarted ? (
//                 <button onClick={startInterview}>Start Interview</button>
//             ) : (
//                 <div>
//                     <div>
//                         {messages.map((msg, index) => (
//                             <div key={index}>
//                                 <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
//                             </div>
//                         ))}
//                     </div>
//                     <input
//                         type="text"
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         placeholder="Type your message here..."
//                     />
//                     <button onClick={sendMessage}>Send</button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Profile;








const interviewQuestions = [
    "Can you tell me about a time you worked on a team to complete a project? What was your role, and what did you learn from the experience?",
    "How do you handle tight deadlines? Can you provide an example?",
    "What is your greatest strength and how does it help you in your work?",
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
    const [lastQuestion, setLastQuestion] = useState(false)
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

            const currentQuestion = interviewQuestions[currentQuestionIndex];
            const context = `Question: ${currentQuestion}`;

            try {
                const response = await fetch('http://localhost:5000/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: input, context, lastQuestion }), // Ensure context is included here
                });
                const data = await response.json();
                const botMessage = { role: "bot", content: data.response };
                setMessages([...messages, userMessage, botMessage]);
                setInput("");
                
                if (data.followUp ) {
                    // Process follow-up question
                    if(!data.response.includes(data.followUp)){
                        setMessages(prevMessages => [
                            ...prevMessages,
                            { role: "bot", content: data.followUp }
                        ]);
                    }
                    // setMessages(prevMessages => [
                    //     ...prevMessages,
                    //     { role: "bot", content: data.followUp }
                    // ]);
                    setExpectingFollowUp(true);
                } else {
                    // Move to the next question if available
                    if (currentQuestionIndex < interviewQuestions.length - 1) {
                        setCurrentQuestionIndex(currentQuestionIndex + 1);
                        // if(currentQuestionIndex==interviewQuestions.length){
                        //     setLastQuestion(true)
                        // }
                        const nextQuestion = interviewQuestions[currentQuestionIndex + 1];
                        setMessages(prevMessages => [
                            ...prevMessages,
                            { role: "bot", content: nextQuestion }
                        ]);
                        setExpectingFollowUp(false);
                    }
                    else{
                        setLastQuestion(true);
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
        setExpectingFollowUp(false);
        setLastQuestion(false);
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
            )}
        </div>
    );
};

export default Profile;
