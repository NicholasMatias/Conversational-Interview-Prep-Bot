import express from "express";
import cors from "cors";
import groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import fs from "fs";
const app = express();

import {
    doFollowUp_notLastQuestion_prompt,
    notLastQuestion_notFollowUp_prompt,
    lastQuestion_prompt,
    errorChatCompletion,
    errorTranscribingAudio,
    baseURL,
    PORT,
    feedbackPrompt,
    followUpQuestionThreshold,
} from "./constants.js";
import {
    getAction,
    getResult,
    getSituation,
    getTask,
} from "./models/TextClassification.cjs";
import { getRelevanceScore } from "./models/QnA_Relevance.js";
import { getFreq } from "./models/Word_Freq.js";

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    next();
});

// This api call accesses Llama3's llama3-70b-8192 model through using groqcloud.
const groqInstance = new groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/api/chat", async (req, res) => {
    const { message, context, lastQuestionCheck, prevIsFollowUp } = req.body;

    let lastQuestion = lastQuestionCheck === "quit";
    try {
        const doFollowUp =
            Math.random() > followUpQuestionThreshold && !lastQuestion;

        const prompt = lastQuestion
            ? lastQuestion_prompt(context, message)
            : doFollowUp
            ? doFollowUp_notLastQuestion_prompt(context, message)
            : notLastQuestion_notFollowUp_prompt(context, message);

        const response = await groqInstance.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama3-70b-8192",
        });

        const botResponse =
            response.choices[0]?.message?.content ||
            "I didn't understand that.";

        res.json({
            response: botResponse,
            followUp: doFollowUp,
            lastQuestion: lastQuestion,
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
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

const groqSTT = new groq({
    apiKey: process.env.GROQ_API_KEY,
});

app.post("/transcribe", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        const translation = await groqSTT.audio.transcriptions.create({
            file: fs.createReadStream(file.path),
            model: "whisper-large-v3",
            prompt: "Specify context or spelling",
            response_format: "json",
            temperature: 0.0,
        });

        fs.unlinkSync(file.path, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            } else {
                res.status(200);
            }
        });

        res.json(translation.text);
    } catch (error) {
        console.error(errorTranscribingAudio, error);
        res.status(500).json({ error: errorTranscribingAudio });
    }
});

app.post("/situation", async (req, res) => {
    try {
        const { response } = req.body;
        const results = getSituation(response);
        res.json(results);
    } catch (error) {
        console.error("Error getting situation metric:", error);
        res.status(500).json({ error: "Error getting situation metric" });
    }
});

app.post("/task", async (req, res) => {
    try {
        const { response } = req.body;
        const results = getTask(response);
        res.json(results);
    } catch (error) {
        console.error("Error getting task metric:", error);
        res.status(500).json({ error: "Error getting task metric" });
    }
});

app.post("/action", async (req, res) => {
    try {
        const { response } = req.body;
        const results = getAction(response);
        res.json(results);
    } catch (error) {
        console.error("Error getting action metric:", error);
        res.status(500).json({ error: "Error getting action metric" });
    }
});

app.post("/result", async (req, res) => {
    try {
        const { response } = req.body;
        const results = getResult(response);
        res.json(results);
    } catch (error) {
        console.error("Error getting result metric:", error);
        res.status(500).json({ error: "Error getting result metric" });
    }
});

app.post("/relevance", async (req, res) => {
    try {
        const { question, response } = req.body;
        const results = getRelevanceScore(question, response);
        res.json(results);
    } catch (error) {
        console.error("Error getting relevance score:", error);
        res.status(500).json({ error: "Error getting relevance score." });
    }
});

app.post("/frequency", async (req, res) => {
    try {
        const { responses, number, gramSize } = req.body;
        const results = getFreq(responses, number, gramSize);
        res.json(results);
    } catch (error) {
        console.error("Error getting word frequency:", error);
        res.status(500).json({ error: "Error getting freauency" });
    }
});

const groqFeedback = new groq({ apiKey: process.env.GROQ_API_KEY });

app.post("/feedback", async (req, res) => {
    try {
        const { userResponse, question, scores } = req.body;

        const response = await groqFeedback.chat.completions.create({
            messages: [
                {
                    role: "user",

                    content: feedbackPrompt(userResponse, question, scores),
                },
            ],
            model: "llama3-70b-8192",
        });

        const botResponse =
            response.choices[0]?.message?.content ||
            "I didn't understand that.";

        res.json({
            response: botResponse,
        });
    } catch (error) {
        console.error(errorChatCompletion, error);
        res.status(500).json({ error: errorChatCompletion });
    }
});

const server = app.listen(PORT, () => {
    console.log(`Server is running on ${baseURL}`);
});
