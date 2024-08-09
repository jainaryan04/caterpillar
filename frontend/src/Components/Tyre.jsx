import React, { useState, useEffect } from 'react';
import useSpeechToText from '../Hooks/useSpeechToText';

const Tyre = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [currentField, setCurrentField] = useState(0);
  const [formData, setFormData] = useState({
    pressltft: '',
    pressrtft: '',
    pressltrr: '',
    pressrtrr: '',
    condltft: '',
    condrtft: '',
    condltrr: '',
    condrtrr: '',
    summary: '',
  });

  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechToText({ continuous: true });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isListening && transcript.toLowerCase().includes('okay')) {
      moveToNextField();
    }
  }, [transcript]);

  const moveToNextField = () => {
    const cleanedTranscript = transcript.replace(/okay/gi, '').trim().toLowerCase();
    const fields = Object.keys(formData);
    const currentFieldKey = fields[currentField];

    if (currentFieldKey.includes('cond')) {
      // Handle radio button field (Tire condition)
      let conditionValue;
      if (cleanedTranscript.includes('good')) {
        conditionValue = 'Good';
      } else if (cleanedTranscript.includes('ok')) {
        conditionValue = 'Ok';
      } else if (cleanedTranscript.includes('needs replacement')) {
        conditionValue = 'Needs Replacement';
      }

      if (conditionValue) {
        setFormData({ ...formData, [currentFieldKey]: conditionValue });
        setCurrentField((prevField) => (prevField + 1) % fields.length);
      }
    } else {
      // Handle text input field (Tire pressure)
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
          checked={formData.condltft === 'Good'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> Good<br />
        <input
          type="radio"
          name="condrtft"
          value="Ok"
          checked={formData.condrtft === 'Ok'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> Ok<br />
        <input
          type="radio"
          name="condrtft"
          value="Needs Replacement"
          checked={formData.condrtft === 'Needs Replacement'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> Needs Replacement<br />

<label>Tire Condition for Left Rear:</label><br />
        <input
          type="radio"
          name="condltrr"
          value="Good"
          checked={formData.condltft === 'Good'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> Good<br />
        <input
          type="radio"
          name="condltrr"
          value="Ok"
          checked={formData.condltrr === 'Ok'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> Ok<br />
        <input
          type="radio"
          name="condltrr"
          value="Needs Replacement"
          checked={formData.condltrr === 'Needs Replacement'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> Needs Replacement<br />

<label>Tire Condition for Right Rear:</label><br />
        <input
          type="radio"
          name="condrtrr"
          value="Good"
          checked={formData.condrtrr === 'Good'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> Good<br />
        <input
          type="radio"
          name="condrtrr"
          value="Ok"
          checked={formData.condrtrr === 'Ok'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> Ok<br />
        <input
          type="radio"
          name="condrtrr"
          value="Needs Replacement"
          checked={formData.condrtrr === 'Needs Replacement'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> Needs Replacement<br />

<label>Tire Condition for Left Rear:</label><br />
        <input
          type="radio"
          name="condrtrr"
          value="Good"
          checked={formData.condrtrr === 'Good'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> Good<br />
        <input
          type="radio"
          name="condrtrr"
          value="Ok"
          checked={formData.condrtrr === 'Ok'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> Ok<br />
        <input
          type="radio"
          name="condrtrr"
          value="Needs Replacement"
          checked={formData.condrtrr === 'Needs Replacement'}
          disabled={currentField !== 4}
          onChange={handleRadioChange}
        /> Needs Replacement<br />

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

export default Tyre;
