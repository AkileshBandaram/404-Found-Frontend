import React, { useState, useEffect } from 'react';
import './LoginScreen.css'; // CSS file for styling
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './logo.png';
const RegisterScreen = () => {
    const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkAuthToken = async () => {
      // Get the auth_token from local storage
      const auth_token = localStorage.getItem('auth_token');

      if (auth_token) {
        try {
          // Set the Authorization header with the token
          axios.defaults.headers.common['Authorization'] = `Bearer ${auth_token}`;

          const response = await axios.get('https://merchant-backend.onrender.com/user');

          const data = response.data;

          if (data.status === 1) {
            // Redirect to home screen
            navigate("/home")
          }
        } catch (error) {
          console.log(error);
        }
      }
      setLoading(false);
    };

    checkAuthToken();
  }, [navigate]);
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = async (event) => {
    navigate("/")
  };

  const handleRegister = async(event)=>{
    event.preventDefault();
    const requestBody = {
      user_email: email,
      user_password: password,
      user_name:username
    };
    try {
      const response = await axios.put('https://merchant-backend.onrender.com/auth', requestBody);

      const data = response.data;

      if (data.status === 1) {
        console.log(data)
        alert("Register Successfull")
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="login-screen">
      {loading ? (<div className='loading'>Loading...</div>) : (<div className="login-form">
        <img src={logo} alt="Logo" className="logo" />
        <h2 className="title">Welcome to 404 Found</h2>
        <form onSubmit={handleRegister}>
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <button type="submit" className="login-button">
            Register
          </button>
        </form>
        <p className="create-account" onClick={handleLogin}>Login</p>
      </div>)}
      
    </div>
  );
};

export default RegisterScreen;
