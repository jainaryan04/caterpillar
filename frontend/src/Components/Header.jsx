import React, { useState, useEffect } from 'react';

const Header = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Clean up the interval on component unmount
  }, []);

  return (
    <div>
      <form>
        <input type="text" placeholder="Truck Serial No" /><br />
        <input type="text" placeholder="Model" /><br />
        <p>Inspection Id - {}</p>
        <input type="text" placeholder="Inspector Name" /><br />
        <input type="text" placeholder="Inspection Employee ID" /><br />
        <p>Date: {currentDateTime.toLocaleDateString()}</p>
        <p>Time: {currentDateTime.toLocaleTimeString()}</p>
        <input type="text" placeholder="Location" /><br />
        <input type="text" placeholder="Service Meter Hours" /><br />
        <input type="text" placeholder="Customer / Company Name" /><br />
        <input type="text" placeholder="CAT Customer ID" /><br />
      </form>
    </div>
  );
};

export default Header;
