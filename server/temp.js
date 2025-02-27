// Admin Stats API
app.get('/api/admin/stats', async (req, res) => {
    try {
        // Current Cars: Cars that have an odd number of entries today
        const [currentCarsResult] = await db.promise().query(`
            SELECT COUNT(*) AS currentCars 
            FROM (
                SELECT plate_no
                FROM plate_info
                WHERE DATE(datetime_entry) = CURDATE()
                GROUP BY plate_no
                HAVING COUNT(*) % 2 = 1
            ) AS in_parking
        `);
        const currentCars = currentCarsResult[0].currentCars;

        // Total Profit: From profits table for today
        const [totalProfitResult] = await db.promise().query(`
            SELECT profit AS totalProfit
            FROM profits
            WHERE DATE(date) = CURDATE()
        `);
        const totalProfit = totalProfitResult[0]?.totalProfit || 0;

        // Total Vehicles: Count of unique cars that entered today
        const [totalVehiclesResult] = await db.promise().query(`
            SELECT COUNT(DISTINCT plate_no) AS totalVehicles 
            FROM plate_info 
            WHERE DATE(datetime_entry) = CURDATE()
        `);
        const totalVehicles = totalVehiclesResult[0].totalVehicles;

        res.json({ currentCars, totalProfit, totalVehicles });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

// Statistics Endpoint for Detailed Analysis
app.get('/api/admin/statistics', async (req, res) => {
    try {
        // Current Cars: Cars that have an odd number of entries today
        const [currentCarsResult] = await db.promise().query(`
            SELECT COUNT(*) AS currentCars 
            FROM (
                SELECT plate_no
                FROM plate_info
                WHERE DATE(datetime_entry) = CURDATE()
                GROUP BY plate_no
                HAVING COUNT(*) % 2 = 1
            ) AS in_parking
        `);
        const currentCars = currentCarsResult[0].currentCars;

        // Total Profit: From profits table for today
        const [totalProfitResult] = await db.promise().query(`
            SELECT profit AS totalProfit
            FROM profits
            WHERE DATE(date) = CURDATE()
        `);
        const totalProfit = totalProfitResult[0]?.totalProfit || 0;

        // Total Vehicles: Count of unique cars that entered today
        const [totalVehiclesResult] = await db.promise().query(`
            SELECT COUNT(DISTINCT plate_no) AS totalVehicles 
            FROM plate_info 
            WHERE DATE(datetime_entry) = CURDATE()
        `);
        const totalVehicles = totalVehiclesResult[0].totalVehicles;

        // Number of cars entered per day
        const [carsPerDay] = await db.promise().query(`
            SELECT DATE(datetime_entry) AS date, COUNT(*) AS cars
            FROM plate_info
            GROUP BY DATE(datetime_entry)
            ORDER BY DATE(datetime_entry)
        `);

        // Profits Per Day from profits table
        const [profitsPerDay] = await db.promise().query(`
            SELECT DATE(date) AS date, profit
            FROM profits
            ORDER BY DATE(date)
        `);

        // Calculate the stay duration per hour
        const hours = Array(24).fill(0); // Array to hold counts for each hour

        const [stayDurations] = await db.promise().query(`
            SELECT HOUR(TIMEDIFF(out_entries.datetime_entry, in_entries.datetime_entry)) AS hour_range, COUNT(*) AS count
            FROM plate_info AS in_entries
            JOIN plate_info AS out_entries
            ON in_entries.plate_no = out_entries.plate_no
            AND in_entries.in_out_status = 'IN'
            AND out_entries.in_out_status = 'OUT'
            AND DATE(in_entries.datetime_entry) = CURDATE()
            AND DATE(out_entries.datetime_entry) = CURDATE()
            AND out_entries.datetime_entry > in_entries.datetime_entry
            GROUP BY hour_range
        `);

        stayDurations.forEach(row => {
            hours[row.hour_range] = row.count;
        });

        // Send the stats as a response
        res.json({
            currentCars,
            totalProfit,
            totalVehicles,
            carsData: carsPerDay,
            profitData: profitsPerDay,
            hours,
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
});
