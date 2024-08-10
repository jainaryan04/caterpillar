import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./Components/Header";
import Home from "./Components/Home";
import Tyre from "./Components/Tyre";
import Battery from "./Components/Battery";
import Exterior from "./Components/Exterior";
import Brake from "./Components/Brake";
import Engine from "./Components/Engine";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Tyre />} />
        <Route path="/tyre" element={<Tyre />} />
        <Route path="/battery" element={<Battery />} />
        <Route path="/exterior" element={<Exterior />} />
        <Route path="/brake" element={<Brake />} />
        <Route path="/engine" element={<Engine />} />
      </Routes>
    </Router>
  );
}

export default App;
