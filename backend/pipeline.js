const groq = require("groq-sdk");
const readline = require("readline");
require("dotenv").config();

const groqInstance = new groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log("Welcome to the Conversational Interview Prep Bot!");
    console.log("Type 'exit' to end the conversation.\n");

    // Initial prompt to start the interview
    const initialPrompt = "Ask me a very basic behavioral interview question. Keep in mind that I am still in college and do not have very much experience yet.";

    try {
        const initialResponse = await getGroqChatCompletion(initialPrompt);
        console.log(`Bot: ${initialResponse.choices[0]?.message?.content || "I didn't understand that."}\n`);
    } catch (error) {
        console.error("Error in getting initial response:", error);
    }

    rl.on('line', async (input) => {
        if (input.toLowerCase() === 'exit') {
            rl.close();
        } else {
            try {
                const response = await getGroqChatCompletion(input);
                console.log(`Bot: ${response.choices[0]?.message?.content || "I didn't understand that."}\n`);
            } catch (error) {
                console.error("Error in getting response:", error);
            }
        }
    });
}

async function getGroqChatCompletion(prompt) {
    try {
        const response = await groqInstance.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama3-70b-8192"
        });
        return response;
    } catch (error) {
        console.error("Error getting chat completion:", error);
        throw error;
    }
}

main();
