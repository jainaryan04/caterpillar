import { useState, useEffect, useRef } from 'react';

const useSpeechToText = (options = {}) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            console.error("Web Speech API is not supported in this browser.");
            return;
        }

        recognitionRef.current = new window.webkitSpeechRecognition();
        const recognition = recognitionRef.current;

        recognition.interimResults = options.interimResults || true;
        recognition.lang = options.lang || "en-US";
        recognition.continuous = options.continuous || false;

        recognition.onresult = (event) => {
            let interimTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                interimTranscript += event.results[i][0].transcript;
            }
            setTranscript(prevTranscript => prevTranscript + interimTranscript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        return () => {
            recognition.stop();
        };
    }, [options.interimResults, options.lang, options.continuous]);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
            setTranscript("");  // Reset transcript when starting listening
            setIsListening(true);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const resetTranscript = () => {
        setTranscript("");  // Manually reset the transcript
    };

    return {
        isListening,
        transcript,
        startListening,
        stopListening,
        resetTranscript,
    };
};

export default useSpeechToText;
