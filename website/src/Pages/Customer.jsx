import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Customer_style.css';
import CustomerNav from '../Components/CustomerNav';
import Modal from './Modal';
import Card from '../Components/Card';
import {Car} from 'lucide-react'

function Customer() {
  const [userData, setUserData] = useState(null);
  const [userLogs, setUserLogs] = useState([]);
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const customer_username = localStorage.getItem('username1');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/user`, {
        params: { type: 'user', query: customer_username }
      });
      if (response.data.userInfo) {
        setUserData(response.data.userInfo);
        setUserLogs(response.data.userLogs);
      } else {
        setModalMessage("User not found!");
        setShowModal(true);
      }
    } catch (error) {
      setModalMessage("Error retrieving data.");
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (customer_username) {
      handleSearch();
    } else {
      setModalMessage("No user is logged in.");
      setShowModal(true);
    }
  }, [customer_username]);

  const balanceColor = userData?.balance < 0 ? 'red' : 'green';

  const closeModal = () => setShowModal(false);

  return (
    <div>
      <CustomerNav />
      {showModal && (
        <Modal
          message={modalMessage}
          onClose={closeModal}
        />
      )}
      <h1 className='customer_title'>Welcome {userData?.first_name || "Guest"}! </h1>
      <div className="customer_information_area">
        <div className="left_area">
          <div className="user_info">
            <h2>User Details</h2>
            <table>
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{`${userData?.first_name || "N/A"} ${userData?.last_name || ""}`.trim() || "N/A"}</td>
                </tr>
                <tr>
                  <th>Username</th>
                  <td>{userData?.username || "N/A"}</td>
                </tr>
                <tr>
                  <th>Date of Birth</th>
                  <td>{new Date(userData?.date_of_birth).toLocaleDateString('en-GB') || "N/A"}</td>
                </tr>
                <tr>
                  <th>Address</th>
                  <td>{`${userData?.add_city}, ${userData?.add_state}, ${userData?.add_country}` || "N/A"}</td>
                </tr>
                <tr>
                  <th>Phone No</th>
                  <td>{userData?.phone_number || "N/A"}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{userData?.email || "N/A"}</td>
                </tr>
                <tr>
                  <th>Plate No</th>
                  <td>{userData?.plate_no || "N/A"}</td>
                </tr>
                <tr>
                  <th>Driving License No</th>
                  <td>{userData?.license_number || "N/A"}</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>
        <div className="right_area">
          <Card title="Balance" information={`₹${userData?.balance}`} balanceColor={balanceColor} />
          <div className="customer_User_logs">
            <h2>Entries</h2>
            <div className="table-container">
              <table className="log-table">
                <thead>
                  <tr>
                    <th>Plate Number</th>
                    <th>Username</th>
                    <th>Date & Time Entry</th>
                    <th>In/Out Status</th>
                  </tr>
                </thead>
              </table>
              <div className="scrollable-body">
                <table className="log-table">
                  <tbody>
                    {userLogs.length > 0 ? (
                      userLogs.map((log, index) => (
                        <tr key={index}>
                          <td>{log.plate_no}</td>
                          <td>{log.username}</td>
                          <td>
                            {new Date(log.datetime_entry).toLocaleDateString('en-GB') + ' ' +
                              new Date(log.datetime_entry).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className={log.in_out_status === 'IN' ? 'status-in' : 'status-out'}>
                            {log.in_out_status}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No logs available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customer;
