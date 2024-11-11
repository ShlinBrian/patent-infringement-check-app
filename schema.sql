CREATE TABLE report (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR NOT NULL,
    report_data JSON NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
