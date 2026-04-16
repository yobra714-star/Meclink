//handles the core logic: calculating costs, processing deposits, and updating job statuses
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "running",
        message: "AutoFix backend API is live "
    });
});  // added just to display website running

// 1. Create a Service Request
app.post('/api/requests', async (req, res) => {
    const { ownerId, carType, problemType, description, location } = req.body;
    
    const baseCosts = { 'Sedan': 3500, 'SUV': 4500, 'Pickup': 4000, 'Matatu': 5500 };
    const totalCost = baseCosts[carType] || 1000;
    const deposit = totalCost * 0.30;
    const fee = totalCost * 0.12;

    try {
       const result = await pool.query(
        `INSERT INTO requests 
        (owner_id, car_type, problem_type, description, service_cost, deposit_amount, app_fee, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending') RETURNING *`,
        [ownerId, carType, problemType, description, totalCost, deposit, fee]
    );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message); // This helps you see errors in terminal
        res.status(500).send(err.message);
    }
});

// 2. Fetch Available Jobs
app.get('/api/requests/available', async (req, res) => {
    try {
        // CHANGE 3: Table name must be 'requests'
        const result = await pool.query("SELECT * FROM requests WHERE status = 'pending'");
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// 3. Update Status
app.patch('/api/requests/:id', async (req, res) => {
    const { id } = req.params;
    const { status, mechanicId } = req.body;
    
    try {
        // CHANGE 4: Table name must be 'requests'
        const result = await pool.query(
            "UPDATE requests SET status = $1, mechanic_id = COALESCE($2, mechanic_id) WHERE id = $3 RETURNING *",
            [status, mechanicId, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AutoFix Server running on port ${PORT}`));
