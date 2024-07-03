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
    const { message } = req.body;

    try {
        const response = await groqInstance.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: message
                }
            ],
            model: "llama3-70b-8192"
        });
        res.json({ response: response.choices[0]?.message?.content || "I didn't understand that." });
    } catch (error) {
        console.error("Error getting chat completion:", error);
        res.status(500).json({ error: "Error getting chat completion" });
    }
});


const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})