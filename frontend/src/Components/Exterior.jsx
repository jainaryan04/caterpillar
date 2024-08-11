import React, { useState, useEffect } from 'react';
import useSpeechToText from '../Hooks/useSpeechToText';
import { useNavigate } from 'react-router-dom';

const Exterior = () => {
  
  const [currentField, setCurrentField] = useState(0);
  const [formData, setFormData] = useState({
    exteriorDamage: '',
    oilLeakSuspension: '',
    exteriorSummary: ''
  });

  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechToText({ continuous: true });
  const navigate = useNavigate();

  useEffect(() => {
    if (isListening && transcript.toLowerCase().includes('record')) {
      moveToNextField();
    }
  }, [transcript, isListening]);

  const moveToNextField = () => {
    const cleanedTranscript = transcript.replace(/record/gi, '').trim().toLowerCase();
    const fields = Object.keys(formData);
    const currentFieldKey = fields[currentField];

    if (!cleanedTranscript) {
      console.log('Transcript is empty or not recognized.');
      return;
    }

    if (currentFieldKey === 'exteriorDamage' || currentFieldKey === 'oilLeakSuspension') {
      let value;
      if (cleanedTranscript.includes('yes')) {
        value = 'Yes';
      } else if (cleanedTranscript.includes('no')) {
        value = 'No';
      }

      if (value) {
        setFormData(prevFormData => ({
          ...prevFormData,
          [currentFieldKey]: value
        }));
        setCurrentField(prevField => prevField + 1);
        resetTranscript(); 
      } else {
        console.log('Condition value not recognized or empty');
      }
    } else {
      if (cleanedTranscript) {
        setFormData(prevFormData => ({
          ...prevFormData,
          [currentFieldKey]: cleanedTranscript,
        }));
        setCurrentField(prevField => prevField + 1);
        resetTranscript(); 
      } else {
        console.log('Transcript not recognized for text input');
      }
    }

    checkIfFormComplete(formData, currentField + 1, fields.length);
  };

  const handleStartStop = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const checkIfFormComplete = (updatedData, currentIndex, totalFields) => {
    const allFieldsFilled = Object.values(updatedData).every(value => value !== '');
    if (currentIndex === totalFields) {
      console.log("Form completed successfully");
      sendDataToBackend(updatedData);
    } else {
      console.log("Form is not complete yet");
    }
  };

  const sendDataToBackend = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/exterior', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Data successfully sent to the backend:', responseData);
        navigate('/brake'); 
      } else {
        console.error('Failed to send data to the backend:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while sending data to the backend:', error);
    }
  };

  return (
    <div className="bg-yellow-400 p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">EXTERIOR</h1>
      <form>
        <label>Rust, Dent or Damage to Exterior:</label><br />
        <input
          type="radio"
          name="exteriorDamage"
          value="Yes"
          checked={formData.exteriorDamage === 'Yes'}
          disabled={currentField !== 0}
          onChange={(e) => setFormData({ ...formData, exteriorDamage: e.target.value })}
        /> Yes<br />
        <input
          type="radio"
          name="exteriorDamage"
          value="No"
          checked={formData.exteriorDamage === 'No'}
          disabled={currentField !== 0}
          onChange={(e) => setFormData({ ...formData, exteriorDamage: e.target.value })}
        /> No<br />

        <label>Oil leak in Suspension:</label><br />
        <input
          type="radio"
          name="oilLeakSuspension"
          value="Yes"
          checked={formData.oilLeakSuspension === 'Yes'}
          disabled={currentField !== 1}
          onChange={(e) => setFormData({ ...formData, oilLeakSuspension: e.target.value })}
        /> Yes<br />
        <input
          type="radio"
          name="oilLeakSuspension"
          value="No"
          checked={formData.oilLeakSuspension === 'No'}
          disabled={currentField !== 1}
          onChange={(e) => setFormData({ ...formData, oilLeakSuspension: e.target.value })}
        /> No<br />

        <textarea
          placeholder="Exterior Overall Summary (<1000 characters)"
          value={formData.exteriorSummary}
          disabled={currentField !== 2}
          onChange={(e) => setFormData({ ...formData, exteriorSummary: e.target.value })}
          rows={5}
        /><br />
      </form>
      <button
        onClick={handleStartStop}
        style={{
          padding: '10px 20px',
          backgroundColor: isListening ? '#FF6347' : '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
        }}>
        {isListening ? 'Stop Listening' : 'Start Speaking'}
      </button>
    </div>
  );
};

export default Exterior;
