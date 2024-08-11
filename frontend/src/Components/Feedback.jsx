import React, { useState, useEffect } from 'react';
import useSpeechToText from '../Hooks/useSpeechToText';
import { useNavigate } from 'react-router-dom';

const VoiceFeedback = () => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState('');
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechToText({ continuous: true });

  useEffect(() => {
    if (transcript) {
      const processedTranscript = transcript.replace(/record/gi, '').trim().toLowerCase();
      
      console.log('Original Transcript:', transcript); // Debugging
      console.log('Processed Transcript:', processedTranscript); // Debugging

      if (processedTranscript) {
        setFeedback(processedTranscript);

        if (transcript.toLowerCase().includes('record')) {
          handleSubmit(processedTranscript);
        }
      }
    }
  }, [transcript]);

  const handleSubmit = async (processedTranscript) => {
    try {
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback: processedTranscript }),
      });
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('Feedback successfully sent to the backend:', responseData);
        navigate('/pdf');
      } else {
        console.error('Failed to send feedback to the backend:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while sending feedback to the backend:', error);
    }
    resetTranscript(); // Clear the transcript after submission
  };

  return (
    <div className="bg-blue-100 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-4">Give Feedback</h1>
      <p className="text-center mb-4">Press the button below and start speaking to provide feedback.</p>
      <button
        onClick={() => (isListening ? stopListening() : startListening())}
        style={{
          padding: '10px 20px',
          backgroundColor: isListening ? '#FF6347' : '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {isListening ? 'Stop Listening' : 'Start Speaking'}
      </button>
      {feedback && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Your Feedback:</h2>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceFeedback;
