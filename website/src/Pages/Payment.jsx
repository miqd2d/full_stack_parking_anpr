import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './Payment_style.css';
import CustomerNav from '../Components/CustomerNav';
import { Wallet, CreditCard } from 'lucide-react';
import UPI from '../assets/UPI_logo.png';
import Modal from './Modal';

function Payment() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const username = localStorage.getItem('username1');

  const onSubmit = (data) => {
    fetch('http://localhost:5000/api/update-balance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, amount: data.amount }),
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('Balance update response:', responseData);
        const billDetails = `
          Payment Method: ${paymentMethod}
          Amount: ₹${data.amount}
          ${paymentMethod === 'UPI' ? `UPI ID: ${data.upiId}${data.upiEnding}` : `Card Holder: ${data.cardName}\nCard Ending: ****${data.cardNumber.slice(-4)}`}
        `;
        
        // Use split and map to create a JSX structure
        setModalMessage(
          <div id='terms_message'>
            <p>Payment Approved!</p>
            {billDetails.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        );
      })
      .catch(error => {
        console.error('Error updating balance:', error);
        setModalMessage(
          <div id='terms_message'>
            <p>Error processing payment.</p>
          </div>
        );
      })
      .finally(() => setShowModal(true));
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
    setModalMessage('');
  };

  const handleConfirm = () => handleCloseModal();

  return (
    <div className="payment-main">
      <CustomerNav />
      <h1> Payment <Wallet /></h1>
      <div className="payment-central-component">
        <div className="payment-option-pagination">
          <button id='upi-button' onClick={() => setPaymentMethod('UPI')}>
            <img id='upi-logo' src={UPI} alt="UPI-logo" />UPI
          </button>
          <button id='card-button' onClick={() => setPaymentMethod('CARD')}>
            <CreditCard size={36} /><br />CARD
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="payment-form">
          {paymentMethod === 'UPI' ? (
            <>
              <div className="form-group-UPI">
                <input placeholder='UPI id' type="text" {...register('upiId', { required: true })} />
                <select {...register('upiEnding', { required: true })}>
                  <option value="@paytm">@paytm</option>
                  <option value="@idfcpay">@idfcpay</option>
                  <option value="@amazonpay">@amazonpay</option>
                  <option value="@spicepay">@spicepay</option>
                  <option value="@kbl">@kbl</option>
                  <option value="@federal">@federal</option>
                  <option value="@sbi">@sbi</option>
                  <option value="@uco">@uco</option>
                  <option value="@timecosmos">@timecosmos</option>
                  <option value="@yestp">@yestp</option>
                  <option value="@idfcbank">@idfcbank</option>
                  <option value="@waicici">@waicici</option>
                  <option value="@icici">@icici</option>
                  <option value="@waaxis">@waaxis</option>
                  <option value="@wahdfcbank">@wahdfcbank</option>
                  <option value="@wasbi">@wasbi</option>
                  <option value="@oksbi">@oksbi</option>
                  <option value="@okicici">@okicici</option>
                  <option value="@pockets">@pockets</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="form-group-CARD">
                <div className="form-group">
                  <label>Card Number:</label>
                  <input placeholder='6845 2987 **** ****' type="text" {...register('cardNumber', { required: true, pattern: /^\d{16}$/ })} maxLength="16" />
                  {errors.cardNumber && <p className="error">Please enter a valid 16-digit card number.</p>}
                </div>
                <div className="form-group">
                  <label>Card Holder Name:</label>
                  <input placeholder='John Doe' type="text" {...register('cardName', { required: true })} />
                </div>
                <div className="form-group">
                  <label>Expiry Date:</label>
                  <input placeholder='MM/YY' type="month" {...register('expiryDate', { required: true })} />
                </div>
                <div className="form-group">
                  <label>Security Code (CVV):</label>
                  <input placeholder='3-digit Security Code' type="password" {...register('cvv', { required: true, pattern: /^\d{3}$/ })} maxLength="3" />
                  {errors.cvv && <p className="error">Please enter a valid 3-digit CVV.</p>}
                </div>
              </div>
            </>
          )}
          <div className="amount-button-group">
            <div className="form-group-amount">
              <label>Amount (₹):</label>
              <input
                type="number"
                {...register('amount', {
                  required: true,
                  min: { value: 1, message: "Amount must be positive." }
                })}
              />
              {errors.amount && <p className="error">{errors.amount.message}</p>}
            </div>
            <button id='payment-button' type="submit">Pay</button>
          </div>
        </form>
      </div>

      {showModal && (
        <Modal
          message={modalMessage}
          onClose={handleCloseModal}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}

export default Payment;
