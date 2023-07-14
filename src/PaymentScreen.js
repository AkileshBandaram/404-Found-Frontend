import React, { useEffect, useState } from 'react';
import './PaymentScreen.css'; // CSS file for styling
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';

const PaymentScreen = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveCard, setSaveCard] = useState(false);
  const [email, setEmail] = useState('');
  const [istoken, setisToken] = useState(false);
  const [token, setToken] = useState('');
  const [savedcard, setSavedCard] = useState('');
  const [savedexp, setSavedExp] = useState('');
  const [savedname,setSavedName]= useState('');
  const baseurl = "http://localhost:3001";
  const pay_baseurl = "http://localhost:3002";
  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(baseurl+'/user');

        const data = response.data;

        if (data.status === 0) {
          // Redirect to login screen
          navigate('/');
        } else {
          setEmail(data.user.user_email);
          if (data.user.user_token !== '') {
            setisToken(true);
            const bytes = CryptoJS.AES.decrypt(data.user.user_token, 'A7mBSxZrjCYZObWd1ziU5wYqm5KyFUqK');
            const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);
            const token = JSON.parse(decryptedToken);
            console.log(token)
            setToken(token.token);
            setSavedCard(token.card);
            setSavedExp(token.exp);
            setSavedName(token.name);
          }
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, [navigate]);

  const handleCardNumberChange = (event) => {
    const { value } = event.target;
    const formattedValue = value.replace(/\D/g, ''); // Only allow digits
    const cardNumberGroups = formattedValue.match(/.{1,4}/g); // Split the string into groups of 4 characters

    if (cardNumberGroups) {
      const formattedCardNumber = cardNumberGroups.join(' '); // Join the groups with a space in between
      setCardNumber(formattedCardNumber);
    } else {
      setCardNumber(formattedValue);
    }
  };

  const handleCardHolderChange = (event) => {
    setCardHolder(event.target.value);
  };

  const handleExpiryDateChange = (event) => {
    const { value } = event.target;
    const formattedValue = value.replace(/\D/g, ''); // Only allow digits

    let formattedExpiryDate = formattedValue;
    if (formattedValue.length > 2) {
      // Insert a slash after the first two characters
      formattedExpiryDate = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
    }

    setExpiryDate(formattedExpiryDate);
  };

  const handleCvvChange = (event) => {
    const { value } = event.target;
    const formattedValue = value.replace(/\D/g, '').substring(0, 3); // Only allow digits and limit to 3 characters

    setCvv(formattedValue);
  };

  const handleSaveCardChange = (event) => {
    setSaveCard(event.target.checked);
  };

  const handlePayNowwithToken = async (event)=>{
    event.preventDefault();
    const encryptedData = encryptData({
      token:token,
      charge_amount: 10,
      email: email,
      withtoken:1
    });
    try {
      setLoading(true);
      const response = await axios.post(
        pay_baseurl+'/payment',
        {
          data: encryptedData
        },
        {
          headers: {
            Authorization: encryptData(email)
          }
        }
      );
      alert(response.data.message);
      navigate("/");
    } catch (error) {
      alert('Transaction Failed');
      navigate("/");
    }
    setLoading(false);
  }

  const handlePayNow = async (event) => {
    event.preventDefault();
    // Handle payment logic here

    // Encrypt card data
    const encryptedData = encryptData({
      card_number: cardNumber.replace(/\s/g, ''),
      card_exp: expiryDate,
      card_cvv: cvv,
      charge_amount: 10,
      email: email,
      save_card: saveCard,
      card_name:cardHolder,
      withtoken:0
    });

    try {
      setLoading(true);
      const response = await axios.post(
        pay_baseurl+'/payment',
        {
          data: encryptedData
        },
        {
          headers: {
            Authorization: encryptData(email)
          }
        }
      );
      alert(response.data.message);
      navigate("/");
    } catch (error) {
      alert('Transaction Failed');
      navigate("/");
    }
    setLoading(false);
  };

  // Encrypt data using AES encryption
  const encryptData = (data) => {
    const jsonString = JSON.stringify(data);
    const encryptedData = CryptoJS.AES.encrypt(jsonString, 'A7mBSxZrjCYZObWd1ziU5wYqm5KyFUqK').toString();
    console.log(encryptedData);
    return encryptedData;
  };

  return (
    <div className="payment-screen">
      {loading ? (
        <div className="loading">Loading...</div>
      ) : istoken ? (
        <>
          <div className="credit-card-block">
            {/* Dummy credit card block */}
            <div className="dummy-card">
              <div className="card-number">
                {savedcard}
              </div>
              <div className="card-details">
                <div className="card-holder">
                  {savedname.toUpperCase()}
                </div>
                <div className="expiry-date">
                  {savedexp}
                </div>
              </div>
            </div>
            <form className='pay_with_token_form' onSubmit={handlePayNowwithToken}>
              <button type="submit" className="pay-now-button">
                Pay Now
              </button>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className="payment-form">
            <h2 className="title">Add Credit Card Details</h2>
            <form onSubmit={handlePayNow}>
              <input
                type="text"
                placeholder="Card Number"
                value={cardNumber}
                onChange={handleCardNumberChange}
                required
                maxLength={19}
              />
              <input
                type="text"
                placeholder="Card Holder"
                value={cardHolder}
                onChange={handleCardHolderChange}
                required
              />
              <div className="expiry-cvv-container">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={handleExpiryDateChange}
                  required
                  maxLength={5}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  value={cvv}
                  onChange={handleCvvChange}
                  pattern="[0-9]*" // Only allow numbers
                  required
                  maxLength={3}
                />
              </div>
              <div className="box">
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={saveCard}
                  onChange={handleSaveCardChange}
                />
                <p>Save Card</p>
              </div>
              <button type="submit" className="pay-now-button">
                Pay Now
              </button>
            </form>
          </div>
          <div className="credit-card-block">
            {/* Dummy credit card block */}
            <div className="dummy-card">
              <div className="card-number">
                {cardNumber ? cardNumber : '**** **** **** 1234'}
              </div>
              <div className="card-details">
                <div className="card-holder">
                  {cardHolder ? cardHolder.toUpperCase() : 'JOHN DOE'}
                </div>
                <div className="expiry-date">
                  {expiryDate ? expiryDate : 'MM/YY'}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentScreen;
