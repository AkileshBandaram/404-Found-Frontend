import React, { useEffect , useState } from 'react';
import './HomeScreen.css'; // CSS file for styling
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const HomeScreen = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const baseurl = "http://localhost:3001";
    useEffect(() => {
      const getUserData = async () => {
        try {
          // Get the auth_token from local storage
          const auth_token = localStorage.getItem('auth_token');
  
          // Set the Authorization header with the token
          axios.defaults.headers.common['Authorization'] = `Bearer ${auth_token}`;
  
          const response = await axios.get(baseurl+'/user');
  
          const data = response.data;
  
          if (data.status === 1) {
            setUsername(data.user.user_name)
          } else { 
            navigate('/');
          }
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      };
  
      getUserData();
    }, [navigate]);

  const handleDonate = () => {
    // Handle donate logic here
    navigate('/payment');
  };
  const handleLogout = ()=>{
    localStorage.clear();
    navigate("/")
  }
  return (
    <div className="home-screen">
      {loading ? (<div className='loading'>Loading...</div>): (<div className="content">
        <h1 className="title">Welcome {username}</h1>
        <button className="donate-button" onClick={handleDonate}>
          Donate $10
        </button>
        <p className="create-account" onClick={handleLogout}>Logout</p>
      </div>)}
      
    </div>
  );
};

export default HomeScreen;
