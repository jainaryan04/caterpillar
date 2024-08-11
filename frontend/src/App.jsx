import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from "./Components/Header";
import Tyre from "./Components/Tyre";
import Battery from "./Components/Battery";
import Exterior from "./Components/Exterior";
import Brake from "./Components/Brake";
import Engine from "./Components/Engine";
import ExportPdfComponent from './Components/ExportPDFComponent';
import ReportForm from './Components/ReportForm'
import Feedback from './Components/Feedback'

function App() {
  const [completedSteps, setCompletedSteps] = useState({
    tyre: false,
    battery: false,
    exterior: false,
    brake: false,
    engine: false,
  });

  const navigate = useNavigate();

  const handleFormCompletion = (step) => {
    setCompletedSteps(prev => ({ ...prev, [step]: true }));

    // Navigate to the next component
    switch (step) {
      case 'tyre':
        navigate('/battery');
        break;
      case 'battery':
        navigate('/exterior');
        break;
      case 'exterior':
        navigate('/brake');
        break;
      case 'brake':
        navigate('/engine');
        break;
      case 'engine':
        navigate('/');
        break;
      default:
        break;
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Header />} />
      <Route path="/tyre" element={<Tyre />} />
      <Route path="/battery" element={<Battery />} />
      <Route path="/exterior" element={<Exterior />} />
      <Route path="/brake" element={<Brake />} />
      <Route path="/engine" element={<Engine />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/pdf" element={<ExportPdfComponent />} />
    </Routes>
  );
}

export default App;
