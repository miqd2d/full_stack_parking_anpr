import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend } from 'recharts';
import './Chart_style.css';

function Chart({ data, chartType }) {
    if (chartType === "day_profits") {
        return (
            <div className="container">
                <ResponsiveContainer width="90%" height="100%">
                    <AreaChart data={data}>
                        <XAxis dataKey="date" label={{ value: 'Date', position: 'insideBottom', offset: -2 }} />
                        <YAxis tickFormatter={(v) => `₹${v}`} label={{ value: 'Profit (₹)', angle: -90, position: 'insideLeft', offset: 10 }} domain={[0, 5000]} />
                        <Tooltip formatter={(value) => [`₹${value}`, 'Daily Profit']} labelFormatter={(label) => `Date: ${label}`} />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Legend formatter={() => 'Daily Profit (₹)'} />
                        <Area
                            type="monotone"
                            dataKey="profit"
                            name="Daily Profit"
                            stroke="#8884d8"
                            fill="#8884d8"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    } else if (chartType === "day_cars") {
        return (
            <div className="container">
                <ResponsiveContainer width="90%" height="100%">
                    <AreaChart data={data}>
                        <XAxis dataKey="date" label={{ value: 'Date', position: 'insideBottom', offset: -2 }} />
                        <YAxis label={{ value: 'Vehicles', angle: -90, position: 'insideLeft', offset: 10 }} />
                        <Tooltip formatter={(value) => [value, 'Vehicles Entered']} labelFormatter={(label) => `Date: ${label}`} />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Legend formatter={() => 'Vehicles Entered Per Day'} />
                        <Area
                            type="monotone"
                            dataKey="cars"
                            name="Vehicles Entered"
                            stroke="#82ca9d"
                            fill="#8884d8"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        );
    } else if (chartType === "cars_hours") {
        return (
            <div className="container">
                <ResponsiveContainer width="90%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="hour" label={{ value: 'Hour of Day', position: 'insideBottom', offset: -2 }} tickFormatter={(v) => `${v}:00`} />
                        <YAxis label={{ value: 'No. of Cars', angle: -90, position: 'insideLeft', offset: 10 }} />
                        <Tooltip formatter={(value) => [value, 'Cars Parked']} labelFormatter={(label) => `Hour: ${label}:00 - ${label + 1}:00`} />
                        <Legend formatter={() => 'Cars Parked by Hour'} />
                        <Bar dataKey="count" name="Cars Parked" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }
    return null;
}

export default Chart;