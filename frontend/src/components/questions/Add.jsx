import {  collection, addDoc } from "firebase/firestore";
import questionsData from '../../../all-interview-questions.json';
import { db } from "../../../../backend/firebase/firebase.config";

function Add(){
const initializeQuestions = async () => {
    const flattenedQuestions = questionsData.flatMap((category, categoryIndex) => 
        category.questions.map((q, questionIndex) => ({
            id: `${category.type}-${categoryIndex}-${questionIndex}`,
            type: category.type,
            question: q[0],
            upvotes: q[1],
            upvotedBy: []
        }))
    );

    for (let question of flattenedQuestions) {
        try {
            await addDoc(collection(db, "questions"), question);
            console.log(`Added question: ${question.question}`);
        } catch (error) {
            console.error("Error adding question:", error);
        }
    }
    console.log("Finished adding all questions");
};

return(
    <>
    <button onClick={initializeQuestions}>start</button>
    </>
)
}

export default Add