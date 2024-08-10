import React, { useState, useEffect } from 'react';
import useSpeechToText from '../Hooks/useSpeechToText';
import { useNavigate } from 'react-router-dom';

const Tyre = ({ onFormFilled }) => {
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [currentField, setCurrentField] = useState(0);
  const [formData, setFormData] = useState({
    pressltft: '',
    pressrtft: '',
    pressrtrr: '',
    pressltrr: '',
    condltft: '',
    condrtft: '',
    condltrr: '',
    condrtrr: '',
  });

  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechToText({ continuous: true });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

    if (currentFieldKey.includes('cond')) {
      let conditionValue = '';

      if (cleanedTranscript.includes('good') || cleanedTranscript.includes('1') || cleanedTranscript.includes('one')) {
        conditionValue = 'Good';
      } else if (cleanedTranscript.includes('ok') || cleanedTranscript.includes('okay') || cleanedTranscript.includes('2') || cleanedTranscript.includes('two')) {
        conditionValue = 'Ok';
      } else if (cleanedTranscript.includes('replacement') || cleanedTranscript.includes('3') || cleanedTranscript.includes('three')) {
        conditionValue = 'Needs Replacement';
      }

      if (conditionValue) {
        handleRadioChange({
          target: {
            name: currentFieldKey,
            value: conditionValue
          }
        });
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
      } else {
        console.log('Transcript not recognized for text input');
      }
    }

    resetTranscript(); // Clear the transcript after processing
    checkIfFormComplete();
  };

  const checkIfFormComplete = () => {
    const allFieldsFilled = Object.values(formData).every(value => value !== '');
    if (allFieldsFilled) {
      sendDataToBackend(formData);
      onFormFilled(); // Notify that form is filled
    }
  };

  const sendDataToBackend = async (data) => {
    try {
      const response = await fetch('http://localhost:5000/api/tyre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Data successfully sent to the backend:', responseData);
        navigate('/battery'); // Navigate to the next component
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
    checkIfFormComplete();
  };

  return (
    <div>
      <form>
        <textarea
          placeholder="Pressure for Left Front"
          value={formData.pressltft}
          disabled={currentField !== 0}
          onChange={(e) => setFormData({ ...formData, pressltft: e.target.value })}
          rows={3}
        /><br />
        <textarea
          placeholder="Pressure for Right Front"
          value={formData.pressrtft}
          disabled={currentField !== 1}
          onChange={(e) => setFormData({ ...formData, pressrtft: e.target.value })}
          rows={3}
        /><br />
        <textarea
          placeholder="Pressure for Right Rear"
          value={formData.pressrtrr}
          disabled={currentField !== 2}
          onChange={(e) => setFormData({ ...formData, pressrtrr: e.target.value })}
          rows={3}
        /><br />
        <textarea
          placeholder="Pressure for Left Rear"
          value={formData.pressltrr}
          disabled={currentField !== 3}
          onChange={(e) => setFormData({ ...formData, pressltrr: e.target.value })}
          rows={3}
        /><br />

        <label>Tire Condition for Left Front:</label><br />
        <input
          type="radio"
          name="condltft"
          value="Good"
          checked={formData.condltft === 'Good'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> Good<br />
        <input
          type="radio"
          name="condltft"
          value="Ok"
          checked={formData.condltft === 'Ok'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> Ok<br />
        <input
          type="radio"
          name="condltft"
          value="Needs Replacement"
          checked={formData.condltft === 'Needs Replacement'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> Needs Replacement<br />

        <label>Tire Condition for Right Front:</label><br />
        <input
          type="radio"
          name="condrtft"
          value="Good"
          checked={formData.condrtft === 'Good'}
          disabled={currentField !== 5}
          onChange={handleRadioChange}
        /> Good<br />
        <input
          type="radio"
          name="condrtft"
          value="Ok"
          checked={formData.condrtft === 'Ok'}
          disabled={currentField !== 5}
          onChange={handleRadioChange}
        /> Ok<br />
        <input
          type="radio"
          name="condrtft"
          value="Needs Replacement"
          checked={formData.condrtft === 'Needs Replacement'}
          disabled={currentField !== 5}
          onChange={handleRadioChange}
        /> Needs Replacement<br />

        <label>Tire Condition for Left Rear:</label><br />
        <input
          type="radio"
          name="condltrr"
          value="Good"
          checked={formData.condltrr === 'Good'}
          disabled={currentField !== 6}
          onChange={handleRadioChange}
        /> Good<br />
        <input
          type="radio"
          name="condltrr"
          value="Ok"
          checked={formData.condltrr === 'Ok'}
          disabled={currentField !== 6}
          onChange={handleRadioChange}
        /> Ok<br />
        <input
          type="radio"
          name="condltrr"
          value="Needs Replacement"
          checked={formData.condltrr === 'Needs Replacement'}
          disabled={currentField !== 6}
          onChange={handleRadioChange}
        /> Needs Replacement<br />

        <label>Tire Condition for Right Rear:</label><br />
        <input
          type="radio"
          name="condrtrr"
          value="Good"
          checked={formData.condrtrr === 'Good'}
          disabled={currentField !== 7}
          onChange={handleRadioChange}
        /> Good<br />
        <input
          type="radio"
          name="condrtrr"
          value="Ok"
          checked={formData.condrtrr === 'Ok'}
          disabled={currentField !== 7}
          onChange={handleRadioChange}
        /> Ok<br />
        <input
          type="radio"
          name="condrtrr"
          value="Needs Replacement"
          checked={formData.condrtrr === 'Needs Replacement'}
          disabled={currentField !== 7}
          onChange={handleRadioChange}
        /> Needs Replacement<br />
      </form>

      <button onClick={handleStartStop}>
        {isListening ? 'Stop Listening' : 'Start Speaking'}
      </button>
    </div>
  );
};

export default Tyre;
