import { Spinner } from '@chakra-ui/react'
import React, { useEffect, useState, useRef } from 'react';

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
            {isLoading && <h3>Converting to speech 
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xs'
                />
            </h3>

            }
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default TTS;


