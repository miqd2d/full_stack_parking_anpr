const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'aa7ce337934a8113583bd216b89126d4'; // Use a secure key in production

app.use(cors());

app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '6622',
    database: 'anpr_system'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Register route
app.post('/register', async (req, res) => {
    const { username, password, type_user, plate_num, ...customerInfo } = req.body;

    try {
        // Check if username already exists in 'users' table
        const [userCheck] = await db.promise().query(
            `SELECT username FROM users WHERE username = ?`,
            [username]
        );

        // Check if plate number already exists in 'customer_info' table
        const [plateCheck] = await db.promise().query(
            `SELECT plate_no FROM customer_info WHERE plate_no = ?`,
            [plate_num]
        );

        // If either the username or plate number is taken, send appropriate error messages
        if (userCheck.length > 0) {
            return res.status(409).json({ message: 'Username already taken' });
        }
        if (plateCheck.length > 0) {
            return res.status(409).json({ message: 'Plate Number already registered.' });
        }

        // Proceed with registration if both username and plate number are unique
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.promise().query(`INSERT INTO users (username, password, type_user) VALUES (?, ?, ?)`, [username, hashedPassword, 'customer']);

        await db.promise().query(
            `INSERT INTO customer_info (username, plate_no, first_name, last_name, date_of_birth, license_number, email, phone_number, add_country, add_state, add_city)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [username, plate_num, customerInfo.name, customerInfo.l_name, customerInfo.DOB, customerInfo.license_num, customerInfo.email, customerInfo.pho_num, customerInfo.country, customerInfo.state, customerInfo.city]
        );

        res.status(201).json({ message: 'Successfully registered!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user' });
    }
});



// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const query = 'SELECT * FROM users WHERE username = ?';
        const [users] = await db.promise().query(query, [username]);

        if (users.length === 0 || !(await bcrypt.compare(password, users[0].password))) {
            return res.status(401).send('Invalid credentials');
        }

        const user = users[0];
        const token = jwt.sign({ username: user.username, type_user: user.type_user }, SECRET_KEY, { expiresIn: '1h' });

        // Send both token and type_user
        res.json({ token, type_user: user.type_user, username: user.username });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred during login');
    }
});


// Middleware to authenticate JWT
// const authenticateJWT = (req, res, next) => {
//     const token = req.headers['authorization'];
//     if (!token) return res.sendStatus(403);

//     jwt.verify(token, SECRET_KEY, (err, user) => {
//         if (err) return res.sendStatus(403);
//         req.user = user;
//         next();
//     });
// };

const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log('Token received:', token); // Log the token

    if (!token) {
        console.log('No token provided');
        return res.sendStatus(403);
    }

    // Split the token from the "Bearer" part
    const bearerToken = token.split(' ')[1];
    jwt.verify(bearerToken, SECRET_KEY, (err, user) => {
        if (err) {
            console.log('Token verification failed:', err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};



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

//Logs for admin page
app.get('/api/admin/logs', async (req, res) => {
    try {
        const [logs] = await db.promise().query(`
            SELECT plate_no, username, datetime_entry, in_out_status
            FROM plate_info
            ORDER BY datetime_entry DESC
            LIMIT 50
        `);
        res.json(logs);
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ message: 'Error fetching logs' });
    }
});

// Statistics Endpoint for Detailed Analysis
app.get('/api/admin/statistics', async (req, res) => {
    try {
        // Current Cars: Cars that have an odd number of entries overall (not limited to today)
        const [currentCarsResult] = await db.promise().query(`
            SELECT COUNT(*) AS currentCars 
            FROM (
                SELECT plate_no
                FROM plate_info
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

        // Total Vehicles: Unique cars that entered today
        const [totalVehiclesResult] = await db.promise().query(`
            SELECT COUNT(DISTINCT plate_no) AS totalVehicles 
            FROM plate_info 
            WHERE DATE(datetime_entry) = CURDATE() AND in_out_status = 'IN'
        `);
        const totalVehicles = totalVehiclesResult[0].totalVehicles;

        // Number of cars entered per day with only 'IN' status
        const [carsPerDay] = await db.promise().query(`
            SELECT DATE(datetime_entry) AS date, COUNT(*) AS cars
            FROM plate_info
            WHERE in_out_status = 'IN'
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

// // Backend Code for userInfo
// app.get('/api/admin/user', async (req, res) => {
//     const { type, query } = req.query;
//     try {
//         // Step 1: Fetch user details
//         let userDetailsQuery = `
//             SELECT * FROM customer_info
//             WHERE ${type === 'user' ? 'username' : 'plate_no'} = ?
//         `;

//         const [userDetails] = await db.promise().query(userDetailsQuery, [query]);

//         // Step 2: Check if user details are found
//         let userInfo = null;
//         if (userDetails.length > 0) {
//             userInfo = userDetails[0];
//         }

//         // Step 3: Fetch logs for the queried plate number
//         const userLogsQuery = `
//             SELECT plate_no, username, datetime_entry, in_out_status
//             FROM plate_info
//             WHERE plate_no = ?
//             ORDER BY datetime_entry DESC
//         `;
//         const [userLogs] = await db.promise().query(userLogsQuery, [userInfo ? userInfo.plate_no : query]);

//         // Step 4: Return the response based on the findings
//         if (!userInfo && userLogs.length === 0) {
//             return res.status(404).json({ message: "User or plate number not found" });
//         }

//         // Prepare response
//         res.json({
//             userInfo: userInfo ? userInfo : { message: "Not registered" },
//             userLogs: userLogs
//         });
//     } catch (error) {
//         console.error("Error fetching user details:", error);
//         res.status(500).json({ message: "Error retrieving data" });
//     }
// });

app.get('/api/admin/user', async (req, res) => {
    const { type, query } = req.query;
    try {
        // Step 1: Fetch user details with partial matching based on type (username or plate number)
        let userDetailsQuery = `
            SELECT * FROM customer_info
            WHERE ${type === 'user' ? 'username' : 'plate_no'} LIKE ?
        `;

        // Add wildcards around the query for partial matching
        const [userDetails] = await db.promise().query(userDetailsQuery, [`%${query}%`]);

        // Step 2: Check if user details are found
        let userInfo = null;
        if (userDetails.length > 0) {
            userInfo = userDetails[0];
        }

        // Step 3: Fetch logs based on whether the type is 'user' or 'plate_no'
        let userLogsQuery = `
            SELECT plate_no, username, datetime_entry, in_out_status
            FROM plate_info
            WHERE ${type === 'user' ? 'username' : 'plate_no'} LIKE ?
            ORDER BY datetime_entry DESC
        `;

        const [userLogs] = await db.promise().query(userLogsQuery, [`%${query}%`]);

        // Step 4: Return the response based on the findings
        if (!userInfo && userLogs.length === 0) {
            return res.status(404).json({ message: "User or plate number not found" });
        }

        // Prepare response
        res.json({
            userInfo: userInfo ? userInfo : { message: "Not registered" },
            userLogs: userLogs
        });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Error retrieving data" });
    }
});



// Code for changing passwords
app.post('/api/change-password', authenticateJWT, async (req, res) => {
    const { oldPassword, newPassword, customer_username } = req.body;

    try {
        const [users] = await db.promise().query('SELECT * FROM users WHERE username = ?', [customer_username]);

        // Check if user exists and if the old password is correct
        if (users.length === 0 || !(await bcrypt.compare(oldPassword, users[0].password))) {
            return res.status(401).json({ message: 'Old password is incorrect ❌' });
        }

        // Check if the new password is the same as the old password
        const isSamePassword = await bcrypt.compare(newPassword, users[0].password);
        if (isSamePassword) {
            return res.status(400).json({ message: 'New password is same as old password. ❌' });
        }

        // Hash the new password and update it in the database
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await db.promise().query('UPDATE users SET password = ? WHERE username = ?', [hashedNewPassword, customer_username]);

        res.json({ message: 'Password changed successfully! ✅' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error changing password ❌' });
    }
});





// Route to update balance in customer_info table
app.post('/api/update-balance', (req, res) => {
    const { username, amount } = req.body;

    if (!username || !amount) {
        return res.status(400).json({ error: 'Username and amount are required.' });
    }

    const query = `UPDATE customer_info SET balance = balance + ? WHERE username = ?`;

    db.query(query, [amount, username], (err, result) => {
        if (err) {
            console.error('Error updating balance:', err);
            return res.status(500).json({ error: 'Failed to update balance.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({ message: 'Balance updated successfully.' });
    });
});


// DELETE account endpoint
app.delete('/api/customer/delete', authenticateJWT, async (req, res) => {
    const { username } = req.user;  // Assuming the username is stored in the token

    try {
        // Step 1: Fetch user's balance
        const [balanceResult] = await db.promise().query(
            `SELECT balance FROM customer_info WHERE username = ?`, 
            [username]
        );

        const balance = balanceResult[0].balance;

        // Step 2: Check balance and determine response
        if (balance < 0) {
            return res.status(400).json({ message: 'Account cannot be deleted.\n Negative balance. ❌\nPay the Remaining Amount to Delete..' });
        } else if (balance === 0) {
            // Delete user and log records if balance is 0
            await db.promise().query(`DELETE FROM customer_info WHERE username = ?`, [username]);
            await db.promise().query(`DELETE FROM plate_info WHERE username = ?`, [username]);
            await db.promise().query(`DELETE FROM users WHERE username = ?`, [username]);
            return res.status(200).json({ message: 'Account deleted successfully.✅' });
        } else {
            // Process refund and delete user
            await db.promise().query(`DELETE FROM customer_info WHERE username = ?`, [username]);
            await db.promise().query(`DELETE FROM plate_info WHERE username = ?`, [username]);
            await db.promise().query(`DELETE FROM users WHERE username = ?`, [username]);

            return res.status(200).json({ message: `Account deleted.✅ \nRemaining balance of ₹${balance} will be credited to your Bank account.` });
        }
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ message: 'Error processing account deletion.' });
    }
});





// Example protected route
app.get('/dashboard', authenticateJWT, (req, res) => {
    res.send(`Hello ${req.user.username}, welcome to your dashboard!`);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
