import React, { useState, useEffect } from 'react';
import useSpeechToText from '../Hooks/useSpeechToText';
import { useNavigate } from 'react-router-dom';


const Header = ({onFormFilled}) => {
  const navigate=useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [currentField, setCurrentField] = useState(0);
  const [formData, setFormData] = useState({
    truckSerialNo: '',
    model: '',
    inspectorName: '',
    inspectionEmployeeID: '',
    location: '',
    serviceMeterHours: '',
    customerCompanyName: '',
    catCustomerID: '',
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


  const sendDataToBackend = async (data) => {
    console.log("Data to be sent to backend:", data); 
    console.log("in send function");
    try {
      const response = await fetch('http://localhost:5000/api/header', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Data successfully sent to the backend:', responseData);
        navigate('/tyre');
      } else {
        console.error('Failed to send data to the backend:', response.statusText);
      }
    } catch (error) {
      console.error('An error occurred while sending data to the backend:', error);
    }
  };
  

  const moveToNextField = () => {
    const cleanedTranscript = transcript ? transcript.replace(/record/gi, '').trim().toLowerCase() : '';
    
    console.log('Current Field:', currentField, 'Transcript:', cleanedTranscript);
    
    if (!cleanedTranscript) {
      console.log('Transcript is empty or not recognized.');
      return;
    }
    
    const fields = Object.keys(formData);
    const currentFieldKey = fields[currentField];
    
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
    
    checkIfFormComplete(currentField);
  };
  

  const checkIfFormComplete = (prev) => {
    console.log("in form complete function");
    const allFieldsFilled = Object.values(formData).every(value => value !== '');
    if (prev==7) {
      console.log("form completed");
      sendDataToBackend(formData);
      navigate('/tyre')
    } else {
      console.log("form is not complete");
    }
  };

  const handleStartStop = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  const [inspectionId, setInspectionId] = useState(null);

    useEffect(() => {
        const fetchInspectionId = async () => {
            try {
                const response = await fetch('http://localhost:5000/id');
                const data = await response.json();
                setInspectionId(data.index);
            } catch (error) {
                console.error('Error fetching inspection ID:', error);
            }
        };

        fetchInspectionId();
    }, []);


  return (
    <div className="bg-yellow-400 p-8 rounded-lg shadow-md h-screen">
      <h1 className="text-2xl font-bold text-center mb-6">HEADER</h1>
      <p>Inspection Id: {inspectionId}</p>
      <p>Date: {currentDateTime.toLocaleDateString()}</p>
        <p>Time: {currentDateTime.toLocaleTimeString()}</p>
      <form>
        <textarea
          placeholder="Truck Serial No"
          value={formData.truckSerialNo}
          disabled={currentField !== 0}
          onChange={(e) => setFormData({ ...formData, truckSerialNo: e.target.value })}
          rows={2}
        /><br />
        <textarea
          placeholder="Model"
          value={formData.model}
          disabled={currentField !== 1}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          rows={2}
        /><br />
        
        <textarea
          placeholder="Inspector Name"
          value={formData.inspectorName}
          disabled={currentField !== 2}
          onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
          rows={2}
        /><br />
        <textarea
          placeholder="Inspection Employee ID"
          value={formData.inspectionEmployeeID}
          disabled={currentField !== 3}
          onChange={(e) => setFormData({ ...formData, inspectionEmployeeID: e.target.value })}
          rows={2}
        /><br />
        
        <textarea
          placeholder="Location"
          value={formData.location}
          disabled={currentField !== 4}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          rows={2}
        /><br />
        <textarea
          placeholder="Service Meter Hours"
          value={formData.serviceMeterHours}
          disabled={currentField !== 5}
          onChange={(e) => setFormData({ ...formData, serviceMeterHours: e.target.value })}
          rows={2}
        /><br />
        <textarea
          placeholder="Customer / Company Name"
          value={formData.customerCompanyName}
          disabled={currentField !== 6}
          onChange={(e) => setFormData({ ...formData, customerCompanyName: e.target.value })}
          rows={2}
        /><br />
        <textarea
  placeholder="CAT Customer ID"
  value={formData.catCustomerID}
  disabled={currentField !== 7}
  onChange={(e) => {
    console.log('CAT Customer ID Input:', e.target.value);
    setFormData({ ...formData, catCustomerID: e.target.value });
  }}
  rows={2}
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

export default Header;
