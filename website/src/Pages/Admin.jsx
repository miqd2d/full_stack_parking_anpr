import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import './Admin_style.css';
import Card from '../Components/Card';
import LargeCard from '../Components/LargeCard';
import axios from 'axios';

function Admin() {
    const [stats, setStats] = useState({ currentCars: 0, totalProfit: 0, totalVehicles: 0 });

    useEffect(() => {
        // Fetch statistics from backend
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="Main">
            <Navbar />
            <div className="title">
                <h1>Home</h1>
            </div>
            <div className="UpperDeck">
                <Card title="Cars Parked" information={stats.currentCars} />
                <Card title="Total Revenue" information={"₹" + stats.totalProfit} />
                <Card title="Entries" information={stats.totalVehicles} />
            </div>

            <div className="LowerDeck">
                <LargeCard title="Live Feed" for="video" className="largeCardWide" />
                <LargeCard title="Logs" className="largeCardFullWidth" isWide />
            </div>

        </div>
    );
}

export default Admin;
