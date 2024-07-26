import React, { useState, useEffect } from "react";
import "./Questions.css";
import { useNavigate } from "react-router-dom";
import { signOut } from "../auth/auth";
import questionsData from "../../../all-interview-questions.json"; // Assuming you've saved the JSON in a file named questions.json
import {
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    collection,
    getDocs,
    serverTimestamp,
    addDoc,
} from "firebase/firestore";
import { db } from "../../../../backend/firebase/firebase.config";
import { useAuth } from "../auth/auth.jsx";

function Questions() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [sortBy, setSortBy] = useState("type");
    const [isShuffled, setIsShuffled] = useState(false);
    const [displayedQuestions, setDisplayedQuestions] = useState([]);
    const [currentCount, setCurrentCount] = useState(10);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [newQuestion, setNewQuestion] = useState("");
    const [showAddQuestionForm, setShowAddQuestionForm] = useState(false);

    const typeOrder = [
        "Adaptability",
        "Leadership",
        "Communication",
        "Problem Solving",
        "Teamwork",
        "Time Management",
        "Creativity",
        "Conflict Resolution",
        "User Added",
    ];

    const { currentUser } = useAuth();

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        if (newQuestion.trim() === "") return;

        try {
            const docRef = await addDoc(collection(db, "questions"), {
                type: "User Added",
                question: newQuestion,
                upvotes: 0,
                upvotedBy: [],
                createdAt: serverTimestamp(),
                createdBy: currentUser.uid,
            });

            const newQuestionObj = {
                id: docRef.id,
                type: "User Added",
                question: newQuestion,
                upvotes: 0,
                upvotedBy: [],
            };

            setQuestions((prevQuestions) => [...prevQuestions, newQuestionObj]);
            setDisplayedQuestions((prevDisplayed) => [
                ...prevDisplayed,
                newQuestionObj,
            ]);
            setNewQuestion("");
            setShowAddQuestionForm(false);
        } catch (error) {
            console.error("Error adding new question:", error);
        }
    };

    const handleAddQuestionCancel = () => {
        setNewQuestion('')
        setShowAddQuestionForm(false)
    }

    const toggleAddQuestionForm = () => {
        setShowAddQuestionForm(!showAddQuestionForm);
    };

    const handleUpvote = async (questionId) => {
        const questionIndex = questions.findIndex((q) => q.id === questionId);
        const question = questions[questionIndex];
        const userHasUpvoted = question.upvotedBy.includes(currentUser.uid);

        const questionRef = doc(db, "questions", questionId);

        try {
            if (userHasUpvoted) {
                await updateDoc(questionRef, {
                    upvotes: question.upvotes - 1,
                    upvotedBy: arrayRemove(currentUser.uid),
                });
            } else {
                await updateDoc(questionRef, {
                    upvotes: question.upvotes + 1,
                    upvotedBy: arrayUnion(currentUser.uid),
                });
            }

            // Update local state
            const updatedQuestions = [...questions];
            updatedQuestions[questionIndex] = {
                ...question,
                upvotes: userHasUpvoted
                    ? question.upvotes - 1
                    : question.upvotes + 1,
                upvotedBy: userHasUpvoted
                    ? question.upvotedBy.filter(
                          (uid) => uid !== currentUser.uid
                      )
                    : [...question.upvotedBy, currentUser.uid],
            };

            setQuestions(updatedQuestions);
            setDisplayedQuestions(
                sortQuestions(updatedQuestions, sortBy, currentCount)
            );
        } catch (error) {
            console.error("Error updating upvote:", error);
        }
    };

    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    const handleShuffle = () => {
        const shuffledQuestions = shuffleArray([...questions]);
        setQuestions(shuffledQuestions);
        setDisplayedQuestions(shuffledQuestions.slice(0, 10));
        setCurrentCount(10);
        setIsShuffled(true);
        setSortBy("shuffle");
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            const querySnapshot = await getDocs(collection(db, "questions"));
            const fetchedQuestions = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setQuestions(fetchedQuestions);
            setDisplayedQuestions(sortQuestions(fetchedQuestions, "type", 10));
            setCurrentCount(10);
        };

        fetchQuestions();
    }, []);

    const loadMoreQuestions = () => {
        const newCount = Math.min(currentCount + 10, questions.length);
        setDisplayedQuestions(sortQuestions(questions, sortBy, newCount));
        setCurrentCount(newCount);
    };

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.pageYOffset > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const sortQuestions = (allQuestions, sortBy, count) => {
        const sorted = [...allQuestions].sort((a, b) => {
            if (sortBy === "type") {
                return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
            } else if (sortBy === "upvotes") {
                return b.upvotes - a.upvotes;
            } else if (typeOrder.includes(sortBy)) {
                if (a.type === sortBy) return -1;
                if (b.type === sortBy) return 1;
                return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
            }
            return 0;
        });
        return sorted.slice(0, count);
    };

    const handleSort = (e) => {
        const newSortBy = e.target.value;
        setSortBy(newSortBy);
        setIsShuffled(false);
        setDisplayedQuestions(sortQuestions(questions, newSortBy, 20));
        setCurrentCount(20);
    };

    const sortedQuestions = sortQuestions(questions, sortBy);

    const toHome = () => {
        navigate("/home");
    };

    const toInterview = () => {
        navigate("/profile");
    };

    const toFolders = () => {
        navigate("/folders");
    };

    const handleSignout = async () => {
        try {
            await signOut();
            navigate("/");
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <div className="questions-page">
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
                            <a type="button" onClick={toInterview}>
                                Interview
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

            <div className="questions-container">
                <h1>Interview Questions</h1>
                <div className="sort-container">
                    <label htmlFor="sort-select">Sort by: </label>
                    <select
                        id="sort-select"
                        value={sortBy}
                        onChange={handleSort}
                    >
                        <option value="type">Question Type</option>
                        {typeOrder.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                        <option value="upvotes">Most Upvotes</option>
                    </select>
                    <button onClick={handleShuffle}>Shuffle Questions</button>
                    <button
                        onClick={toggleAddQuestionForm}
                        className="add-question-btn"
                    >
                        {showAddQuestionForm ? "Cancel" : "Add New Question"}
                    </button>
                </div>
                <div className="questions-list">
                    {displayedQuestions.map((q) => (
                        <div key={q.id} className="question-item">
                            <h3>{q.type}</h3>
                            <p>{q.question}</p>
                            <div className="upvote-container">
                                <button
                                    onClick={() => handleUpvote(q.id)}
                                    className={`upvote-button ${
                                        q.upvotedBy.includes(currentUser.uid)
                                            ? "upvoted"
                                            : ""
                                    }`}
                                >
                                    ▲
                                </button>
                                <span>Upvotes: {q.upvotes}</span>
                            </div>
                        </div>
                    ))}
                </div>
                {currentCount < questions.length && (
                    <button
                        onClick={loadMoreQuestions}
                        className="load-more-btn"
                    >
                        Load More Questions
                    </button>
                )}
                {showBackToTop && (
                    <button onClick={scrollTop} className="back-to-top-btn">
                        Back To Top
                    </button>
                )}

                {showAddQuestionForm && (
                    <div className="add-question-container">
                    <form
                        onSubmit={handleAddQuestion}
                        className="add-question-form"
                    >
                        <textarea
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Enter your question here..."
                            required
                        />
                        <button type="submit">Submit Question</button>
                        <button type="button" onClick={handleAddQuestionCancel} className="add-question-cancel-btn">Cancel</button>
                    </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Questions;
