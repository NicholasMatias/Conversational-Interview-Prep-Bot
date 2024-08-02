import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/auth.jsx";
import { db, doc, getDoc } from "../../firebase/firebase.config.js";
import { useNavigate } from "react-router-dom";
import "./Stats.css";
import Spacing from "../landing_page/spacing/Spacing.jsx";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function Stats() {
    const { currentUser } = useAuth();
    const username = currentUser.displayName;
    const email = currentUser.email;
    const [stats, setStats] = useState(null);

    const navigate = useNavigate();

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

    const toQuestions = () => {
        navigate("/questions");
    };

    useEffect(() => {
        const fetchStats = async () => {
            if (currentUser) {
                const statsRef = doc(db, "InterviewStats", currentUser.uid);
                const statsDoc = await getDoc(statsRef);
                if (statsDoc.exists()) {
                    setStats(statsDoc.data());
                }
            }
        };

        fetchStats();
    }, [currentUser]);

    if (!stats) {
        return (
            <div>
                <h1 className="middle">Loading Scores...</h1>
            </div>
        );
    }

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

    const starScoreData = {
        labels: stats.starScores.map((_, index) => `Interview ${index + 1}`),
        datasets: [
            {
                label: "Situation",
                data: stats.starScores.map((score) => score.situation),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
            {
                label: "Task",
                data: stats.starScores.map((score) => score.task),
                borderColor: "rgb(53, 162, 235)",
                backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
            {
                label: "Action",
                data: stats.starScores.map((score) => score.action),
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
            {
                label: "Result",
                data: stats.starScores.map((score) => score.result),
                borderColor: "rgb(255, 205, 86)",
                backgroundColor: "rgba(255, 205, 86, 0.5)",
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: false,
                text: "STAR Scores Over Time",
            },
        },
        scales: {
            x: {
                type: "category",
                title: {
                    display: true,
                    text: "Interviews",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Score",
                },
                min: 0,
                max: 1,
            },
        },
    };

    return (
        <>
            <nav className="navBar-container">
                <div className="navbar">
                    <div className="brand">InterviewMe</div>
                    <ul className="nav-links">
                        <li>
                            <a type="button" onClick={toQuestions}>
                                Questions
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
            <div className="stats-container">
                <Spacing />
                <div className="stats-header">
                    <h1>{username}'s Interview Stats</h1>
                    <h2>{email}</h2>
                </div>
                <Spacing />
                <h2 className="stats-header">General Stats</h2>
                <div className="basic-interview-stats">
                    <p className="stats-p">
                        Interviews completed and feedback viewed:{" "}
                        {stats.totalInterviews}
                    </p>
                    <p className="stats-p">
                        Total Questions Answered: {stats.totalQuestionsAnswered}
                    </p>
                </div>
                <Spacing />
                <h2 className="stats-header">
                    Average STAR Scores For All Question Responses
                </h2>
                <div className="score-container">
                    <p className="score-item">
                        Situation:{" "}
                        {stats.averageStarScores.situation.toFixed(2)}
                    </p>
                    <p className="score-item">
                        Task: {stats.averageStarScores.task.toFixed(2)}
                    </p>
                    <p className="score-item">
                        Action: {stats.averageStarScores.action.toFixed(2)}
                    </p>
                    <p className="score-item">
                        Result: {stats.averageStarScores.result.toFixed(2)}
                    </p>
                </div>
                <Spacing />
                <h2 className="stats-header">Most Frequent Words/Phrases</h2>
                <div className="freq-container">
                    {stats.frequentWords.map((word, index) => {
                        return (
                            <h3 key={index} className="freq-word">
                                {word.text}: {word.count}
                            </h3>
                        );
                    })}
                </div>
                <h2 className="stats-header">STAR Scores Over Time</h2>
                <div className="star-graph">
                    <Line data={starScoreData} options={options} />
                </div>

                <Spacing />
            </div>
        </>
    );
}

export default Stats;
