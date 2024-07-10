import './Profile.css'
import React from 'react'
import { signOut } from './auth.js'
import { useState, useEffect } from 'react'
import { useAuth } from './auth.jsx'
import { useNavigate } from 'react-router-dom'
import Record from '../Record.jsx'
import TTS from '../TTS.jsx'

const interviewQuestions = [
    "Can you tell me about a time you worked on a team to complete a project? What was your role, and what did you learn from the experience?",
    "What is your greatest strength and how does it help you in your work?",
    "quit"
    // Add more questions as needed
];

const Profile = () => {
    const { currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [expectingFollowUp, setExpectingFollowUp] = useState(false);
    const [lastQuestionCheck, setLastQuestionCheck] = useState("")
    const [prevIsFollowUp, setPrevIsFollowUp] = useState(false)

    const [isUserTurn, setIsUserTurn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [isInterviewOver, setIsInterviewOver] = useState(false);
    const [spokenMessages, setSpokenMessages] = useState([]);
    const [newMessages, setNewMessages] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            setUser({
                email: currentUser.email,
                name: currentUser.displayName || "User",
            });
        }
    }, [currentUser]);

    useEffect(() => {
        const unspokenMessages = messages.filter(msg =>
            msg.role === "bot" && !spokenMessages.includes(msg.content)
        );
        setNewMessages(unspokenMessages);
    }, [messages, spokenMessages]);

    const handleSignout = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out', error);
        }
    };

    const toFolders = () => {
        navigate('/folders')
    }

    const handleTranscription = (transcribedText) => {
        setIsTranscribing(false);
        setInput(transcribedText);
        sendMessage(transcribedText);
        setIsUserTurn(false);
    }

    const sendMessage = async (transcribedText) => {
        const messageText = transcribedText || input;
        if (messageText.trim()) {
            setIsLoading(true);
            const userMessage = { role: "user", content: messageText };
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
                setIsLoading(false);

                if (data.followUp) {
                    setPrevIsFollowUp(true)
                    if (!data.response.includes(data.followUp)) {
                        setMessages(prevMessages => [
                            ...prevMessages,
                            { role: "bot", content: data.followUp }
                        ]);
                    }
                    setIsUserTurn(true);
                    setExpectingFollowUp(true);
                } else {
                    setPrevIsFollowUp(false)
                    if (currentQuestionIndex < interviewQuestions.length - 1) {
                        setCurrentQuestionIndex(currentQuestionIndex + 1);

                        const nextQuestion = interviewQuestions[currentQuestionIndex + 1];
                        setMessages(prevMessages => [
                            ...prevMessages,
                            { role: "bot", content: nextQuestion }
                        ]);
                        setExpectingFollowUp(false);
                        setIsUserTurn(true);
                    }
                    else {
                        setIsInterviewOver(true);
                    }
                }
            } catch (error) {
                console.error('Error sending message:', error);
                setIsLoading(false);
            }
        }
    };

    const startInterview = () => {
        setInterviewStarted(true);
        const welcomeMessage = "Hello, I am excited to interview you!";
        const firstQuestion = interviewQuestions[0];
        setMessages([
            { role: "bot", content: welcomeMessage },
            { role: "bot", content: firstQuestion }
        ]);TTS
        if (interviewQuestions[1] == "quit") {
            setLastQuestionCheck("quit")
        }
        setExpectingFollowUp(false);
        setIsUserTurn(true);
        setIsInterviewOver(false);
    };

    const handleSpokenMessage = (spokenContent) => {
        setSpokenMessages(prev => [...prev, spokenContent]);
    };

    return (
        <div>
            {user && (
                <>
                    <h1>Welcome, {user.name}</h1>
                    <p>{user.email}</p>
                    <button onClick={handleSignout}>Sign Out</button>
                    <button onClick={toFolders}>Folders</button>
                </>
            )}
            {!interviewStarted ? (
                <button onClick={startInterview}>Start Interview</button>
            ) : (
                <div>
                    <div>
                        {messages.map((msg, index) => (
                            <div key={index}>
                                <strong>{msg.role === "user" ? "You" : "Interviewer"}:</strong>
                                {msg.content == "quit" ? "That concludes your interview. Thank you for using our platform." : msg.content}
                            </div>
                        ))}
                    </div>
                    {isLoading && <div>Processing your response...</div>}
                    {isTranscribing && <div>Transcribing your response...</div>}
                    {isUserTurn && !isLoading && !isTranscribing && !isInterviewOver &&
                        <Record
                            onTranscriptionComplete={handleTranscription}
                            onTranscriptionStart={() => setIsTranscribing(true)}
                        />
                    }
                    {newMessages.length > 0 && (
                        <TTS
                            messages={newMessages}
                            onMessageSpoken={handleSpokenMessage}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile;


