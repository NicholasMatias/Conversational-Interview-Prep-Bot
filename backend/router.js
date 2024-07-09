const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const groq = require("groq-sdk");
const multer = require('multer');
const fs = require('fs');





app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
    next();
});
const PORT = process.env.PORT || 3000


const groqInstance = new groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/chat', async (req, res) => {
    const { message, context, lastQuestionCheck, prevIsFollowUp } = req.body;

    let lastQuestion = lastQuestionCheck == "quit" ? true : false
    try {
        const doFollowUp = Math.random() > .65 && !lastQuestion ? true : false;
        if (doFollowUp) { lastQuestion = false; }

        if (prevIsFollowUp) { lastQuestion = false; }

        const response = await groqInstance.chat.completions.create({
            messages: [
                {
                    role: "user",

                    content: doFollowUp && !lastQuestion ? `You are a interviewer conducting a behavioral interview. Make sure to talk in the first person as if this was a normal conversation 
                    between two people. The user is about give their response to a question that you have 
                    asked. Please provide a relevant reaction to their answer and brief feedback. Remember to keep this concise. Here is the question that was asked: ${context}. Here is the user's response 
                    to the question: ${message} Lastly, ask a follow-up question to the user based on their response. Make the question relevant to them yet still broad enough to allow them to answer on their own terms. 
                    Format for the follow up question should be exactly as follows: "As a follow-up question, (the followup question)"`
                        : !lastQuestion && !doFollowUp ?
                            `You are a interviewer conducting a behavioral interview. Make sure to talk in the first person as if this was a normal conversation between two people; do not include quotes around your response.  
                    The user is about give their response to a question that you have 
                    asked. Please provide a relevant reaction to their answer and say what you liked about their response. Remember to keep this concise. Here is the question that was asked: ${context}. Here is the user's response 
                    to the question: ${message}. Do not ask any type of question within your response. Say something to end this thought and mention going on to the next question. `
                            :
                            `
                    You are a interviewer conducting a behavioral interview. Make sure to talk in the first person as if this was a normal conversation between two people; do not include quotes around your response.  
                    The user is about give their response to a question that you have 
                    asked. Please provide a relevant reaction to their answer and say what you liked about their response. Remember to keep this concise. Here is the question that was asked: ${context}. Here is the user's response 
                    to the question: ${message}. Do not ask any type of question within your response. Say something to end this thought.
                    Lastly, since this was the last question, you are done conducting the interview.
                    You must always express your thanks for getting to interview the person and mention that there will be post interview feedback via our post interview review on our platform InterviewMe. 
                    `
                }
            ],
            model: "llama3-70b-8192",
        });


        const botResponse = response.choices[0]?.message?.content || "I didn't understand that.";


        // Use regex (regular expression) to extract follow-up question
        const followUpQuestionMatch = botResponse.match(/follow-up question, (.*)$/);
        const followUpQuestion = followUpQuestionMatch ? followUpQuestionMatch[1].trim() : null;
        res.json({
            response: botResponse,
            followUp: followUpQuestion
        });
    } catch (error) {
        console.error("Error getting chat completion:", error);
        res.status(500).json({ error: "Error getting chat completion" });
    }
});








// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

const groqSTT = new groq({
    apiKey: process.env.GROQ_API_KEY,
});

app.post('/transcribe', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const translation = await groqSTT.audio.transcriptions.create({
            file: fs.createReadStream(file.path),
            model: 'whisper-large-v3',
            prompt: 'Specify context or spelling',
            response_format: 'json',
            temperature: 0.0,
        });

        // Delete the file after processing if needed

        fs.unlinkSync(file.path, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            }
            else {
                res.status(200);
            }
        });

        res.json(translation.text);


    } catch (error) {
        console.error('Error transcribing audio:', error);
        res.status(500).json({ error: 'Error transcribing audio' });
    }
});











const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})