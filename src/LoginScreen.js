import React, { useState, useEffect } from 'react';
import './LoginScreen.css'; // CSS file for styling
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './logo.png';
const LoginScreen = () => {
    const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const baseurl = "http://localhost:3001";
  useEffect(() => {
    const checkAuthToken = async () => {
      // Get the auth_token from local storage
      const auth_token = localStorage.getItem('auth_token');

      if (auth_token) {
        try {
          // Set the Authorization header with the token
          axios.defaults.headers.common['Authorization'] = `Bearer ${auth_token}`;

          const response = await axios.get(baseurl+'/user');

          const data = response.data;

          if (data.status === 1) {
            // Redirect to home screen
            navigate('/home');
          }
        } catch (error) {
          console.log(error);
        }
      }
      setLoading(false);
    };

    checkAuthToken();
  }, [navigate]);
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  const handleRegister = (event)=>{
    navigate("/register")
  }
  const handleLogin = async (event) => {
    event.preventDefault();
    const requestBody = {
      user_email: email,
      user_password: password,
    };
    try {
      const response = await axios.post(baseurl+'/auth', requestBody);

      const data = response.data;

      if (data.status === 1) {
        console.log(data)
        localStorage.setItem('auth_token', data.auth_token);
        navigate('/home');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-screen">
      {loading ? (<div className='loading'>Loading...</div>) : (<div className="login-form">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="title">Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
            minLength={6}
          />
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
        <p className="create-account" onClick={handleRegister}>Create Account</p>
      </div>)}
      
    </div>
  );
};

export default LoginScreen;
