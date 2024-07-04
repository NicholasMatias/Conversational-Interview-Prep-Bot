const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const groq = require("groq-sdk");





app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000
console.log('Port:', PORT)


const groqInstance = new groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/chat', async (req, res) => {
    const { message, context, lastQuestion} = req.body;
    console.log('The question asked was:\n\t', context)
    console.log("The user's response was:\n\t", message)
    try {
        const doFollowUp = Math.random()>.65 ? true: false;
        console.log("Follow up question is:", doFollowUp)
        const response = await groqInstance.chat.completions.create({
            messages: [
                {
                    role: "user",
                    
                    content: doFollowUp && !lastQuestion ? `You are a interviewer conducting a behavioral interview. Make sure to talk in the first person as if this was a normal conversation 
                    between two people. The user is about give their response to a question that you have 
                    asked. Please provide a relevant reaction to their answer and brief feedback. Remember to keep this concise. Here is the question that was asked: ${context}. Here is the user's response 
                    to the question: ${message} Lastly, ask a follow-up question to the user based on their response. Make the question relevant to them yet still broad enough to allow them to answer on their own terms. 
                    Format for the follow up question should be exactly as follows: "As a follow-up question, (the followup question)"`
                    : !lastQuestion &&!doFollowUp?
                    `You are a interviewer conducting a behavioral interview. Make sure to talk in the first person as if this was a normal conversation between two people; do not include quotes around your response.  
                    The user is about give their response to a question that you have 
                    asked. Please provide a relevant reaction to their answer and say what you liked about their response. Remember to keep this concise. Here is the question that was asked: ${context}. Here is the user's response 
                    to the question: ${message}. Do not ask any type of question within your response. Say something to end this thought and mention going on to the next question. `
                    :
                    `You are a interviewer who has just finished conducting a behavioral interview. Make sure to talk in the first person as if this was a normal conversation between two people; do not include quotes around your response. 
                    Express your thanks for getting to interview the person and mention that there will be post interview feedback via our post interview review. 
                    `
                }
            ],
            model: "llama3-70b-8192"
        });


        const botResponse = response.choices[0]?.message?.content || "I didn't understand that.";


        // Use regex (regular expression) to extract follow-up question
        const followUpQuestionMatch = botResponse.match(/follow-up question, (.*)$/);
        const followUpQuestion = followUpQuestionMatch ? followUpQuestionMatch[1].trim() : null;
        
        // console.log("Entire response:", botResponse)
        
        console.log("Follow-up question:",followUpQuestion)

        res.json({
            response: botResponse,
            followUp: followUpQuestion
        });
    } catch (error) {
        console.error("Error getting chat completion:", error);
        res.status(500).json({ error: "Error getting chat completion" });
    }
});


const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})