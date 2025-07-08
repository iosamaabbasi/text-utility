import React, { useState } from 'react';
import Navbar from './Components/Navbar';
import TextForm from './Components/TextForm';
import About from './Components/About';
import Alert from './Components/Alert';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [mode, setMode] = useState('light');
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type) => {
    setAlert({ msg: message, type: type });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  const toggleMode = (selectedMode) => {
    setMode(selectedMode);
    if (selectedMode === 'light') {
      document.body.style.backgroundColor = 'white';
      showAlert('Light Mode Enabled', 'success');
    } else if (selectedMode === 'dark') {
      document.body.style.backgroundColor = '#042743';
      showAlert('Dark Mode Enabled', 'success');
    } else if (selectedMode === 'danger') {
      document.body.style.backgroundColor = '#dc3545';
      showAlert('Danger Mode Enabled', 'success');
    } else if (selectedMode === 'primary') {
      document.body.style.backgroundColor = '#0d6efd';
      showAlert('Primary Mode Enabled', 'success');
    } else if (selectedMode === 'success') {
      document.body.style.backgroundColor = '#198754';
      showAlert('Success Mode Enabled', 'success');
    } else if (selectedMode === 'warning') {
      document.body.style.backgroundColor = '#ffc107';
      showAlert('Warning Mode Enabled', 'success');
    } else if (selectedMode === 'info') {
      document.body.style.backgroundColor = '#0dcaf0';
      showAlert('Info Mode Enabled', 'success');
    } else if (selectedMode === 'secondary') {
      document.body.style.backgroundColor = '#6c757d';
      showAlert('Secondary Mode Enabled', 'success');
    } else if (selectedMode === 'pink') {
      document.body.style.backgroundColor = '#ff69b4';
      showAlert('Pink Mode Enabled', 'success');
    } else if (selectedMode === 'orange') {
      document.body.style.backgroundColor = '#fd7e14';
      showAlert('Orange Mode Enabled', 'success');
    }   
  };

  return (
    <>
      <Router>
        <Navbar title="TextUtils" mode={mode} toggleMode={toggleMode} />
        <Alert alert={alert} />
        <div className="container my-3">
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/" element={<TextForm heading="Enter text to analyze below" mode={mode} showAlert={showAlert} />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
