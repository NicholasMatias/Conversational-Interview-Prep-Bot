import "./Questions.css";
import { useNavigate } from "react-router-dom";
import {useState, useEffect} from 'react'
import { signOut } from "../auth/auth";
import questionsData from "../../../all-interview-questions.json";
function Questions() {
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);


    useEffect(() => {
        const flattenedQuestions = questionsData.flatMap((category) =>
            category.questions.map((q) => ({
                type: category.type,
                question: q[0],
                upvotes: q[1],
            }))
        );
        setQuestions(flattenedQuestions);
    }, []);

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

    //     return (
    //         <>
    //             <nav className="navBar-container">
    //                 <div className="navbar">
    //                     <div className="brand">InterviewMe</div>
    //                     <ul className="nav-links">
    //                         <li>
    //                             <a type="button" onClick={toHome}>
    //                                 Home
    //                             </a>
    //                         </li>

    //                         <li>
    //                             <a type="button" onClick={toInterview}>
    //                                 Interview
    //                             </a>
    //                         </li>

    //                         <li>
    //                             <a type="button" onClick={toFolders}>
    //                                 Folders
    //                             </a>
    //                         </li>

    //                         <li>
    //                             <a type="button" onClick={handleSignout}>
    //                                 Logout
    //                             </a>
    //                         </li>
    //                     </ul>
    //                 </div>
    //             </nav>
    //         </>
    //     );
    // }
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
                <div className="questions-list">
                    {questions.map((q, index) => (
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
