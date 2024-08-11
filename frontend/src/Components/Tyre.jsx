import React, { useState, useEffect } from 'react';
import useSpeechToText from '../Hooks/useSpeechToText';
import { useNavigate } from 'react-router-dom';
import "../index.css"

const Tyre = () => {
  const navigate = useNavigate();
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
  
    let fieldValue = '';
    if (currentFieldKey.includes('cond')) {
      if (cleanedTranscript.includes('good') || cleanedTranscript.includes('1')) {
        fieldValue = 'Good';
      } else if (cleanedTranscript.includes('ok') || cleanedTranscript.includes('2')) {
        fieldValue = 'Ok';
      } else if (cleanedTranscript.includes('replacement') || cleanedTranscript.includes('3')) {
        fieldValue = 'Needs Replacement';
      }
    } else {
      fieldValue = cleanedTranscript;
    }
  
    if (fieldValue) {
      setFormData(prevFormData => ({
        ...prevFormData,
        [currentFieldKey]: fieldValue,
      }));
      setCurrentField(prevField => {
        const newField = prevField + 1;
        checkIfFormComplete();
        return newField;
      });
    }
  
    resetTranscript();
  };
  

  const checkIfFormComplete = () => {
    if (Object.values(formData).every(field => field.trim() !== '') && currentField === 8) {
      sendDataToBackend(formData);
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
        navigate('/battery');
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
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
    setCurrentField(prevField => prevField + 1);
  };

  useEffect(() => {
    checkIfFormComplete();
  }, [currentField, formData]);

  return (
    <div className="bg-yellow-400 p-8 rounded-lg shadow-md h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">TYRES</h1>
      <form>
      <div className="flex gap-4 justify-center">
        <textarea
        className="inline mb-2 text-gray-700 font-bold w-[30vw]"
          placeholder="Pressure for Left Front"
          value={formData.pressltft}
          disabled={currentField !== 0}
          onChange={(e) => setFormData({ ...formData, pressltft: e.target.value })}
          rows={3}
        /><br />
        <textarea
          placeholder="Pressure for Right Front"
          className="inline mb-2 text-gray-700 font-bold w-[30vw]"
          value={formData.pressrtft}
          disabled={currentField !== 1}
          onChange={(e) => setFormData({ ...formData, pressrtft: e.target.value })}
          rows={3}
        /><br />
      </div>
      <div className="flex gap-4 justify-center">
        <textarea
          placeholder="Pressure for Right Rear"
          className="inline mb-2 text-gray-700 font-bold w-[30vw]"
          value={formData.pressrtrr}
          disabled={currentField !== 2}
          onChange={(e) => setFormData({ ...formData, pressrtrr: e.target.value })}
          rows={3}
        /><br />
        <textarea
        className="inline mb-2 text-gray-700 font-bold w-[30vw]"
          placeholder="Pressure for Left Rear"
          value={formData.pressltrr}
          disabled={currentField !== 3}
          onChange={(e) => setFormData({ ...formData, pressltrr: e.target.value })}
          rows={3}
        /><br />
        </div>
        
      <div className=" gap-4 justify-center">
        <div className=''>
        <div className="flex">
        <label>Tire Condition for Left Front:</label><br />
        <input
          type="radio"
          name="condltft"
          value="Good"
          checked={formData.condltft === 'Good'}
          disabled={currentField !== 4}
          className=""
          onChange={handleRadioChange}
        /> Good
        <br />

        <input
        className=""
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
        </div>
        <div className="flex">

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
        </div>
        </div>
        <div className="flex">
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
        </div>
        </div>
        <div className="flex">
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
        </div>
      </form>

      <button onClick={handleStartStop}>
        {isListening ? 'Stop Listening' : 'Start Speaking'}
      </button>
    </div>
  );
};

export default Tyre;
