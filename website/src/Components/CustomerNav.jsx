// import React from 'react';
// import './CustomerNav_style.css';
// import { Link, useNavigate } from 'react-router-dom';
// import { Power, House, KeyRound, ReceiptIndianRupee ,Trash2} from 'lucide-react';

// function CustomerNav() {
//     const navigate = useNavigate(); // Get the navigate function from react-router

//     const handleLogout = () => {
//         // Clear the username and token from local storage
//         localStorage.removeItem('username1');
//         localStorage.removeItem('token'); // Replace 'token' with the actual key used for your token
//         navigate('/'); // Redirect to the home page
//     };

//     return (
//         <div>
//             <div className="customer_nav_mainbox">
//                 <div className="Logout">
//                     {/* Update the Logout link to call handleLogout */}
//                     <Link to='/' onClick={handleLogout}>
//                         <Power color='#192247' />
//                         <div>LOGOUT</div>
//                     </Link>
//                 </div>
//                 <div className="together">
//                     <div className="Password">
//                         <Link to='/customer'>
//                             <House color='#192247' />
//                             <div>HOME</div>
//                         </Link>
//                     </div>
//                     <div className="Password">
//                         <Link to='/changepassword'>
//                             <KeyRound color='#192247' />
//                             <div>PASSWORD</div>
//                         </Link>
//                     </div>
//                     <div className="Payment_icon">
//                         <Link to='/payment'>
//                             <ReceiptIndianRupee color='#192247' />
//                             <div>PAYMENT</div>
//                         </Link>
//                     </div>
//                     <div className="Delete_icon">
//                         <Trash2 color='#192247' />
//                         <div>DELETE <br /> ACCOUNT</div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default CustomerNav;


import React, { useState } from 'react';
import './CustomerNav_style.css';
import { Link, useNavigate } from 'react-router-dom';
import { Power, House, KeyRound, ReceiptIndianRupee, Trash2 } from 'lucide-react';
import Modal from '../Pages/Modal';

function CustomerNav() {
    const navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('username1');
        localStorage.removeItem('token');
    };

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/customer/delete', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            setModalMessage(
                <div id='terms_message'>
                    {result.message.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </div>
            );
            setShowModal(true);

            if (response.ok) {
                handleLogout(); // Log the user out after account deletion
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            setModalMessage(
                <div id='terms_message'>
                    <p>An error occurred while deleting the account.</p>
                </div>
            );
            setShowModal(true);
        }
    };

    return (
        <div>
            <div className="customer_nav_mainbox">
                <div className="Logout">
                    <Link to='/' onClick={handleLogout}>
                        <Power color='#192247' />
                        <div>LOGOUT</div>
                    </Link>
                </div>
                <div className="together">
                    <div className="Password">
                        <Link to='/customer'>
                            <House color='#192247' />
                            <div>HOME</div>
                        </Link>
                    </div>
                    <div className="Password">
                        <Link to='/changepassword'>
                            <KeyRound color='#192247' />
                            <div>PASSWORD</div>
                        </Link>
                    </div>
                    <div className="Payment_icon">
                        <Link to='/payment'>
                            <ReceiptIndianRupee color='#192247' />
                            <div>PAYMENT</div>
                        </Link>
                    </div>
                    <div className="Delete_icon" onClick={handleDeleteAccount}>
                        <Trash2 color='#192247' />
                        <div>DELETE <br /> ACCOUNT</div>
                    </div>
                </div>
            </div>

            {/* Modal for feedback */}
            {showModal && (
                <Modal
                    message={modalMessage}
                    onClose={() => {
                        const user_temp = localStorage.getItem('username1'); // Ensure 'user_temp' is declared with 'const' or 'let'
                        if (user_temp === "") { // Use '===' for comparison
                            setShowModal(false);
                            navigate('/'); // Redirects to the home page if 'user_temp' is an empty string
                        } else {
                            setShowModal(false); // Only closes the modal if 'user_temp' is not empty
                        }
                    }}
                />
            )}

        </div>
    );
}

export default CustomerNav;
