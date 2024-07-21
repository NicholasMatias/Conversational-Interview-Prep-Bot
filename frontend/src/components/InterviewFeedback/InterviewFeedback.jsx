import './InterviewFeedback.css'
import { useState } from 'react';
// import { getFreq } from '../../../../backend/models/Word_Freq';
// import { getRelevanceScore } from '../../../../backend/models/QnA_Relevance';
// import { getResults } from '../../../../backend/models/TextClassification.cjs';


const InterviewFeedback = ({ messagesPass, isOpen, onClose }) => {

    if (!isOpen) return null;

    const [situation, setSituation] = useState("")
    const [task, setTask] = useState("")
    const [action, setAction] = useState("")
    const [result, setResult] = useState("")

    const getSituation = async(userResponse) => {
        const response = await fetch("http://localhost:5000/situation", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({response: userResponse}),
        });

        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const situationScore = await response.json()
        console.log(metrics);
        return situationScore;
    }

    return (
        <div className="overlay ">
            <div className="modal">
                <h1>Test</h1>
                <button onClick={onClose}>Close</button>
                <h1>{`Situation Score: ${getSituation("Let's see what happends when I lead a project.")}`}</h1>
            </div>

        </div>
    )
}

export default InterviewFeedback