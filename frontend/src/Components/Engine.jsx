import React, { useState, useEffect } from 'react';
import useSpeechToText from '../Hooks/useSpeechToText';

const Engine = () => {
  const [currentField, setCurrentField] = useState(0);
  const [formData, setFormData] = useState({
    rustDamage: '',
    oilCondition: '',
    oilColor: '',
    fluidCondition: '',
    fluidColor: '',
    oilLeak: '',
    summary: '',
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

    if (currentFieldKey.includes('Condition') || currentFieldKey.includes('Leak')) {
      let conditionValue;
      if (cleanedTranscript.includes('good')) {
        conditionValue = 'Good';
      } else if (cleanedTranscript.includes('bad')) {
        conditionValue = 'Bad';
      } else if (cleanedTranscript.includes('yes')) {
        conditionValue = 'Yes';
      } else if (cleanedTranscript.includes('no')) {
        conditionValue = 'No';
      }

      if (conditionValue) {
        setFormData({ ...formData, [currentFieldKey]: conditionValue });
        setCurrentField((prevField) => (prevField + 1) % fields.length);
      }
    } else if (currentFieldKey.includes('Color')) {
      let colorValue;
      if (cleanedTranscript.includes('clean')) {
        colorValue = 'Clean';
      } else if (cleanedTranscript.includes('brown')) {
        colorValue = 'Brown';
      } else if (cleanedTranscript.includes('black')) {
        colorValue = 'Black';
      }

      if (colorValue) {
        setFormData({ ...formData, [currentFieldKey]: colorValue });
        setCurrentField((prevField) => (prevField + 1) % fields.length);
      }
    } else {
      if (cleanedTranscript) {
        setFormData({ ...formData, [currentFieldKey]: cleanedTranscript });
        setCurrentField((prevField) => (prevField + 1) % fields.length);
      }
    }
    resetTranscript();
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
      const response = await fetch('http://localhost:5000/api/engine', {
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
        <label>Rust, Dents or Damage in Engine:</label><br />
        <input
          type="radio"
          name="rustDamage"
          value="Yes"
          checked={formData.rustDamage === 'Yes'}
          disabled={currentField !== 0}
          onChange={handleRadioChange}
        /> Yes<br />
        <input
          type="radio"
          name="rustDamage"
          value="No"
          checked={formData.rustDamage === 'No'}
          disabled={currentField !== 0}
          onChange={handleRadioChange}
        /> No<br />

        <label>Engine Oil Condition:</label><br />
        <input
          type="radio"
          name="oilCondition"
          value="Good"
          checked={formData.oilCondition === 'Good'}
          disabled={currentField !== 1}
          onChange={handleRadioChange}
        /> Good<br />
        <input
          type="radio"
          name="oilCondition"
          value="Bad"
          checked={formData.oilCondition === 'Bad'}
          disabled={currentField !== 1}
          onChange={handleRadioChange}
        /> Bad<br />

        <label>Engine Oil Color:</label><br />
        <input
          type="radio"
          name="oilColor"
          value="Clean"
          checked={formData.oilColor === 'Clean'}
          disabled={currentField !== 2}
          onChange={handleRadioChange}
        /> Clean<br />
        <input
          type="radio"
          name="oilColor"
          value="Brown"
          checked={formData.oilColor === 'Brown'}
          disabled={currentField !== 2}
          onChange={handleRadioChange}
        /> Brown<br />
        <input
          type="radio"
          name="oilColor"
          value="Black"
          checked={formData.oilColor === 'Black'}
          disabled={currentField !== 2}
          onChange={handleRadioChange}
        /> Black<br />

        <label>Brake Fluid Condition:</label><br />
        <input
          type="radio"
          name="fluidCondition"
          value="Good"
          checked={formData.fluidCondition === 'Good'}
          disabled={currentField !== 3}
          onChange={handleRadioChange}
        /> Good<br />
        <input
          type="radio"
          name="fluidCondition"
          value="Bad"
          checked={formData.fluidCondition === 'Bad'}
          disabled={currentField !== 3}
          onChange={handleRadioChange}
        /> Bad<br />

        <label>Brake Fluid Color:</label><br />
        <input
          type="radio"
          name="fluidColor"
          value="Clean"
          checked={formData.fluidColor === 'Clean'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> Clean<br />
        <input
          type="radio"
          name="fluidColor"
          value="Brown"
          checked={formData.fluidColor === 'Brown'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> Brown<br />
        <input
          type="radio"
          name="fluidColor"
          value="Black"
          checked={formData.fluidColor === 'Black'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> Black<br />

        <label>Any Oil Leak in Engine:</label><br />
        <input
          type="radio"
          name="oilLeak"
          value="Yes"
          checked={formData.oilLeak === 'Yes'}
          disabled={currentField !== 5}
          onChange={handleRadioChange}
        /> Yes<br />
        <input
          type="radio"
          name="oilLeak"
          value="No"
          checked={formData.oilLeak === 'No'}
          disabled={currentField !== 5}
          onChange={handleRadioChange}
        /> No<br />

        <textarea
          placeholder="Overall Summary"
          value={formData.summary}
          disabled={currentField !== 6}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          rows={3}
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

export default Engine;
