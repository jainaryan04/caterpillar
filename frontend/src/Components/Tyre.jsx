import React, { useState, useEffect } from 'react';
import useSpeechToText from '../Hooks/useSpeechToText';

const Header = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [currentField, setCurrentField] = useState(0);
  const [formData, setFormData] = useState({
    truckSerialNo: '',
    model: '',
    inspectionId: '',
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
    if (isListening && transcript.toLowerCase().includes('okay')) {
      moveToNextField();
    }
  }, [transcript]);

  const moveToNextField = () => {
    const cleanedTranscript = transcript.replace(/okay/gi, '').trim();
    if (cleanedTranscript) {
      const fields = Object.keys(formData);
      const updatedFormData = {
        ...formData,
        [fields[currentField]]: cleanedTranscript,
      };
      setFormData(updatedFormData);
      setCurrentField((prevField) => (prevField + 1) % fields.length);
    }
    resetTranscript(); // Clear the transcript after processing
    stopListening(); // Stop listening for the next field
  };

  const handleStartStop = () => {
    if (!isListening) {
      startListening();
    } else {
      stopListening();
    }
  };

  return (
    <div>
      <form>
        <textarea
          placeholder="Truck Serial No"
          value={formData.truckSerialNo}
          disabled={currentField !== 0}
          onChange={(e) => setFormData({ ...formData, truckSerialNo: e.target.value })}
          rows={3}
        /><br />
        <textarea
          placeholder="Model"
          value={formData.model}
          disabled={currentField !== 1}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          rows={3}
        /><br />
        <p>Inspection Id - {formData.inspectionId}</p>
        <textarea
          placeholder="Inspector Name"
          value={formData.inspectorName}
          disabled={currentField !== 2}
          onChange={(e) => setFormData({ ...formData, inspectorName: e.target.value })}
          rows={3}
        /><br />
        <textarea
          placeholder="Inspection Employee ID"
          value={formData.inspectionEmployeeID}
          disabled={currentField !== 3}
          onChange={(e) => setFormData({ ...formData, inspectionEmployeeID: e.target.value })}
          rows={3}
        /><br />
        <p>Date: {currentDateTime.toLocaleDateString()}</p>
        <p>Time: {currentDateTime.toLocaleTimeString()}</p>
        <textarea
          placeholder="Location"
          value={formData.location}
          disabled={currentField !== 4}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          rows={3}
        /><br />
        <textarea
          placeholder="Service Meter Hours"
          value={formData.serviceMeterHours}
          disabled={currentField !== 5}
          onChange={(e) => setFormData({ ...formData, serviceMeterHours: e.target.value })}
          rows={3}
        /><br />
        <textarea
          placeholder="Customer / Company Name"
          value={formData.customerCompanyName}
          disabled={currentField !== 6}
          onChange={(e) => setFormData({ ...formData, customerCompanyName: e.target.value })}
          rows={3}
        /><br />
        <textarea
          placeholder="CAT Customer ID"
          value={formData.catCustomerID}
          disabled={currentField !== 7}
          onChange={(e) => setFormData({ ...formData, catCustomerID: e.target.value })}
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

export default Header;
