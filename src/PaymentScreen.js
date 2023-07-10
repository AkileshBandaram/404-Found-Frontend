import React, { useState } from 'react';
import './PaymentScreen.css'; // CSS file for styling

const PaymentScreen = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleCardNumberChange = (event) => {
    const { value } = event.target;
    const formattedValue = value
      .replace(/\s/g, '')
      .replace(/(\d{4})(?=\d)/g, '$1 ');

    setCardNumber(formattedValue);
  };

  const handleCardHolderChange = (event) => {
    setCardHolder(event.target.value);
  };

  const handleExpiryDateChange = (event) => {
    setExpiryDate(event.target.value);
  };

  const handleCvvChange = (event) => {
    setCvv(event.target.value);
  };

  const handlePayNow = (event) => {
    event.preventDefault();
    // Handle payment logic here
  };

  return (
    <div className="payment-screen">
      <div className="payment-form">
        <h2 className="title">Add Credit Card Details</h2>
        <form onSubmit={handlePayNow}>
          <input
            type="text"
            placeholder="Card Number"
            value={cardNumber}
            onChange={handleCardNumberChange}
          />
          <input
            type="text"
            placeholder="Card Holder"
            value={cardHolder}
            onChange={handleCardHolderChange}
          />
          <div className="expiry-cvv-container">
            <input
              type="text"
              placeholder="Expiry Date"
              value={expiryDate}
              onChange={handleExpiryDateChange}
            />
            <input
              type="text"
              placeholder="CVV"
              value={cvv}
              onChange={handleCvvChange}
            />
          </div>
          <button type="submit" className="pay-now-button">
            Pay Now
          </button>
        </form>
      </div>
      <div className="credit-card-block">
        {/* Dummy credit card block */}
        <div className="dummy-card">
          <div className="card-number">{cardNumber ? cardNumber : '**** **** **** 1234'}</div>
          <div className="card-details">
            <div className="card-holder">{cardHolder ? cardHolder.toUpperCase() : 'JOHN DOE'}</div>
            <div className="expiry-date">{expiryDate ? expiryDate : '12/23'}</div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
