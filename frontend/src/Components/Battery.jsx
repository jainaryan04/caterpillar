import React, { useState, useEffect } from 'react';
import useSpeechToText from '../Hooks/useSpeechToText';

const Battery = () => {
  const [currentField, setCurrentField] = useState(0);
  const [formData, setFormData] = useState({
    batteryMake: '',
    batteryReplacementDate: '',
    batteryVoltage: '',
    batteryWaterLevel: '',
    batteryCondition: '',
    batteryLeak: '',
    batterySummary: ''
  });

  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechToText({ continuous: true });

  useEffect(() => {
    if (isListening && transcript.toLowerCase().includes('okay')) {
      moveToNextField();
    }
  }, [transcript]);

  const moveToNextField = () => {
    const cleanedTranscript = transcript.replace(/okay/gi, '').trim().toLowerCase();
    const fields = Object.keys(formData);
    const currentFieldKey = fields[currentField];

    if (currentFieldKey.includes('batteryWaterLevel') || currentFieldKey.includes('batteryCondition') || currentFieldKey.includes('batteryLeak')) {
      // Handle radio button fields
      let value;
      if (cleanedTranscript.includes('good')) {
        value = 'Good';
      } else if (cleanedTranscript.includes('ok')) {
        value = 'Ok';
      } else if (cleanedTranscript.includes('low')) {
        value = 'Low';
      } else if (cleanedTranscript.includes('yes')) {
        value = 'Yes';
      } else if (cleanedTranscript.includes('no')) {
        value = 'No';
      }

      if (value) {
        setFormData({ ...formData, [currentFieldKey]: value });
        setCurrentField((prevField) => (prevField + 1) % fields.length);
      }
    } else {
      // Handle text input fields
      if (cleanedTranscript) {
        setFormData({ ...formData, [currentFieldKey]: cleanedTranscript });
        setCurrentField((prevField) => (prevField + 1) % fields.length);
      }
    }
    resetTranscript(); // Clear the transcript after processing
  };

  const handleStartStop = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const checkIfFormComplete = (updatedData, nextFieldIndex, totalFields) => {
    const allFieldsFilled = Object.values(updatedData).every(value => value !== '');
    if (allFieldsFilled) {
      sendDataToBackend(updatedData);
    }
  };

  const sendDataToBackend = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/battery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('Data successfully sent to the backend:', responseData);
        // Optionally, you can reset the form or provide user feedback here
      } else {
        console.error('Failed to send data to the backend:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while sending data to the backend:', error);
    }
  };

  return (
    <div>
      <form>
        <textarea
          placeholder="Battery Make (e.g., CAT, ABC, XYZ)"
          value={formData.batteryMake}
          disabled={currentField !== 0}
          onChange={(e) => setFormData({ ...formData, batteryMake: e.target.value })}
          rows={3}
        /><br />
        <textarea
          placeholder="Battery Replacement Date"
          value={formData.batteryReplacementDate}
          disabled={currentField !== 1}
          onChange={(e) => setFormData({ ...formData, batteryReplacementDate: e.target.value })}
          rows={3}
        /><br />
        <textarea
          placeholder="Battery Voltage (e.g., 12V, 13V)"
          value={formData.batteryVoltage}
          disabled={currentField !== 2}
          onChange={(e) => setFormData({ ...formData, batteryVoltage: e.target.value })}
          rows={3}
        /><br />

        <label>Battery Water Level:</label><br />
        <input
          type="radio"
          name="batteryWaterLevel"
          value="Good"
          checked={formData.batteryWaterLevel === 'Good'}
          disabled={currentField !== 3}
          onChange={handleRadioChange}
        /> Good<br />
        <input
          type="radio"
          name="batteryWaterLevel"
          value="Ok"
          checked={formData.batteryWaterLevel === 'Ok'}
          disabled={currentField !== 3}
          onChange={handleRadioChange}
        /> Ok<br />
        <input
          type="radio"
          name="batteryWaterLevel"
          value="Low"
          checked={formData.batteryWaterLevel === 'Low'}
          disabled={currentField !== 3}
          onChange={handleRadioChange}
        /> Low<br />

        <label>Condition of Battery (Any damage):</label><br />
        <input
          type="radio"
          name="batteryCondition"
          value="Yes"
          checked={formData.batteryCondition === 'Yes'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> Yes<br />
        <input
          type="radio"
          name="batteryCondition"
          value="No"
          checked={formData.batteryCondition === 'No'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> No<br />

        <label>Any Leak / Rust in Battery:</label><br />
        <input
          type="radio"
          name="batteryLeak"
          value="Yes"
          checked={formData.batteryLeak === 'Yes'}
          disabled={currentField !== 5}
          onChange={handleRadioChange}
        /> Yes<br />
        <input
          type="radio"
          name="batteryLeak"
          value="No"
          checked={formData.batteryLeak === 'No'}
          disabled={currentField !== 5}
          onChange={handleRadioChange}
        /> No<br />

        <textarea
          placeholder="Battery Overall Summary (<1000 characters)"
          value={formData.batterySummary}
          disabled={currentField !== 6}
          onChange={(e) => setFormData({ ...formData, batterySummary: e.target.value })}
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

export default Battery;
