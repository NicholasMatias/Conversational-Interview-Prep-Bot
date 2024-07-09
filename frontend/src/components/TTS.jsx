import React, { useEffect, useState, useRef } from 'react';

const TTS = ({ messages, onMessageSpoken }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [queue, setQueue] = useState([]);
    const isSpeakingRef = useRef(false);

    useEffect(() => {
        setQueue(messages);
    }, [messages]);

    useEffect(() => {
        if (!isSpeakingRef.current && queue.length > 0) {
            speak(queue[0]);
        }
    }, [queue]);

    const speak = async (message) => {
        if (isSpeakingRef.current || message.content=="quit") return;
        isSpeakingRef.current = true;
        setIsLoading(true);
        setError(null);

        const DEEPGRAM_URL = "https://api.deepgram.com/v1/speak?model=aura-asteria-en";
        const DEEPGRAM_API_KEY = "1128ad09116c1e4e9294f4f0266685f63cfe00cd"; //Was having difficulty with env file for some reason on this one. 
        //Likely due to it being on the frontend. I tried adding REACT_APP as a prefix and it still didn't work though. I am looking into it. 

        const payload = JSON.stringify({ text: message.content });

        try {
            const response = await fetch(DEEPGRAM_URL, {
                method: "POST",
                headers: {
                    Authorization: `Token ${DEEPGRAM_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: payload,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            const audio = new Audio(audioUrl);
            audio.play();

            audio.onended = () => {
                isSpeakingRef.current = false;
                onMessageSpoken(message.content);
                setQueue(prevQueue => prevQueue.slice(1));
            }

        } catch (error) {
            console.error("Error:", error);
            setError(error.message);
            isSpeakingRef.current = false;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {isLoading && <p>Converting to speech...</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default TTS;


