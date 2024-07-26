import React, { useState, useEffect } from "react";
import "./Questions.css";
import { useNavigate } from "react-router-dom";
import { signOut } from "../auth/auth";
import questionsData from "../../../all-interview-questions.json"; // Assuming you've saved the JSON in a file named questions.json

function Questions() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [sortBy, setSortBy] = useState("type");

    

    useEffect(() => {
        // Flatten the questions array
        const flattenedQuestions = questionsData.flatMap((category) =>
            category.questions.map((q) => ({
                type: category.type,
                question: q[0],
                upvotes: q[1],
            }))
        );
        setQuestions(flattenedQuestions);
    }, []);

    const sortQuestions = (questions, sortBy) => {
        return [...questions].sort((a, b) => {
            if (sortBy === "type") {
                return a.type.localeCompare(b.type);
            } else if (sortBy === "upvotes") {
                return b.upvotes - a.upvotes;
            }
            return 0;
        });
    };

    const handleSort = (e) => {
        setSortBy(e.target.value);
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
                        <option value="upvotes">Most Upvotes</option>
                    </select>
                </div>
                <div className="questions-list">
                    {sortedQuestions.map((q, index) => (
                        <div key={index} className="question-item">
                            <h3>{q.type}</h3>
                            <p>{q.question}</p>
                            <span>Upvotes: {q.upvotes}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Questions;
