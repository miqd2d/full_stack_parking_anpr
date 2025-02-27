import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './Modal';
import './LoginScreen_style.css';
import Google from '../assets/google_logo.png';
import Apple from '../assets/apple_logo.png';
import Facebook from '../assets/facebook_logo.png';
import { CloudCog } from 'lucide-react';

function LoginCard() {
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const data = await response.json();

                // Inside handleLoginSubmit in LoginScreen.jsx after receiving the token
                const { token, type_user , username} = data;
                localStorage.setItem('token', token);
                localStorage.setItem('username1', username);

                const usernametemp = localStorage.getItem('username1')
                console.log(usernametemp)
                
                setModalMessage('Login Successful ✅\nRedirecting to Dashboard...');
                setShowModal(true);
    
                setTimeout(() => {
                    if (type_user === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/customer');
                    }
                }, 2000);
            } else {
                const errorResponse = await response.text();
                setModalMessage(`Login failed ❌: ${errorResponse}`);
                setShowModal(true);
            }
        } catch (error) {
            console.error("Error:", error);
            setModalMessage("An error occurred. Please try again later.");
            setShowModal(true);
        }
    };    

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className={`main_box ${showModal ? 'blurred' : ''}`}>
            {showModal && (
                <Modal
                    message={modalMessage}
                    onClose={closeModal}
                    onConfirm={closeModal}
                />
            )}
            <div className="left_card"></div>
            <div className="right_card">
                <div className="text">
                    <div className="large_text">Hello Again!</div>
                    <div className="small_text">Welcome back! You have been missed!</div>
                </div>
                <form onSubmit={handleLoginSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="👤 Username"
                        value={loginData.username}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="🔑 Password"
                        value={loginData.password}
                        onChange={handleChange}
                    />
                    <button type="submit">Login in!</button>
                </form>
                <div className="extra_login_opt">
                    <div>Or continue with....</div>
                    <div><Link className='Registerlink' to="/register">Don't Have an Account? Register HERE!</Link></div>
                    <ul>
                        <li><a href="#"><img src={Apple} alt="Apple" /></a></li>
                        <li><a href="#"><img src={Google} alt="Google" /></a></li>
                        <li><a href="#"><img src={Facebook} alt="Facebook" /></a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default LoginCard;
