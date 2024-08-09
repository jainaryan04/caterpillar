import React, { useState, useEffect } from "react";
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
    };

    return (
        <div>
            <button onClick={startStopListening}>
                {isListening ? 'Stop Listening' : 'Speak'}
            </button>
            <textarea
                style={{
                    width: '100%',
                    height: '150px',
                    
                }}
                disabled={isListening}
                value={isListening ? textInput + (transcript.length ? ' ' + transcript : '') : textInput}
                onChange={(e) => setTextInput(e.target.value)}
            />
        </div>
    );
};

export default Home;
