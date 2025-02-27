import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar , CartesianGrid,Legend} from 'recharts';
import './Chart_style.css';

function Chart({ data, chartType }) {
    if (chartType === "day_profits") {
        return (
            <div className="container">
                <ResponsiveContainer width="90%" height="100%">
                    <AreaChart data={data}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid />
                        <Legend />
                        <Area 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#8884d8" 
                        fill="#8884d8" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    } else if (chartType === "day_cars") {
        return (
            <div className="container">
            <ResponsiveContainer width="90%" height="100%">
                <AreaChart data={data}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid />
                    <Legend />
                    <Area 
                    type="monotone" 
                    dataKey="cars" 
                    stroke="#82ca9d" 
                    fill="#8884d8" />
                </AreaChart>
            </ResponsiveContainer>
            </div >
        );
    } else if (chartType === "cars_hours") {
        return (
            <div className="container">
            <ResponsiveContainer width="90%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Legend />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
            </div >
        );
    }

    return null;
}

export default Chart;
