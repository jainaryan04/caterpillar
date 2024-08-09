import './App.css';
import React from 'react';
import Header from "./Components/Header"
import Home from "./Components/Home"
import Tyre from "./Components/Tyre"
import Battery from "./Components/Battery"
import Exterior from "./Components/Exterior"
import Brake from "./Components/Brake"
import Engine from "./Components/Engine"

function App() {
  return (
    <div className="App">
      <Tyre />
      <Battery />
      <Exterior />
      <Brake />
      <Engine />
    </div>
  );
}

export default App;
