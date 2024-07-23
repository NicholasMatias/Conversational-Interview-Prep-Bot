import React, { useEffect, useState, useRef } from 'react';
import './TTS.css'

const TTS = ({ messages, onMessageSpoken, onSpeakingStart }) => {
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
        if (isSpeakingRef.current || message.content == "quit") return;
        isSpeakingRef.current = true;
        setIsLoading(true);
        setError(null);
        onSpeakingStart();

        const DEEPGRAM_URL = import.meta.env.VITE_DEEPGRAM_URL;

        const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY;

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
            {isLoading &&<div className='loading-container'><h3 className='loading-message'>Converting to speech</h3> <div class="loader"></div></div>

            }
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default TTS;


