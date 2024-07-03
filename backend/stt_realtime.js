// const { createClient, LiveTranscriptionEvents } = require("@deepgram/sdk");
// const fetch = require("cross-fetch");

// const live = async () => {
//     // The API key you created in step 1
//     const deepgramApiKey = "e3469747f09d3fc1a2b0599c37e79ca6da0ace41";

//     // URL for the real-time streaming audio you would like to transcribe
//     const url = "http://stream.live.vc.bbcmedia.co.uk/bbc_world_service";

//     // Initialize the Deepgram SDK
//     const deepgram = createClient(deepgramApiKey);

//     // Create a websocket connection to Deepgram
//     const connection = deepgram.listen.live({
//         smart_format: true,
//         model: 'nova-2',
//         language: 'en-US',
//     });

//     // Listen for the connection to open.
//     connection.on(LiveTranscriptionEvents.Open, () => {
//         // Listen for any transcripts received from Deepgram and write them to the console.
//         connection.on(LiveTranscriptionEvents.Transcript, (data) => {
//             console.dir(data, { depth: null });
//         });

//         // Listen for any metadata received from Deepgram and write it to the console.
//         connection.on(LiveTranscriptionEvents.Metadata, (data) => {
//             console.dir(data, { depth: null });
//         });

//         // Listen for the connection to close.
//         connection.on(LiveTranscriptionEvents.Close, () => {
//             console.log("Connection closed.");
//         });

//         // Send streaming audio from the URL to Deepgram.
//         fetch(url)
//             .then((r) => r.body)
//             .then((res) => {
//                 res.on("readable", () => {
//                     connection.send(res.read());
//                 });
//             });
//     });
// };

// live();














const { createClient, LiveTranscriptionEvents } = require('deepgram/sdk');
const getUserMedia = require('get-user-media-promise');

// Deepgram API key
const deepgramApiKey = 'e3469747f09d3fc1a2b0599c37e79ca6da0ace41';

// Initialize the Deepgram SDK
const deepgram = createClient(deepgramApiKey);

// Create a websocket connection to Deepgram
const connection = deepgram.transcription.live({
    punctuate: true,
    interim_results: true,
    language: 'en-US',
});

// Listen for the connection to open
connection.on('open', () => {
    console.log('Connection opened.');
});

// Listen for any transcripts received from Deepgram and write them to the console
connection.on(LiveTranscriptionEvents.Transcript, (transcript) => {
    console.log(transcript);
});

// Listen for any metadata received from Deepgram and write it to the console
connection.on(LiveTranscriptionEvents.Metadata, (metadata) => {
    console.log(metadata);
});

// Listen for the connection to close
connection.on(LiveTranscriptionEvents.Close, () => {
    console.log('Connection closed.');
});

// Get user media (microphone)
getUserMedia({ audio: true })
    .then((stream) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const mediaStreamSource = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        mediaStreamSource.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const inputBuffer = new ArrayBuffer(inputData.length * 2);
            const inputView = new DataView(inputBuffer);

            for (let i = 0; i < inputData.length; i++) {
                inputView.setInt16(i * 2, inputData[i] * 0x7FFF, true);
            }

            connection.send(inputBuffer);
        };
    })
    .catch((err) => {
        console.error('Error accessing the microphone: ', err);
    });
