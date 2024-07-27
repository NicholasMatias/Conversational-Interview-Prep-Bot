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
    const [currentCompany, setCurrentCompany] = useState("");
    const [companies, setCompanies] = useState([]);
    const [sortCompany, setSortCompany] = useState("");
    const [filterCompany, setFilterCompany] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

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
                companies: companies,
                createdAt: serverTimestamp(),
                createdBy: currentUser.uid,
            });

            const newQuestionObj = {
                id: docRef.id,
                type: "User Added",
                question: newQuestion,
                upvotes: 0,
                upvotedBy: [],
                companies: companies.length > 0 ? companies : [],
            };

            setQuestions((prevQuestions) => [...prevQuestions, newQuestionObj]);
            setDisplayedQuestions((prevDisplayed) => [
                ...prevDisplayed,
                newQuestionObj,
            ]);
            setNewQuestion("");
            setCompanies([]);
            setShowAddQuestionForm(false);
        } catch (error) {
            console.error("Error adding new question:", error);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        // Reset type and company filters when user starts typing
        if (term !== "" && (sortBy !== "type" || filterCompany !== "")) {
            setSortBy("type");
            setFilterCompany("");
        }

        let filteredQuestions;

        if (term === "") {
            // If search bar is cleared, show all questions
            filteredQuestions = questions;
        } else {
            // Only show questions that match the search term
            filteredQuestions = questions.filter((q) =>
                q.question.toLowerCase().includes(term.toLowerCase())
            );
        }

        // Apply sorting (always by type when searching or when search is cleared)
        let sortedQuestions = filteredQuestions.sort((a, b) => {
            if (a.type === "User Added") return 1;
            if (b.type === "User Added") return -1;
            return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
        });

        setDisplayedQuestions(sortedQuestions.slice(0, currentCount));
    };

    const handleFilterByCompany = (e) => {
        const company = e.target.value;
        setFilterCompany(company);
        setSearchTerm("");

        // Reset sort type to "All Types" when a company is selected
        if (company !== "") {
            setSortBy("type");
        }

        // Apply filtering
        let filteredQuestions = questions;
        if (company !== "") {
            filteredQuestions = questions.filter(
                (q) =>
                    q.companies &&
                    Array.isArray(q.companies) &&
                    q.companies.some((c) => c && c.name === company)
            );
        }

        // Apply sorting (always by type when a company is selected)
        let sortedQuestions = filteredQuestions.sort((a, b) => {
            if (a.type === "User Added") return 1;
            if (b.type === "User Added") return -1;
            return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
        });
        // Apply search term filter
        if (searchTerm !== "") {
            filteredQuestions = filteredQuestions.filter((q) =>
                q.question.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setDisplayedQuestions(sortedQuestions.slice(0, currentCount));
    };

    const handleCompanyUpvote = async (questionId, companyName) => {
        const questionIndex = questions.findIndex((q) => q.id === questionId);
        const question = questions[questionIndex];
        const companyIndex = question.companies.findIndex(
            (c) => c.name === companyName
        );

        if (companyIndex === -1) return;

        const updatedCompanies = [...question.companies];
        const company = updatedCompanies[companyIndex];

        const userHasUpvoted = company.upvotedBy.includes(currentUser.uid);

        if (userHasUpvoted) {
            company.upvotes -= 1;
            company.upvotedBy = company.upvotedBy.filter(
                (uid) => uid !== currentUser.uid
            );
        } else {
            company.upvotes += 1;
            company.upvotedBy.push(currentUser.uid);
        }

        try {
            await updateDoc(doc(db, "questions", questionId), {
                companies: updatedCompanies,
            });

            const updatedQuestions = [...questions];
            updatedQuestions[questionIndex] = {
                ...question,
                companies: updatedCompanies,
            };

            setQuestions(updatedQuestions);

            // Apply current filters and sort
            const filteredAndSortedQuestions =
                applyFiltersAndSort(updatedQuestions);
            setDisplayedQuestions(
                filteredAndSortedQuestions.slice(0, currentCount)
            );
        } catch (error) {
            console.error("Error upvoting company:", error);
        }
    };

    const handleAddCompany = (e) => {
        e.preventDefault();
        if (currentCompany.trim() !== "") {
            setCompanies((prevCompanies) => {
                if (
                    !prevCompanies.some((c) => c.name === currentCompany.trim())
                ) {
                    return [
                        ...prevCompanies,
                        {
                            name: currentCompany.trim(),
                            upvotes: 0,
                            upvotedBy: [],
                        },
                    ];
                }
                return prevCompanies;
            });
            setCurrentCompany("");
        }
    };

    const handleRemoveCompany = (companyName) => {
        setCompanies((prevCompanies) =>
            prevCompanies.filter((company) => company.name !== companyName)
        );
    };

    const handleAddQuestionCancel = () => {
        setNewQuestion("");
        setShowAddQuestionForm(false);
    };

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

            // Apply current filters and sort
            const filteredAndSortedQuestions =
                applyFiltersAndSort(updatedQuestions);
            setDisplayedQuestions(
                filteredAndSortedQuestions.slice(0, currentCount)
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
        setIsShuffled(true);
        setSortBy("shuffle");
        setFilterCompany("");
        setSearchTerm(""); // Clear the search term

        const shuffledQuestions = shuffleArray([...questions]);
        setDisplayedQuestions(shuffledQuestions.slice(0, currentCount));
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
        const newCount = Math.min(currentCount + 20, questions.length);
        setCurrentCount(newCount);

        let filteredQuestions;

        if (searchTerm === "") {
            // If no search term, apply normal filters
            filteredQuestions = questions;
            if (filterCompany !== "") {
                filteredQuestions = filteredQuestions.filter(
                    (q) =>
                        q.companies &&
                        Array.isArray(q.companies) &&
                        q.companies.some((c) => c && c.name === filterCompany)
                );
            }
        } else {
            // If there's a search term, only show matching questions
            filteredQuestions = questions.filter((q) =>
                q.question.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        let sortedQuestions;
        if (sortBy === "type" || searchTerm !== "") {
            sortedQuestions = filteredQuestions.sort((a, b) => {
                if (a.type === "User Added") return 1;
                if (b.type === "User Added") return -1;
                return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
            });
        } else if (sortBy === "upvotes") {
            sortedQuestions = filteredQuestions.sort(
                (a, b) => b.upvotes - a.upvotes
            );
        } else if (typeOrder.includes(sortBy)) {
            sortedQuestions = filteredQuestions.filter(
                (q) => q.type === sortBy
            );
        } else {
            sortedQuestions = filteredQuestions;
        }

        setDisplayedQuestions(sortedQuestions.slice(0, newCount));
    };

    const applyFiltersAndSort = (questionsToFilter) => {
        let filteredQuestions = questionsToFilter;

        // Apply search filter
        if (searchTerm !== "") {
            filteredQuestions = filteredQuestions.filter((q) =>
                q.question.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply company filter
        if (filterCompany !== "") {
            filteredQuestions = filteredQuestions.filter(
                (q) =>
                    q.companies &&
                    Array.isArray(q.companies) &&
                    q.companies.some((c) => c && c.name === filterCompany)
            );
        }

        // Apply sorting
        let sortedQuestions;
        if (sortBy === "type") {
            sortedQuestions = filteredQuestions.sort((a, b) => {
                if (a.type === "User Added") return 1;
                if (b.type === "User Added") return -1;
                return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
            });
        } else if (sortBy === "upvotes") {
            sortedQuestions = filteredQuestions.sort(
                (a, b) => b.upvotes - a.upvotes
            );
        } else if (typeOrder.includes(sortBy)) {
            sortedQuestions = filteredQuestions.filter(
                (q) => q.type === sortBy
            );
        } else {
            sortedQuestions = filteredQuestions;
        }

        return sortedQuestions;
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

    const sortQuestions = (allQuestions, sortBy, count, sortCompany) => {
        let sorted = [...allQuestions];

        if (sortBy === "company") {
            sorted = sorted
                .filter((q) =>
                    q.companies.some(
                        (c) =>
                            c.name.toLowerCase() === sortCompany.toLowerCase()
                    )
                )
                .sort((a, b) => {
                    const companyA = a.companies.find(
                        (c) =>
                            c.name.toLowerCase() === sortCompany.toLowerCase()
                    );
                    const companyB = b.companies.find(
                        (c) =>
                            c.name.toLowerCase() === sortCompany.toLowerCase()
                    );
                    return companyB.upvotes - companyA.upvotes;
                });
        } else if (sortBy === "type") {
            sorted.sort((a, b) => {
                if (a.type === "User Added") return 1;
                if (b.type === "User Added") return -1;
                return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
            });
        } else if (sortBy === "upvotes") {
            sorted.sort((a, b) => b.upvotes - a.upvotes);
        } else if (typeOrder.includes(sortBy)) {
            sorted = sorted.filter((q) => q.type === sortBy);
        }

        return sorted.slice(0, count);
    };

    const handleSort = (e) => {
        const newSortBy = e.target.value;
        setSortBy(newSortBy);
        setIsShuffled(false);
        setSearchTerm("");

        // Reset company filter if a type filter is selected
        if (newSortBy !== "type" && newSortBy !== "upvotes") {
            setFilterCompany("");
        }

        // Apply filtering and sorting
        let filteredQuestions = questions;
        if (newSortBy !== "type" && newSortBy !== "upvotes") {
            // If a specific type is selected, filter by that type
            filteredQuestions = questions.filter((q) => q.type === newSortBy);
        } else if (filterCompany !== "") {
            // If no specific type is selected but a company filter is active, apply company filter
            filteredQuestions = questions.filter(
                (q) =>
                    q.companies &&
                    Array.isArray(q.companies) &&
                    q.companies.some((c) => c && c.name === filterCompany)
            );
        }

        // Apply sorting
        let sortedQuestions;
        if (newSortBy === "type") {
            sortedQuestions = filteredQuestions.sort((a, b) => {
                if (a.type === "User Added") return 1;
                if (b.type === "User Added") return -1;
                return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
            });
        } else if (newSortBy === "upvotes") {
            sortedQuestions = filteredQuestions.sort(
                (a, b) => b.upvotes - a.upvotes
            );
        } else {
            sortedQuestions = filteredQuestions; // For specific type filters, no additional sorting needed
        }

        // Apply search term filter
        if (searchTerm !== "") {
            filteredQuestions = filteredQuestions.filter((q) =>
                q.question.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setDisplayedQuestions(sortedQuestions.slice(0, currentCount));
    };

    const handleSortByCompany = (e) => {
        const company = e.target.value;
        setSortCompany(company);
        setSortBy("company");
        setDisplayedQuestions(
            sortQuestions(questions, "company", currentCount, company)
        );
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
                <div className="sort-and-filter-container">
                    <div className="search-and-filter-container">
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search questions..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="search-input"
                            />
                        </div>
                        <div className="sort-and-filter-container">
                            <div className="sort-container">
                                {/* ... existing sort dropdown ... */}
                            </div>
                            <div className="filter-container">
                                {/* ... existing company filter dropdown ... */}
                            </div>
                        </div>
                    </div>

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
                        <button onClick={handleShuffle}>
                            Shuffle Questions
                        </button>
                        <button
                            onClick={toggleAddQuestionForm}
                            className="add-question-btn"
                        >
                            {showAddQuestionForm
                                ? "Cancel"
                                : "Add New Question"}
                        </button>
                    </div>
                    <div className="filter-container">
                        <label htmlFor="company-filter">
                            Filter by Company:{" "}
                        </label>
                        <select
                            id="company-filter"
                            value={filterCompany}
                            onChange={handleFilterByCompany}
                        >
                            <option value="">All Companies</option>
                            {Array.from(
                                new Set(
                                    questions
                                        .filter(
                                            (q) =>
                                                q.companies &&
                                                Array.isArray(q.companies)
                                        )
                                        .flatMap((q) =>
                                            q.companies.map((c) => c.name)
                                        )
                                )
                            )
                                .sort()
                                .map((company) => (
                                    <option key={company} value={company}>
                                        {company}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>
                <div className="questions-list">
                    {displayedQuestions.map((q) => (
                        <div key={q.id} className="question-item">
                            <h3>{q.type}</h3>
                            <p>{q.question}</p>
                            {q.companies && q.companies.length > 0 && (
                                <div className="question-companies">
                                    {q.companies.map((company, index) => (
                                        <span
                                            key={index}
                                            className="company-tag"
                                        >
                                            {company.name} ({company.upvotes})
                                            <button
                                                onClick={() =>
                                                    handleCompanyUpvote(
                                                        q.id,
                                                        company.name
                                                    )
                                                }
                                                className={`upvote-button ${
                                                    company.upvotedBy.includes(
                                                        currentUser.uid
                                                    )
                                                        ? "upvoted"
                                                        : ""
                                                }`}
                                            >
                                                ▲
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
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
                            <div className="company-input">
                                <input
                                    type="text"
                                    value={currentCompany}
                                    onChange={(e) =>
                                        setCurrentCompany(e.target.value)
                                    }
                                    placeholder="Enter company tag..."
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCompany}
                                >
                                    Add Company
                                </button>
                            </div>
                            <div className="company-tags">
                                {companies.map((company, index) => (
                                    <span key={index} className="company-tag">
                                        {company.name}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveCompany(
                                                    company.name
                                                )
                                            }
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>

                            <button type="submit">Submit Question</button>
                            <button
                                type="button"
                                onClick={handleAddQuestionCancel}
                                className="add-question-cancel-btn"
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Questions;
