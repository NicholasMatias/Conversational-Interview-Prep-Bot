import React, { useState, useEffect } from "react";
import "./Questions.css";
import { useNavigate } from "react-router-dom";
import { signOut } from "../auth/auth";
import questionsData from "../../../all-interview-questions.json"; // Assuming you've saved the JSON in a file named questions.json

function Questions() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [sortBy, setSortBy] = useState("type");
    const [isShuffled, setIsShuffled] = useState(false);
    const [displayedQuestions, setDisplayedQuestions] = useState([]);
    const [currentCount, setCurrentCount] = useState(10);
    const [showBackToTop, setShowBackToTop] = useState(false);

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

    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    const handleShuffle = () => {
        const shuffledQuestions = shuffleArray([...questions])
        setQuestions(shuffledQuestions)
        setDisplayedQuestions(shuffledQuestions.slice(0,10))
        setCurrentCount(10)
        setIsShuffled(true)
        setSortBy('shuffle')

    };

    useEffect(() => {
        const flattenedQuestions = questionsData.flatMap((category) =>
            category.questions.map((q) => ({
                type: category.type,
                question: q[0],
                upvotes: q[1],
            }))
        );
        setQuestions(flattenedQuestions);
        setDisplayedQuestions(flattenedQuestions.slice(0, 10));
        setCurrentCount(10)
    }, []);

    const loadMoreQuestions = () => {
        const newCount = Math.min(currentCount+10, questions.length);
        setDisplayedQuestions(questions.slice(0, newCount));
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

    const sortQuestions = (questions, sortBy) => {
        return [...questions].sort((a, b) => {
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
    };

    const handleSort = (e) => {
        setSortBy(e.target.value);
        setIsShuffled(false);
        setDisplayedQuestions(questions.slice(0,10))
        setCurrentCount(10)
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
                </div>
                <div className="questions-list">
                    {(isShuffled ? displayedQuestions : sortQuestions(displayedQuestions, sortBy)).map(
                        (q, index) => (
                            <div key={index} className="question-item">
                                <h3>{q.type}</h3>
                                <p>{q.question}</p>
                                <span>Upvotes: {q.upvotes}</span>
                            </div>
                        )
                    )}
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
            </div>
        </div>
    );
}

export default Questions;
