import React from 'react';
import { AudioRecorder } from 'react-audio-voice-recorder';
import { useState } from 'react';

const Record = ({onTranscriptionComplete, onTranscriptionStart}) => {

    const [isRecording, setIsRecording] = useState(false);

    const addAudioElement = async (blob) => {
        setIsRecording(true);
        onTranscriptionStart();
        // Prepare the blob data to send to the API
        const formData = new FormData();
        formData.append('file', blob, 'recording.mp4');

        // Make an API call to upload the audio file
        try {
            const response = await fetch('http://localhost:5000/transcribe', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload audio');
            }

            const result = await response.json();
            console.log('Audio uploaded successfully:', result);

            if(result){
                onTranscriptionComplete(result);
            }
        } catch (error) {
            console.error('Error uploading audio:', error);
        }
        finally{
            setIsRecording(false);
        }
    };

    return (
        <div>
            <AudioRecorder
                onRecordingComplete={addAudioElement}
                audioTrackConstraints={{
                    noiseSuppression: true,
                    echoCancellation: true,
                    
                }}
                downloadOnSavePress={false}
                downloadFileExtension="mp4"
                recordingBlob={false}
                showVisualizer={true}
            />
        </div>
    );
};

export default Record;
