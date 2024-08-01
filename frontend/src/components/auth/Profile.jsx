import "./Profile.css";
import React from "react";
import { signOut } from "./auth.js";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "./auth.jsx";
import { useNavigate } from "react-router-dom";
import Record from "../Record.jsx";
import TTS from "../TTS.jsx";
import interview_questions from "../../../interview_questions.json";
import {
    db,
    doc,
    updateDoc,
    arrayUnion,
    getDoc,
    setDoc,
    collection,
    addDoc,
    getDocs,
    limit,
    query,
} from "../../firebase/firebase.config.js";

import SaveModal from "../SaveTranscript/SaveModal.jsx";
import Spacing from "../landing_page/spacing/Spacing.jsx";
import InterviewFeedback from "../InterviewFeedback/InterviewFeedback.jsx";
import { Tooltip } from "react-tooltip";

let indexes = [];
let messageQueue = [];
let isProcessing = false;

// creates queue to stream messages one at a time in sequential order.
function useMessageQueue(msg, index) {
    const [hasStreamed, setHasStreamed] = useState(false);
    const messageRef = useRef(null);

    useEffect(() => {
        if (msg.role !== "user" && !hasStreamed && !indexes.includes(index)) {
            messageQueue.push({ msg, index, ref: messageRef, setHasStreamed });
            indexes.push(index);
            processQueue();
        }
    }, [msg, hasStreamed, index]);

    return { hasStreamed, messageRef };
}

// streams the messages by popping messages from the queue
function processQueue() {
    if (isProcessing || messageQueue.length === 0) return;

    isProcessing = true;
    const { msg, ref, setHasStreamed } = messageQueue.shift();

    streamText(msg.content, ref.current).then(() => {
        setHasStreamed(true);
        isProcessing = false;
        processQueue();
    });
}
// function to stream the text
function streamText(text, element, delay = 50.8) {
    return new Promise((resolve) => {
        let i = 0;
        element.innerHTML = ""; // Clear the element at the start

        function addNextChar() {
            if (i < text.length) {
                element.textContent += text[i]; // Use textContent instead of innerHTML
                i++;
                setTimeout(addNextChar, delay);
            } else {
                resolve();
            }
        }

        addNextChar();
    });
}
// messaeg component => displays message to screen
function MessageComponent({ msg, index }) {
    const { hasStreamed, messageRef } = useMessageQueue(msg, index);

    if (msg.role === "user") {
        return (
            <div className="current-message">
                <strong>You:</strong>
                <pre className="message-format">
                    {msg.content === "quit"
                        ? "That concludes your interview. Thank you for using our platform."
                        : ` ${msg.content}`}
                </pre>
            </div>
        );
    }

    return (
        <div className="current-message">
            <strong>Interviewer:</strong>
            <pre className="message-format" ref={messageRef}>
                {hasStreamed ? msg.content : ""}
            </pre>
        </div>
    );
}

const Profile = () => {
    const { currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [interviewStarted, setInterviewStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [expectingFollowUp, setExpectingFollowUp] = useState(false);
    const [lastQuestionCheck, setLastQuestionCheck] = useState("");
    const [prevIsFollowUp, setPrevIsFollowUp] = useState(false);

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
    const [feedbackMessage, setFeedbackMessage] = useState(
        "Loading Interview Feedback"
    );
    const [interviewQuestions, setInterviewQuestions] = useState([]);
    const [showLineupModal, setShowLineupModal] = useState(false);

    const showRandomQuestionsButton =
        interviewQuestions.length === 0 ||
        (interviewQuestions.length > 0 &&
            interviewQuestions[0].toLowerCase() === "quit");

    const navigate = useNavigate();

    // sets the current user information => to be used later on => activates on currentUser change
    useEffect(() => {
        if (currentUser) {
            setUser({
                email: currentUser.email,
                name: currentUser.displayName || "User",
            });
        }

        const userRef = doc(db, "users", currentUser.uid);
        getDoc(userRef).then((docSnap) => {
            if (docSnap.exists()) {
                setFolderNames(docSnap.data().folderNames || []);
            }
        });
    }, [currentUser]);
    // gets the lineup questions from the database for that specific user
    const fetchLineupQuestions = async () => {
        if (currentUser) {
            const lineupRef = doc(
                db,
                "InterviewQuestionsLineup",
                currentUser.uid
            );
            const lineupSnap = await getDoc(lineupRef);
            if (lineupSnap.exists()) {
                const questionObjects = lineupSnap.data().questions || [];
                const questionTexts = questionObjects.map((q) => q.question);
                setInterviewQuestions(questionTexts);
        
            }
        }
    };
    fetchLineupQuestions();
    // keeps track of messages that have already been said/ not said => used to make sure each message is only streamed once/ said once
    useEffect(() => {
        const unspokenMessages = messages.filter(
            (msg) => msg.role === "bot" && !spokenMessages.includes(msg.content)
        );
        setNewMessages(unspokenMessages);
    }, [messages, spokenMessages]);

    //signs the user out
    const handleSignout = async () => {
        try {
            await signOut();
            navigate("/");
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    // nav to folders page
    const toFolders = () => {
        navigate("/folders");
    };

    // nav to home page
    const toHome = () => {
        navigate("/home");
    };

    // done transcribing => now handle message => displays on the screen => tts and stream activates if interviewer response
    const handleTranscription = (transcribedText) => {
        setIsTranscribing(false);
        setInput(transcribedText);
        sendMessage(transcribedText);
        setIsUserTurn(false);
    };

    const sendMessage = async (transcribedText) => {
        const messageText = transcribedText || input;
        if (messageText.trim()) {
            setIsLoading(true);
            const userMessage = { role: "user", content: messageText };
            setMessages((prevMessages) => [...prevMessages, userMessage]);

            // Get the current question
            const currentQuestion = interviewQuestions[currentQuestionIndex];
            const context = `Question: ${currentQuestion}`;

            // Check if it's the last question (including the case of only one question)
            const isLastQuestion =
                currentQuestionIndex === interviewQuestions.length - 1 ||
                interviewQuestions.length === 1;

            

            try {
                const response = await fetch("http://localhost:5000/api/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: transcribedText,
                        context,
                        lastQuestionCheck: isLastQuestion ? "quit" : "",
                        prevIsFollowUp,
                    }),
                });
                const data = await response.json();
                const botMessage = { role: "bot", content: data.response };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
                setInput("");
                setIsLoading(false);

                if (isLastQuestion && !data.followUp) {
                    setIsInterviewOver(true);
                    setIsUserTurn(false);
                } else if (data.followUp) {
                    setPrevIsFollowUp(true);
                    setIsUserTurn(true);
                    setExpectingFollowUp(true);
                } else {
                    setPrevIsFollowUp(false);
                    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                    if (currentQuestionIndex + 1 < interviewQuestions.length) {
                        const nextQuestion =
                            interviewQuestions[currentQuestionIndex + 1];
                        setMessages((prevMessages) => [
                            ...prevMessages,
                            { role: "bot", content: nextQuestion },
                        ]);
                    }
                    setExpectingFollowUp(false);
                    setIsUserTurn(true);
                }
            } catch (error) {
                console.error("Error sending message:", error);
                setIsLoading(false);
            }
        }
    };

    // toggles the lineup modal
    const toggleLineupModal = () => {
        setShowLineupModal(!showLineupModal);
    };

    // nav to questions page
    const goToQuestionsPage = () => {
        navigate("/questions");
    };

    // clears the questions lineup in database and frontend display using useState var
    const clearLineup = async () => {
        if (currentUser) {
            const lineupRef = doc(
                db,
                "InterviewQuestionsLineup",
                currentUser.uid
            );
            await updateDoc(lineupRef, { questions: [] });
            setInterviewQuestions([]);
        }
    };
    useEffect(() => {
        if (interviewQuestions[0] === "quit") {
            handleDeleteQuestion(0);
        }
    }, [interviewQuestions]);

    // deletes question from question lineup
    const handleDeleteQuestion = async (index) => {
        const updatedQuestions = interviewQuestions.filter(
            (_, i) => i !== index
        );
        setInterviewQuestions(updatedQuestions);

        if (currentUser) {
            const lineupRef = doc(
                db,
                "InterviewQuestionsLineup",
                currentUser.uid
            );
            await updateDoc(lineupRef, {
                questions: updatedQuestions.map((q) => ({ question: q })),
            });
        }
    };

    // gets 5 questions at random and adds them to the lineup
    const getRandomQuestions = async () => {
        const questionsRef = collection(db, "questions");
        const q = query(questionsRef, limit(5));
        const querySnapshot = await getDocs(q);
        const randomQuestions = querySnapshot.docs.map(
            (doc) => doc.data().question
        );
        setInterviewQuestions(randomQuestions);

        if (currentUser) {
            const lineupRef = doc(
                db,
                "InterviewQuestionsLineup",
                currentUser.uid
            );

            await updateDoc(lineupRef, {
                questions: randomQuestions.map((q) => ({ question: q })),
            });
        }
    };

    const [isInterviewQuestionsEmpty, setIsInterviewQuestionsEmpty] =
        useState(false);

    // initializes interview environment.
    const startInterview = () => {
        if (
            interviewQuestions.length === 0 ||
            (interviewQuestions.length === 1 &&
                interviewQuestions[0] === "quit")
        ) {
            setIsInterviewQuestionsEmpty(true);
            setTimeout(() => {
                setIsInterviewQuestionsEmpty(false);
            }, 1000);
            return;
        }

        indexes = [];
        messageQueue = [];
        isProcessing = false;
        setInterviewStarted(true);
        setNewInterview(false);
        const welcomeMessage = "Hello, I am excited to interview you!";
        const firstQuestion = interviewQuestions[0];
        setMessages([
            { role: "bot", content: welcomeMessage },
            { role: "bot", content: firstQuestion },
        ]);
        TTS;
        if (interviewQuestions[1] == "quit") {
            setLastQuestionCheck("quit");
        }
        // setLastQuestionCheck(interviewQuestions.length === 1 ? "quit" : "");
        setCurrentQuestionIndex(0);
        setExpectingFollowUp(false);
        setIsUserTurn(true);
        setIsInterviewOver(false);
        setIsSpeaking(false);
    };

    // once message said => set is speaking to false => means mic can now appear so the user can respond
    // adds to said messages => each interviewer message only said once
    const handleSpokenMessage = (spokenContent) => {
        setSpokenMessages((prev) => [...prev, spokenContent]);
        setIsSpeaking(false);
    };

    // sets is speaking to true => mic no longer appears
    const handleTTSStart = () => {
        setIsSpeaking(true);
    };

    // allows the user to save interview transcript in a folder of their choosing
    const handleSave = async (transcriptName, selectedFolder) => {
        if (!currentUser) return;

        try {
            if (!collection(db, "users", currentUser.uid, selectedFolder)) {
                setError("Folder could not be found.");
            } else {
                setError("");
            }
            const userRef = doc(db, "users", currentUser.uid);
            const folderRef = doc(userRef, `${selectedFolder}`, transcriptName);

            if (!transcriptName || !Array.isArray(messages)) {
                console.error(
                    "Invalid data: transcriptName or messages are not properly initialized"
                );
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

            let folderTranscripts = transcriptsData[selectedFolder] || [];
            folderTranscripts.push(transcriptName);

            transcriptsData[selectedFolder] = folderTranscripts;

            const updateData = {
                transcripts: transcriptsData,
            };

            await updateDoc(userRef, updateData);

            setIsModalOpen(false);
            setAlreadySaved(true);
        } catch (error) {
            console.error("Error saving transcript:", error);
        }
    };

    // sets up the environment for a new interview
    const handleNewInterview = () => {
        clearLineup();
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
        setFeedbackMessage("Loading Interview Feedback");
        indexes = [];
        messageQueue = [];
        isProcessing = false;
    };

    //gets situation color category and score
    const getSituation = async (userResponse) => {
        try {
            const response = await fetch("http://localhost:5000/situation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ response: userResponse }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const situationScore = await response.json();

            return situationScore;
        } catch (error) {
            console.error("Error in getSituation:", error);
            return 0;
        }
    };

    // gets task color category and score
    const getTask = async (userResponse) => {
        try {
            const response = await fetch("http://localhost:5000/task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ response: userResponse }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const taskScore = await response.json();

            return taskScore;
        } catch (error) {
            console.error("Error in getTask:", error);
            return 0;
        }
    };

    // gets action color category and score
    const getAction = async (userResponse) => {
        try {
            const response = await fetch("http://localhost:5000/action", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ response: userResponse }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const actionScore = await response.json();

            return actionScore;
        } catch (error) {
            console.error("Error in getAction:", error);
            return 0;
        }
    };

    // gets result color category and score
    const getResult = async (userResponse) => {
        try {
            const response = await fetch("http://localhost:5000/result", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ response: userResponse }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const resultScore = await response.json();

            return resultScore;
        } catch (error) {
            console.error("Error in getResult:", error);
            return 0;
        }
    };

    //gets relevance score
    const getRelevance = async (question, userResponse) => {
        try {
            const response = await fetch("http://localhost:5000/relevance", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    response: userResponse,
                    question: question,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const relevanceScore = await response.json();
            return relevanceScore;
        } catch (error) {
            console.error("Error in getRelevance:", error);
            return 0;
        }
    };

    //gets freq for word or phrase depending on teh gramSize
    const getFreq = async (responses, number, gramSize) => {
        try {
            const response = await fetch("http://localhost:5000/frequency", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    responses: responses,
                    number: number,
                    gramSize: gramSize,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const relevanceScore = await response.json();
            return relevanceScore;
        } catch (error) {
            console.error("Error in getFreq:", error);
            return 0;
        }
    };
    const [freqWords, setFreqWords] = useState([]);
    const [freqPhrases, setFreqPhrases] = useState([]);

    // makes calls to get most freq words and phrases
    const wordFreqPhrases = async () => {
        const userMessages = messages.filter(
            (message) => message.role === "user"
        );
        const userAnswers = userMessages.map((message) => message.content);
        const singleText = userAnswers.join(" ");
        const mostFreqWords = await getFreq(singleText, 10, 1);
        const mostFreqPhrases = await getFreq(singleText, 5, 2);

        setFreqPhrases(mostFreqPhrases);
        setFreqWords(mostFreqWords);
    };

    const [feedbackData, setFeedbackData] = useState([]);
    // will be used to classify average scores for STAR and relevance
    const scoreClassifier = (result) => {
        if (!result || result <= 0.2) {
            return "last";
        } else if (result <= 0.35) {
            return "fourth";
        } else if (result <= 0.45) {
            return "third";
        } else if (result <= 0.55) {
            return "second";
        } else {
            return "best";
        }
    };

    const [scoreAverages, setScoreAverages] = useState([]);

    // sums items in array
    const sumContents = (array) => {
        let sum = 0;
        array.forEach((element) => {
            sum += element;
        });
        return sum;
    };

    //gets average scores for STAR
    const averageScores = (feedback) => {
        const situationScores = [];
        const taskScores = [];
        const actionScores = [];
        const resultScores = [];

        for (let i = 0; i < feedback.length; i++) {
            const message = feedback[i];
            if (message.role === "user") {
                situationScores.push(message.situation[1]);
                taskScores.push(message.task[1]);
                actionScores.push(message.action[1]);
                resultScores.push(message.result[1]);
            }
        }
        const totalResponses = situationScores.length;

        const avgSituationScore = sumContents(situationScores) / totalResponses;
        const avgTaskScore = sumContents(taskScores) / totalResponses;
        const avgActionScore = sumContents(actionScores) / totalResponses;
        const avgResultScore = sumContents(resultScores) / totalResponses;

        const avgSituationClass = scoreClassifier(avgSituationScore);
        const avgTaskClass = scoreClassifier(avgTaskScore);
        const avgActionClass = scoreClassifier(avgActionScore);
        const avgResultClass = scoreClassifier(avgResultScore);

        const averages = [
            avgSituationClass,
            avgTaskClass,
            avgActionClass,
            avgResultClass,
        ];
        setScoreAverages(averages);
    };

    //sends question, response, and metrics to backend to get question specific feedback
    const getFeedbackResponse = async (userResponse, question, scores) => {
        try {
            const response = await fetch("http://localhost:5000/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userResponse: userResponse,
                    question: question,
                    scores: scores,
                }),
            });
            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error("Error getting feedback:", error);
            return "";
        }
    };

    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [responseFeedbackItems, setResponseFeedbackItems] = useState([]);

    //prepares messages to be sent to backend for llama3 feed back => question specific feedback
    const llamaFeedback = async (feedback) => {
        const responseFeedback = [];
        for (let i = 0; i < feedback.length; i++) {
            const message = feedback[i];
            if (message.role === "user") {
                try {
                    const feedbackItem = [
                        message.situation[1],
                        message.task[1],
                        message.action[1],
                        message.result[1],
                        message.relevance[1],
                    ];
                    const currFeedback = await getFeedbackResponse(
                        message.content,
                        feedback[i - 1].content,
                        feedbackItem
                    );
                    responseFeedback.push(currFeedback);
                } catch (error) {
                    console.error(
                        "Error getting feedback for user response:",
                        error
                    );
                }
            } else {
                responseFeedback.push("");
            }
        }
        return responseFeedback;
    };

    // sets up everything so that it can be displayed in feedback modal
    const showFeedback = async () => {
        const feedbackQueue = [];

        setFeedbackMessage("Loading Interview Feedback");
        setFeedbackLoading(true);
        const feedback = [];

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            if (message.role === "user") {
                try {
                    const feedbackItem = {
                        role: "user",
                        content: message.content,
                        situation: await getSituation(message.content),
                        task: await getTask(message.content),
                        action: await getAction(message.content),
                        result: await getResult(message.content),
                        relevance: await getRelevance(
                            messages[i - 1].content,
                            message.content
                        ),
                    };
                    if (
                        feedbackItem.situation[1] +
                            feedbackItem.task[1] +
                            feedbackItem.action[1] +
                            feedbackItem.result[1] <
                        1.2
                    ) {
                        feedbackItem.relevance = ["fourth", 0];
                    }

                    feedback.push(feedbackItem);
                } catch (error) {
                    console.error("Error fetching feedback for message", error);
                    feedback.push({
                        role: "user",
                        content: message.content,
                        error: "Failed to fetch feedback",
                    });
                }
            } else {
                feedback.push({
                    role: "bot",
                    content: message.content,
                });
            }
        }

        wordFreqPhrases();
        setFeedbackData(feedback);
        averageScores(feedback);

        const responseFeedback = await llamaFeedback(feedback);

        setResponseFeedbackItems(responseFeedback);

        feedbackQueue.push(
            "Analyzing user response for STAR method and question relevance"
        );
        feedbackQueue.push(
            "Determining most frequently used words and phrases"
        );
        feedbackQueue.push("Calculating average STAR scores");
        // Process the queue
        while (feedbackQueue.length > 0) {
            const message = feedbackQueue.shift();
            setFeedbackMessage(message);
            await new Promise((resolve) => setTimeout(resolve, 750));
        }

        setFeedbackLoading(false);
        setIsFeedbackTime(true);
    };

    // nav to questions
    const toQuestions = () => {
        navigate("/questions");
    };

    return (
        <div>
            <a className="my-anchor-element"></a>
            {user && (
                <>
                    <nav className="navBar-container">
                        <div className="navbar">
                            <div className="brand">InterviewMe</div>
                            <ul className="nav-links">
                                <li>
                                    <a type="button" onClick={toHome}>
                                        Home
                                    </a>
                                </li>

                                <li>
                                    <a type="button" onClick={toQuestions}>
                                        Questions
                                    </a>
                                </li>

                                <li>
                                    <a type="button" onClick={toFolders}>
                                        Folders
                                    </a>
                                </li>

                                <li>
                                    <a type="button" onClick={handleSignout}>
                                        Logout
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    <Spacing />
                    <h1 className="welcome-message">
                        Welcome to the interview interface page!
                    </h1>
                    <div>
                        <p className=" welcome-message">
                            Upon finishing your interview, you are able to save
                            it in a folder of your choosing, view interview
                            specific feedback, or of course start a new
                            interview.{" "}
                        </p>
                        <p className="welcome-message">
                            Your response to a question will be evaluated on the{" "}
                            <a className="star-tooltip starTip">STAR</a> method
                            (
                            <a className="situation-tooltip starTip">
                                Situation
                            </a>
                            , <a className="task-tooltip starTip">Task</a>,{" "}
                            <a className="action-tooltip starTip">Action</a>,
                            and <a className="result-tooltip starTip">Result</a>
                            ) and its{" "}
                            <a className="relevance-tooltip starTip">
                                Relevance
                            </a>{" "}
                            to the question asked.{" "}
                        </p>
                        <Tooltip
                            className="relevance-tooltip"
                            anchorSelect=".relevance-tooltip"
                            place="bottom"
                        >
                            <p className="star-tooltip tooltipText">
                                Is your response relevant to the question asked?
                            </p>
                        </Tooltip>
                        <Tooltip
                            className="star-tooltip"
                            anchorSelect=".star-tooltip"
                            place="bottom"
                        >
                            <p className="star-tooltip tooltipText">
                                The STAR method is a structured manner of
                                responding to a behavioral-based interview
                                question by discussing the specific situation,
                                task, action, and result of the situation you
                                are describing.{" "}
                            </p>
                        </Tooltip>
                        <Tooltip
                            className="situation-tooltip"
                            anchorSelect=".situation-tooltip"
                            place="bottom"
                        >
                            <p className="situation-tooltip tooltipText">
                                Situation: Describe the situation that you were
                                in or the task that you needed to accomplish.
                                You must describe a specific event or situation,
                                not a generalized description of what you have
                                done in the past. Be sure to give enough detail
                                for the interviewer to understand. This
                                situation can be from a previous job, from a
                                volunteer experience, or any relevant event.{" "}
                            </p>
                        </Tooltip>
                        <Tooltip
                            className="task-tooltip"
                            anchorSelect=".task-tooltip"
                            place="bottom"
                        >
                            <p className="task-tooltip tooltipText">
                                Task: What goal were you working toward? What
                                were you trying to accomplish?
                            </p>
                        </Tooltip>
                        <Tooltip
                            className="action-tooltip"
                            anchorSelect=".action-tooltip"
                            place="bottom"
                        >
                            <p className="action-tooltip tooltipText">
                                Action: Describe the actions you took to address
                                the situation with an appropriate amount of
                                detail and keep the focus on YOU. What specific
                                steps did you take and what was your particular
                                contribution? Be careful that you don’t describe
                                what the team or group did when talking about a
                                project, but what you actually did. Use the word
                                “I,” not “we” when describing actions.{" "}
                            </p>
                        </Tooltip>
                        <Tooltip
                            className="result-tooltip"
                            anchorSelect=".result-tooltip"
                            place="bottom"
                        >
                            <p className="result-tooltip tooltipText">
                                Result: Describe the outcome of your actions and
                                don’t be shy about taking credit for your
                                behavior. What happened? How did the event end?
                                What did you accomplish? What did you learn?
                                Make sure your answer contains multiple positive
                                results.{" "}
                            </p>
                        </Tooltip>
                    </div>
                    <Spacing />
                </>
            )}
            {!interviewStarted ? (
                <div className="start-interview-container">
                    <div className="interview-btn-container">
                        <button
                            className="start-interview-btn"
                            onClick={startInterview}
                        >
                            Start Interview
                        </button>
                        {isInterviewQuestionsEmpty && (
                            <div className="interview-questions-empty">
                                <h2>
                                    Please Add Some Interview Questions First.
                                </h2>
                            </div>
                        )}

                        <button
                            onClick={toggleLineupModal}
                            className="view-lineup-btn"
                        >
                            View Lineup
                        </button>
                    </div>
                    {showLineupModal && (
                        <div className="overlay">
                            <div className="lineup-modal">
                                <div className="lineup-modal-content">
                                    <h2>Your Question Lineup</h2>
                                    <div className="---">
                                        {interviewQuestions.length > 0 &&
                                        interviewQuestions[0] !== "quit" ? (
                                            interviewQuestions.map(
                                                (q, index) => (
                                                    <div key={index}>
                                                        {q !== "quit" && (
                                                            <div className="question-container">
                                                                <p>
                                                                    {index + 1}.{" "}
                                                                    {q}
                                                                </p>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDeleteQuestion(
                                                                            index
                                                                        )
                                                                    }
                                                                    className="delete-question-btn"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <p className="modal-lineup-empty-message">
                                                Your lineup is empty. Add some
                                                questions to get started!
                                            </p>
                                        )}
                                    </div>
                                    <div className="questions-modal-button-container">
                                        <button
                                            onClick={goToQuestionsPage}
                                            className="add-questions-btn question-modal-btn"
                                        >
                                            Add More Questions
                                        </button>
                                        {showRandomQuestionsButton && (
                                            <button
                                                onClick={getRandomQuestions}
                                                className="random-questions-btn question-modal-btn"
                                            >
                                                Random Questions
                                            </button>
                                        )}
                                        <button
                                            onClick={toggleLineupModal}
                                            className="close-modal-btn question-modal-btn"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="messages-container">
                    <div className="messages">
                        {messages.map((message, index) => (
                            <>
                                {message !== "quit" && (
                                    <MessageComponent
                                        key={index}
                                        msg={message}
                                        index={index}
                                    />
                                )}
                            </>
                        ))}
                    </div>

                    {isLoading && (
                        <div className="loading-container">
                            <h3 className="loading-message">
                                Processing your response
                            </h3>{" "}
                            <div className="loader"></div>
                        </div>
                    )}
                    {isTranscribing && (
                        <div className="loading-container">
                            <h3 className="loading-message">
                                Transcribing your response
                            </h3>{" "}
                            <div className="loader"></div>
                        </div>
                    )}
                    {isUserTurn &&
                        !isLoading &&
                        !isTranscribing &&
                        !isInterviewOver &&
                        !isSpeaking && (
                            <Record
                                onTranscriptionComplete={handleTranscription}
                                onTranscriptionStart={() =>
                                    setIsTranscribing(true)
                                }
                            />
                        )}
                    {newMessages.length > 0 && (
                        <TTS
                            messages={newMessages}
                            onMessageSpoken={handleSpokenMessage}
                            onSpeakingStart={handleTTSStart}
                        />
                    )}

                    {isInterviewOver && !isSpeaking && !newInterview && (
                        <div>
                            <button
                                className="interview-end-btn"
                                onClick={showFeedback}
                            >
                                View Feedback
                            </button>

                            {!alreadySaved && (
                                <button
                                    className="interview-end-btn"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Save Transcript
                                </button>
                            )}

                            <button
                                className="interview-end-btn"
                                onClick={handleNewInterview}
                            >
                                New Interview
                            </button>
                        </div>
                    )}

                    <SaveModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSave}
                    />
                    {error && <p>{error}</p>}

                    {feedbackLoading && (
                        <div className="feedback-loading">
                            <h1>{feedbackMessage}</h1>
                            <div className="loader-feedback"></div>
                        </div>
                    )}

                    <InterviewFeedback
                        messagesPass={feedbackData}
                        isOpen={isFeedbackTime}
                        onClose={() => setIsFeedbackTime(false)}
                        freqPhrases={freqPhrases}
                        freqWords={freqWords}
                        scoreAverages={scoreAverages}
                        responseFeedbackItems={responseFeedbackItems}
                    />
                </div>
            )}
        </div>
    );
};

export default Profile;
