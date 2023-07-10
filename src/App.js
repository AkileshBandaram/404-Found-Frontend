// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import PaymentScreen from './PaymentScreen';
import RegisterScreen from "./RegisterScreen"

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
