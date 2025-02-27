import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import Chart from '../Components/Chart';
import './Stats_style.css';

function Stats() {
    const [stats, setStats] = useState({
        dayCarsData: [],
        dayProfitsData: [],
        carsHoursData: [],
    });
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/admin/statistics');
                const data = await response.json();

                // Format date for "dayCarsData"
                const dayCarsData = data.carsData.map(item => ({
                    date: new Date(item.date).toLocaleDateString('en-GB'),
                    cars: item.cars,
                }));

                // Format date for "dayProfitsData"
                const dayProfitsData = data.profitData.map(item => ({
                    date: new Date(item.date).toLocaleDateString('en-GB'),
                    profit: item.profit,
                }));

                // Format "carsHoursData" for hourly histogram
                const carsHoursData = data.hours.map((count, hour) => ({
                    hour: `${hour}-${hour + 1}`,
                    count,
                }));

                setStats({
                    dayCarsData,
                    dayProfitsData,
                    carsHoursData,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchData();
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className='Stats_mainbox'>
            <Navbar />
            <div className="title">
                <h1>Statistics</h1>
            </div>
            <div className="chartarea">
                {currentPage === 1 && <Chart chartType="day_cars" data={stats.dayCarsData} />}
                {currentPage === 2 && <Chart chartType="day_profits" data={stats.dayProfitsData} />}
                {currentPage === 3 && <Chart chartType="cars_hours" data={stats.carsHoursData} />}
            </div>
            <div className="pagination">
                <button onClick={() => handlePageChange(1)} className={currentPage === 1 ? 'active' : ''}>1</button>
                <button onClick={() => handlePageChange(2)} className={currentPage === 2 ? 'active' : ''}>2</button>
                <button onClick={() => handlePageChange(3)} className={currentPage === 3 ? 'active' : ''}>3</button>
            </div>
        </div>
    );
}

export default Stats;
