import React, { useState, useEffect } from 'react';
import useSpeechToText from '../Hooks/useSpeechToText';
import { useNavigate } from 'react-router-dom';

const Brakes = () => {
  const navigate=useNavigate();
  const [currentField, setCurrentField] = useState(0);
  const [formData, setFormData] = useState({
    brakeFluidLevel: '',
    brakeConditionFront: '',
    brakeConditionRear: '',
    emergencyBrake: '',
    brakeSummary: ''
  });

  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechToText({ continuous: true });

  useEffect(() => {
    if (isListening && transcript.toLowerCase().includes('record')) {
      console.log('Detected "okay" in transcript');
      moveToNextField();
    }
  }, [transcript]);

  const moveToNextField = () => {
    const cleanedTranscript = transcript.replace(/record/gi, '').trim().toLowerCase();
    const fields = Object.keys(formData);
    const currentFieldKey = fields[currentField];

    console.log(`Processing field: ${currentFieldKey}, transcript: ${cleanedTranscript}`);

    let value;
    if (['brakeFluidLevel', 'brakeConditionFront', 'brakeConditionRear', 'emergencyBrake'].includes(currentFieldKey)) {
      
      if (cleanedTranscript.includes('good')) {
        value = 'Good';
      } else if (cleanedTranscript.includes('ok')) {
        value = 'Ok';
      } else if (cleanedTranscript.includes('low')) {
        value = 'Low';
      } else if (cleanedTranscript.includes('replacement')) {
        value = 'Needs Replacement';
      }

      if (value) {
        console.log(`Setting ${currentFieldKey} to ${value}`);
        setFormData((prevData) => {
          const updatedData = { ...prevData, [currentFieldKey]: value };
          const nextFieldIndex = (currentField + 1) % fields.length;
          checkIfFormComplete(updatedData, nextFieldIndex, fields.length);
          return updatedData;
        });
        setCurrentField((prevField) => (prevField + 1) % fields.length);
      }
    } else {
      
      if (cleanedTranscript) {
        console.log(`Setting ${currentFieldKey} to ${cleanedTranscript}`);
        setFormData((prevData) => {
          const updatedData = { ...prevData, [currentFieldKey]: cleanedTranscript };
          const nextFieldIndex = (currentField + 1) % fields.length;
          checkIfFormComplete(updatedData, nextFieldIndex, fields.length);
          return updatedData;
        });
        setCurrentField((prevField) => (prevField + 1) % fields.length);
      }
    }
    resetTranscript(); // Clear the transcript after processing
  };

  const handleStartStop = () => {
    if (!isListening) {
      console.log('Starting speech recognition');
      startListening();
    } else {
      console.log('Stopping speech recognition');
      stopListening();
    }
  };

  const checkIfFormComplete = (updatedData, nextFieldIndex, totalFields) => {
    const allFieldsFilled = Object.values(updatedData).every(value => value !== '');
    if (allFieldsFilled) {
      console.log('All fields filled. Sending data to the backend.');
      sendDataToBackend(updatedData);
    } else {
      console.log(`Field ${nextFieldIndex + 1} of ${totalFields} filled.`);
    }
  };

  const sendDataToBackend = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/brake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Data successfully sent to the backend:', responseData);
        navigate('/engine');
      } else {
        console.error('Failed to send data to the backend:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while sending data to the backend:', error);
    }
  };

  return (
    <div className="bg-yellow-400 p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">BRAKE</h1>
      <form>
        <label>Brake Fluid level:</label><br />
        <input
          type="radio"
          name="brakeFluidLevel"
          value="Good"
          checked={formData.brakeFluidLevel === 'Good'}
          disabled={currentField !== 0}
          onChange={(e) => setFormData({ ...formData, brakeFluidLevel: e.target.value })}
        /> Good<br />
        <input
          type="radio"
          name="brakeFluidLevel"
          value="Ok"
          checked={formData.brakeFluidLevel === 'Ok'}
          disabled={currentField !== 0}
          onChange={(e) => setFormData({ ...formData, brakeFluidLevel: e.target.value })}
        /> Ok<br />
        <input
          type="radio"
          name="brakeFluidLevel"
          value="Low"
          checked={formData.brakeFluidLevel === 'Low'}
          disabled={currentField !== 0}
          onChange={(e) => setFormData({ ...formData, brakeFluidLevel: e.target.value })}
        /> Low<br />

        <label>Brake Condition for Front:</label><br />
        <input
          type="radio"
          name="brakeConditionFront"
          value="Good"
          checked={formData.brakeConditionFront === 'Good'}
          disabled={currentField !== 1}
          onChange={(e) => setFormData({ ...formData, brakeConditionFront: e.target.value })}
        /> Good<br />
        <input
          type="radio"
          name="brakeConditionFront"
          value="Ok"
          checked={formData.brakeConditionFront === 'Ok'}
          disabled={currentField !== 1}
          onChange={(e) => setFormData({ ...formData, brakeConditionFront: e.target.value })}
        /> Ok<br />
        <input
          type="radio"
          name="brakeConditionFront"
          value="Needs Replacement"
          checked={formData.brakeConditionFront === 'Needs Replacement'}
          disabled={currentField !== 1}
          onChange={(e) => setFormData({ ...formData, brakeConditionFront: e.target.value })}
        /> Needs Replacement<br />

        <label>Brake Condition for Rear:</label><br />
        <input
          type="radio"
          name="brakeConditionRear"
          value="Good"
          checked={formData.brakeConditionRear === 'Good'}
          disabled={currentField !== 2}
          onChange={(e) => setFormData({ ...formData, brakeConditionRear: e.target.value })}
        /> Good<br />
        <input
          type="radio"
          name="brakeConditionRear"
          value="Ok"
          checked={formData.brakeConditionRear === 'Ok'}
          disabled={currentField !== 2}
          onChange={(e) => setFormData({ ...formData, brakeConditionRear: e.target.value })}
        /> Ok<br />
        <input
          type="radio"
          name="brakeConditionRear"
          value="Needs Replacement"
          checked={formData.brakeConditionRear === 'Needs Replacement'}
          disabled={currentField !== 2}
          onChange={(e) => setFormData({ ...formData, brakeConditionRear: e.target.value })}
        /> Needs Replacement<br />

        <label>Emergency Brake:</label><br />
        <input
          type="radio"
          name="emergencyBrake"
          value="Good"
          checked={formData.emergencyBrake === 'Good'}
          disabled={currentField !== 3}
          onChange={(e) => setFormData({ ...formData, emergencyBrake: e.target.value })}
        /> Good<br />
        <input
          type="radio"
          name="emergencyBrake"
          value="Ok"
          checked={formData.emergencyBrake === 'Ok'}
          disabled={currentField !== 3}
          onChange={(e) => setFormData({ ...formData, emergencyBrake: e.target.value })}
        /> Ok<br />
        <input
          type="radio"
          name="emergencyBrake"
          value="Low"
          checked={formData.emergencyBrake === 'Low'}
          disabled={currentField !== 3}
          onChange={(e) => setFormData({ ...formData, emergencyBrake: e.target.value })}
        /> Low<br />

        <textarea
          placeholder="Brake Overall Summary (<1000 characters)"
          value={formData.brakeSummary}
          disabled={currentField !== 4}
          onChange={(e) => setFormData({ ...formData, brakeSummary: e.target.value })}
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

export default Brakes;
