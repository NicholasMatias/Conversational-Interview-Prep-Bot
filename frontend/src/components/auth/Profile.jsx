import './Profile.css'
import React from 'react'
import { signOut } from './auth.js'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from './auth.jsx'
import { useNavigate } from 'react-router-dom'
import Record from '../Record.jsx'
import TTS from '../TTS.jsx'
import interview_questions from '../../../interview_questions.json';
import { db } from '../../../../backend/firebase/firebase.config.js';
import { doc, updateDoc, arrayUnion, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import SaveModal from '../SaveTranscript/SaveModal.jsx';
import Spacing from '../landing_page/spacing/Spacing.jsx'
import InterviewFeedback from '../InterviewFeedback/InterviewFeedback.jsx'
import { Tooltip } from 'react-tooltip'


const interviewQuestions = interview_questions.basisBehavioralQuestions;


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
    const [isSpeaking, setIsSpeaking] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [folderNames, setFolderNames] = useState([]);

    const [alreadySaved, setAlreadySaved] = useState(false);
    const [newInterview, setNewInterview] = useState(false);

    const [error, setError] = useState("");

    const [isFeedbackTime, setIsFeedbackTime] = useState(false);




    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            setUser({
                email: currentUser.email,
                name: currentUser.displayName || "User",
            });
        }

        const userRef = doc(db, "users", currentUser.uid)
        getDoc(userRef).then((docSnap) => {
            if (docSnap.exists()) {
                setFolderNames(docSnap.data().folderNames || []);
            }
        })
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


    // Manages the messages array, sends the user response and question asked to backend in body => then sent to groq llama3 to get a response to the user. 
    const sendMessage = async (transcribedText) => {
        const messageText = transcribedText || input;
        if (messageText.trim()) {
            setIsLoading(true);
            const userMessage = { role: "user", content: messageText };
            setMessages([...messages, userMessage]);

            // sets the current question. 
            const currentQuestion = interviewQuestions[currentQuestionIndex];
            const context = `Question: ${currentQuestion}`;

            // sets the last question, so that the correct content is used in api call to groq on the backend body params. 
            if (interviewQuestions.length > 2) {
                setLastQuestionCheck(interviewQuestions[currentQuestionIndex + 2])
            }

            const isLastQuestion = currentQuestionIndex === interviewQuestions.length - 2;

            try {
                const response = await fetch("http://localhost:5000/api/chat", {
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

                if (isLastQuestion) {
                    setIsInterviewOver(true);
                    setIsUserTurn(false);
                }
                // if there is a followup question, don't do to next question in interviewQuestions json file, allow user to respond to follow-up question. 
                else if (data.followUp) {
                    setPrevIsFollowUp(true)
                    setIsUserTurn(true);
                    setExpectingFollowUp(true);
                } else {
                    setPrevIsFollowUp(false)
                    if (!isLastQuestion) {
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
                        setNewInterview(false);
                        setIsUserTurn(false);
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
        setNewInterview(false);
        const welcomeMessage = "Hello, I am excited to interview you!";
        const firstQuestion = interviewQuestions[0];
        setMessages([
            { role: "bot", content: welcomeMessage },
            { role: "bot", content: firstQuestion }
        ]); TTS
        if (interviewQuestions[1] == "quit") {
            setLastQuestionCheck("quit")
        }
        setExpectingFollowUp(false);
        setIsUserTurn(true);
        setIsInterviewOver(false);
        setIsSpeaking(false);
    };

    const handleSpokenMessage = (spokenContent) => {
        setSpokenMessages(prev => [...prev, spokenContent]);
        setIsSpeaking(false);
    };


    const handleTTSStart = () => {
        setIsSpeaking(true);
    }



    const handleSave = async (transcriptName, selectedFolder) => {
        if (!currentUser) return;

        try {
            if (!collection(db, "users", currentUser.uid, selectedFolder)) {
                setError("Folder could not be found.")
            }
            else {
                setError("");

            }
            const userRef = doc(db, "users", currentUser.uid);
            const folderRef = doc(userRef, `${selectedFolder}`, transcriptName);


            if (!transcriptName || !Array.isArray(messages)) {
                console.error("Invalid data: transcriptName or messages are not properly initialized");
                return;
            }


            await setDoc(folderRef, {
                createdAt: new Date(),
                name: transcriptName || null,
                transcript: messages || null,
            });




            const userDoc = await getDoc(userRef);
            if (!userDoc.exists()) {
                console.error("User document does not exist");
                return;
            }
            const userData = userDoc.data();
            let transcriptsData = userData.transcripts || {};

            let folderTranscripts = transcriptsData[selectedFolder] || []
            folderTranscripts.push(transcriptName);

            transcriptsData[selectedFolder] = folderTranscripts;

            const updateData = {
                transcripts: transcriptsData
            }

            await updateDoc(userRef, updateData);

            setIsModalOpen(false);
            setAlreadySaved(true);


        } catch (error) {
            console.error("Error saving transcript:", error);
        }
    }

    const handleNewInterview = () => {
        setNewInterview(true);
        setInterviewStarted(false);
        setMessages([]);
        setInput("");
        setCurrentQuestionIndex(0);
        setExpectingFollowUp(false);
        setLastQuestionCheck("");
        setPrevIsFollowUp(false);
        setIsUserTurn(false);
        setIsLoading(false);
        setIsTranscribing(false);
        setSpokenMessages([]);
        setIsSpeaking(false);
        setAlreadySaved(false);
        setIsModalOpen(false);
        setIsInterviewOver(false);

    }



    const getSituation = async (userResponse) => {
        try {
            const response = await fetch("http://localhost:5000/situation", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ response: userResponse }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const situationScore = await response.json()


            return situationScore
        }
        catch (error) {
            console.error("Error in getSituation:", error)
            return 0
        }
    }

    const getTask = async (userResponse) => {
        try {
            const response = await fetch("http://localhost:5000/task", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ response: userResponse }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const taskScore = await response.json()


            return taskScore
        }
        catch (error) {
            console.error("Error in getTask:", error)
            return 0
        }
    }

    const getAction = async (userResponse) => {
        try {
            const response = await fetch("http://localhost:5000/action", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ response: userResponse }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const actionScore = await response.json()


            return actionScore
        }
        catch (error) {
            console.error("Error in getAction:", error)
            return 0
        }
    }


    const getResult = async (userResponse) => {
        try {
            const response = await fetch("http://localhost:5000/result", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ response: userResponse }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const resultScore = await response.json()


            return resultScore
        }
        catch (error) {
            console.error("Error in getResult:", error)
            return 0
        }
    }


    const getRelevance = async (question, userResponse) => {
        try {
            const response = await fetch('http://localhost:5000/relevance', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                },
                body: JSON.stringify({ response: userResponse, question: question })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const relevanceScore = await response.json()
            return relevanceScore
        }
        catch (error) {
            console.error("Error in getRelevance:", error)
            return 0
        }
    }

    const [feedbackData, setFeedbackData] = useState([])

    const showFeedback = async () => {
        const feedback = []
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            if (message.role === "user") {
                try {
                    const messageContent = message.content
                    // const [situation, task, action, result, relevance]  = await Promise.all([getSituation(messageContent), getTask(messageContent), getAction(messageContent), getResult(messageContent), getRelevance(message[i-1].content, messageContent)])
                    const feedbackItem = {
                        role: "user",
                        content: message.content,
                        situation: await getSituation(message.content),
                        task: await getTask(message.content),
                        action: await getAction(message.content),
                        result: await getResult(message.content),
                        relevance: await getRelevance(messages[i - 1].content, message.content)
                    }
                    feedback.push(feedbackItem)
                }
                catch (error) {
                    console.error("Error fetching feedback for message", error)
                    feedback.push({
                        role: "user",
                        content: message.content,
                        error: "Failed to fetch feedback"
                    })
                }
            }

            else {
                feedback.push({
                    role: "bot",
                    content: message.content
                })
            }
        }
        setFeedbackData(feedback)
        setIsFeedbackTime(true)
    }



    return (
        <div>
            <a className='my-anchor-element'></a>
            {user && (
                <>
                    <nav className='navBar-container'>
                        <div className="navbar">
                            <div className="brand">
                                InterviewMe
                            </div>
                            <ul className="nav-links">
                                <li><a type='button' onClick={toFolders}>Folders</a></li>

                                <li><a type='button' onClick={handleSignout} >Logout</a></li>

                            </ul>
                        </div>
                    </nav>
                    <Spacing />
                    <h1 className='welcome-message'>Welcome to the interview interface page!</h1>
                    <div>
                        <p className=' welcome-message'>Upon finishing your interview, you are able to save it in a folder of your choosing, view interview specific feedback, or of course start a new interview. </p>
                        <p className='welcome-message'>Your response to a question will be evaluated on the <a className='star-tooltip starTip'>STAR</a> method (<a className='situation-tooltip starTip'>Situation</a>, <a className='task-tooltip starTip'>Task</a>, <a className='action-tooltip starTip'>Action</a>, and <a className='result-tooltip starTip'>Result</a>) and its <a className='relevance-tooltip starTip'>Relevance</a> to the question asked. </p>
                        <Tooltip className='relevance-tooltip' anchorSelect='.relevance-tooltip' place='bottom'>
                            <p className='star-tooltip tooltipText'>Is your response relevant to the question asked?</p>
                        </Tooltip>
                        <Tooltip className='star-tooltip' anchorSelect='.star-tooltip' place='bottom'>
                            <p className='star-tooltip tooltipText'>The STAR method is a structured manner of responding to a behavioral-based interview question by
                                discussing the specific situation, task, action, and result of the situation you are describing.  </p>
                        </Tooltip>
                        <Tooltip className='situation-tooltip' anchorSelect='.situation-tooltip' place='bottom'>
                            <p className='situation-tooltip tooltipText'>Situation: Describe the situation that you were in or the task that you needed to accomplish. You
                                must describe a specific event or situation, not a generalized description of what you have done in
                                the past. Be sure to give enough detail for the interviewer to understand. This situation can be
                                from a previous job, from a volunteer experience, or any relevant event. </p>
                        </Tooltip>
                        <Tooltip className='task-tooltip' anchorSelect='.task-tooltip' place='bottom'>
                            <p className='task-tooltip tooltipText'>Task: What goal were you working toward? What were you trying to accomplish?</p>
                        </Tooltip>
                        <Tooltip className='action-tooltip' anchorSelect='.action-tooltip' place='bottom'>
                            <p className='action-tooltip tooltipText'>Action: Describe the actions you took to address the situation with an appropriate amount of
                                detail and keep the focus on YOU. What specific steps did you take and what was your particular
                                contribution? Be careful that you don’t describe what the team or group did when talking about a
                                project, but what you actually did. Use the word “I,” not “we” when describing actions. </p>
                        </Tooltip>
                        <Tooltip className='result-tooltip' anchorSelect='.result-tooltip' place='bottom'>
                            <p className='result-tooltip tooltipText'>Result: Describe the outcome of your actions and don’t be shy about taking credit for your
                                behavior. What happened? How did the event end? What did you accomplish? What did you
                                learn? Make sure your answer contains multiple positive results. </p>
                        </Tooltip>
                    </div>
                    <Spacing />
                </>
            )}
            {!interviewStarted ? (
                <div className='start-interview-container'>
                    <button className='start-interview-btn' onClick={startInterview}>Start Interview</button>
                </div>
            ) : (
                <div className='messages-container'>
                    <div className='messages'>
                        {messages.map((msg, index) => (
                            <div key={index} className='current-message'>
                                <strong>{msg.role === "user" ? "You" : "Interviewer"}:</strong>
                                <pre className='message-format'>{msg.content == "quit" ? "That concludes your interview. Thank you for using our platform." : ` ${msg.content}`}</pre>
                            </div>
                        ))}
                    </div>
                    {isLoading && <div className='loading-container'><h3 className='loading-message'>Processing your response</h3> <div className="loader"></div></div>}
                    {isTranscribing && <div className='loading-container'><h3 className='loading-message'>Transcribing your response</h3> <div className="loader"></div></div>}
                    {isUserTurn && !isLoading && !isTranscribing && !isInterviewOver && !isSpeaking &&
                        <Record
                            onTranscriptionComplete={handleTranscription}
                            onTranscriptionStart={() => setIsTranscribing(true)}
                        />
                    }
                    {newMessages.length > 0 && (
                        <TTS
                            messages={newMessages}
                            onMessageSpoken={handleSpokenMessage}
                            onSpeakingStart={handleTTSStart}
                        />
                    )}

                    {isInterviewOver && !isSpeaking && !newInterview && (
                        <div>
                            <button className='interview-end-btn' onClick={showFeedback}>View Feedback</button>

                            {!alreadySaved &&
                                <button className='interview-end-btn' onClick={() => setIsModalOpen(true)}>Save Transcript</button>
                            }

                            <button className='interview-end-btn' onClick={handleNewInterview}>New Interview</button>
                        </div>
                    )}


                    <SaveModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSave}
                    />
                    {error && <p>{error}</p>}


                    <InterviewFeedback
                        messagesPass={feedbackData}
                        isOpen={isFeedbackTime}
                        onClose={() => setIsFeedbackTime(false)}

                    />

                </div>

            )}
        </div>
    );
};

export default Profile;


