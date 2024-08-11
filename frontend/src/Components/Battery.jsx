import React, { useState, useEffect } from 'react';
import useSpeechToText from '../Hooks/useSpeechToText';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  useEffect(() => {
    if (isListening && transcript.toLowerCase().includes('record')) {
      moveToNextField();
    }
  }, [transcript, isListening]);

  const moveToNextField = () => {
    const cleanedTranscript = transcript ? transcript.replace(/record/gi, '').trim().toLowerCase() : '';
    if (!cleanedTranscript) {
      console.log('Transcript is empty or not recognized.');
      return;
    }

    const fields = Object.keys(formData);
    const currentFieldKey = fields[currentField];

    if (currentFieldKey.includes('batteryWaterLevel') || currentFieldKey.includes('batteryCondition') || currentFieldKey.includes('batteryLeak')) {
      let conditionValue = '';

      if (cleanedTranscript.includes('good') || cleanedTranscript.includes('1') || cleanedTranscript.includes('one')) {
        conditionValue = 'Good';
      } else if (cleanedTranscript.includes('ok') || cleanedTranscript.includes('okay') || cleanedTranscript.includes('2') || cleanedTranscript.includes('to') || cleanedTranscript.includes('two')) {
        conditionValue = 'Ok';
      } else if (cleanedTranscript.includes('low') || cleanedTranscript.includes('3') || cleanedTranscript.includes('three')) {
        conditionValue = 'Low';
      } else if (cleanedTranscript.includes('yes')) {
        conditionValue = 'Yes';
      } else if (cleanedTranscript.includes('no')) {
        conditionValue = 'No';
      }

      if (conditionValue) {
        handleRadioChange({
          target: {
            name: currentFieldKey,
            value: conditionValue
          }
        });
        resetTranscript(); 
      } else {
        console.log('Condition value not recognized or empty');
      }
    } else {
      if (cleanedTranscript) {
        setFormData(prevFormData => {
          const updatedData = {
            ...prevFormData,
            [currentFieldKey]: cleanedTranscript,
          };
          return updatedData;
        });
        setCurrentField(prevField => prevField + 1);
        resetTranscript();
      } else {
        console.log('Transcript not recognized for text input');
      }
    }

    checkIfFormComplete(currentField);
  };

  const checkIfFormComplete = (prev) => {
    const allFieldsFilled = Object.values(formData).every(value => value !== '');
    if (prev === 6) { 
      sendDataToBackend(formData);
    } else {
      console.log('Form is not complete');
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
        navigate('/exterior');
      } else {
        console.error('Failed to send data to the backend:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while sending data to the backend:', error);
    }
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
    setFormData(prevFormData => {
      const updatedData = { ...prevFormData, [name]: value };
      return updatedData;
    });
    setCurrentField(prevField => prevField + 1);
    checkIfFormComplete(currentField);
  };

  return (
    <div className="bg-yellow-400 p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">BATTERY</h1>
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
