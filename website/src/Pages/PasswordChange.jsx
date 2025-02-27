import React, { useState } from 'react';
import './PasswordChange_style.css';
import CustomerNav from "../Components/CustomerNav";
import { useForm } from 'react-hook-form';
import Modal from './Modal'; // Adjust the import path as necessary
import axios from 'axios';
import {KeyRound} from 'lucide-react'

function PasswordChange() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const customer_username = localStorage.getItem('username1')

  const onSubmit = async (data) => {
    const { oldPassword, newPassword } = data;
    const token = localStorage.getItem('token'); // Assuming you store your token in local storage
    try {
      const token = localStorage.getItem('token'); // Assuming you store your token in local storage
      const response = await axios.post('http://localhost:5000/api/change-password',
        { oldPassword, newPassword, customer_username },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Correctly formatted
          },
        }
      );

      setModalMessage(response.data.message);
      setIsModalOpen(true);
    } catch (error) {
      setModalMessage(error.response?.data?.message || 'An error occurred');
      setIsModalOpen(true);
    }
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <CustomerNav />
      <h1>Change Password <KeyRound/></h1>
      <div className="central_component">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="password"
            placeholder="Old Password"
            {...register('oldPassword', { required: true })}
          />
          {errors.oldPassword && <span>This field is required</span>}

          <input
            type="password"
            placeholder="New Password"
            {...register('newPassword', {
              required: true,
              minLength: { value: 8, message: 'Password must be at least 8 characters' }
            })}
          />
          {errors.newPassword && <span>{errors.newPassword.message}</span>}

          <input
            type="password"
            placeholder="Confirm New Password"
            {...register('confirmPassword', {
              validate: value => value === watch('newPassword') || 'Passwords do not match'
            })}
          />
          {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

          <button id='passwordButton' type="submit">Change Password</button>
        </form>
      </div>

      {isModalOpen && (
        <Modal
          message={modalMessage}
          onClose={handleCloseModal}
          onConfirm={handleCloseModal}
        />
      )}
    </div>
  );
}

export default PasswordChange;
