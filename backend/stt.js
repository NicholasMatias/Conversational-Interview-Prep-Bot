const { createClient } = require("@deepgram/sdk");

const transcribeUrl = async () => {
    // The API key we created in step 3
    const deepgramApiKey = "e3469747f09d3fc1a2b0599c37e79ca6da0ace41";

    // Hosted sample file
    const url = "https://static.deepgram.com/examples/Bueller-Life-moves-pretty-fast.wav";

    // Initializes the Deepgram SDK
    const deepgram = createClient(deepgramApiKey);

    const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
        { url },
        { smart_format: true, model: 'nova-2', language: 'en-US' },
    );

    if (error) throw error;
    if (!error) console.dir(result, { depth: null });
};

transcribeUrl();
