-- Users table to handle both Car Owners and Mechanics
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) CHECK (role IN ('car-owner', 'mechanic')),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Service Requests table based on your app's logic
CREATE TABLE service_requests (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    mechanic_id INTEGER REFERENCES users(id),
    car_type VARCHAR(50), -- e.g., 'Sedan', 'SUV'
    problem_type VARCHAR(50), -- e.g., 'Engine', 'Brakes'
    description TEXT,
    service_cost DECIMAL(10, 2),
    deposit_amount DECIMAL(10, 2), -- 30%
    app_fee DECIMAL(10, 2), -- 12%
    status VARCHAR(30) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);