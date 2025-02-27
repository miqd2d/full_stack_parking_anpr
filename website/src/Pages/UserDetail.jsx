import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import './UserDetail_style.css';
import { Search } from 'lucide-react';
import Modal from './Modal';
import axios from 'axios';

function UserDetail() {
    const [searchType, setSearchType] = useState('user');
    const [searchQuery, setSearchQuery] = useState('');
    const [userData, setUserData] = useState(null);
    const [userLogs, setUserLogs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/admin/user`, {
                params: { type: searchType, query: searchQuery }
            });

            if (response.data.userInfo) {
                setUserData(response.data.userInfo);
                setUserLogs(response.data.userLogs); // Set logs for the user
            } else {
                setModalMessage("User not found!");
                setShowModal(true);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            if (error.response && error.response.status === 404) {
                setModalMessage("Incorrect username or number plate.");
            } else {
                setModalMessage("Error retrieving data.");
            }
            setShowModal(true);
        }
    };


    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="user_detail_container">
            <Navbar />
            <div className="title">
                <h1>User Details</h1>
            </div>
            <div className="user_container">
                <div className="search_area">
                    <select
                        name="username_or_platenum"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                    >
                        <option value="user">Username</option>
                        <option value="plate">Plate Number</option>
                    </select>
                    <div className="searchbox">
                        <input
                            type="text"
                            placeholder="Username or Number Plate"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button onClick={handleSearch}>
                            <Search />
                        </button>
                    </div>
                </div>
                <div className="information_area">
                    <div className="user_info">
                        <table>
                            <tbody>
                                <tr>
                                    <th>Name</th>
                                    <td>{`${userData?.first_name} ${userData?.last_name} ` || "N/A"}</td>
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
                                    <th>Current Balance</th>
                                    <td>{userData?.balance || "N/A"}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="User_logs">
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
                                        {userLogs.map((log, index) => (
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
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {showModal && (
                <Modal
                    message={modalMessage}
                    onClose={closeModal}
                    onConfirm={closeModal}
                />
            )}
        </div>
    );
}

export default UserDetail;
