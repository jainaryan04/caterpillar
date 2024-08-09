import React, { useState } from "react";
import useSpeechToText from "../Hooks/useSpeechToText";

const Home = () => {
    const [textInput, setTextInput] = useState('');
    const { isListening, transcript, startListening, stopListening } = useSpeechToText({ continuous: true });

    const startStopListening = () => {
        if (isListening) {
            stopVoiceInput();
        } else {
            startListening();
        }
    };

    const stopVoiceInput = () => {
        setTextInput(prevVal => prevVal + (transcript.length ? (prevVal.length ? ' ' : '') + transcript : ''));
        stopListening();
        logTextToBackend(textInput + (transcript.length ? ' ' + transcript : ''));
    };

    const logTextToBackend = async (finalText) => {
        try {
            const response = await fetch('http://localhost:5000/log', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: finalText }),
            });
            if (!response.ok) {
                throw new Error('Failed to log text');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <button 
                onClick={startStopListening}
                style={{
                    padding: '10px 20px',
                    backgroundColor: isListening ? '#FF6347' : '#4CAF50',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                }}>
                {isListening ? 'Stop Listening' : 'Speak'}
            </button>
            <textarea
                style={{
                    width: '100%',
                    height: '150px',
                    padding: '10px',
                    fontSize: '16px',
                    border: isListening ? '2px solid #FF6347' : '2px solid #4CAF50',
                    borderRadius: '5px',
                    resize: 'none',
                }}
                disabled={isListening}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
            />
        </div>
    );
};

export default Home;
