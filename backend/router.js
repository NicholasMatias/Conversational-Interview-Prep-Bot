import express from 'express';
import cors from 'cors';
import groq from 'groq-sdk'
import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';
import fs from 'fs';
const app = express()

import {doFollowUp_notLastQuestion_prompt, notLastQuestion_notFollowUp_prompt, lastQuestion_prompt, errorChatCompletion, errorTranscribingAudio, baseURL, PORT} from './constants.js';




app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
    next();
});

// This api call accesses Llama3's llama3-70b-8192 model through using groqcloud. 
const groqInstance = new groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/chat', async (req, res) => {
    const { message, context, lastQuestionCheck, prevIsFollowUp } = req.body;

    let lastQuestion = lastQuestionCheck == "quit";
    try {
        const doFollowUp = Math.random() > .65 && !lastQuestion;
        if (doFollowUp || prevIsFollowUp){
            lastQuestion = false;
        }

        const response = await groqInstance.chat.completions.create({
            messages: [
                {
                    role: "user",

                    content: doFollowUp && !lastQuestion ? doFollowUp_notLastQuestion_prompt(context, message)
                        : !lastQuestion && !doFollowUp ? notLastQuestion_notFollowUp_prompt(context, message)
                        : lastQuestion_prompt(context, message)
                }
            ],
            model: "llama3-70b-8192",
        });


        const botResponse = response.choices[0]?.message?.content || "I didn't understand that.";


        res.json({
            response: botResponse,
            followUp: doFollowUp
        });
    } catch (error) {
        console.error(errorChatCompletion, error);
        res.status(500).json({ error: errorChatCompletion });
    }
});








// Configure Multer for file uploads, this essentially stores the user's audio response until it is sent through the api for transcription. The audio file is then deleted. 
//technically is stored in uploads folder for a ms or two before being deleted.     
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
        console.error(errorTranscribingAudio, error);
        res.status(500).json({ error: errorTranscribingAudio });
    }
});











const server = app.listen(PORT, () => {
    console.log(`Server is running on ${baseURL}`)
})