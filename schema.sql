CREATE DATABASE IF NOT EXISTS vehicle_service;

USE vehicle_service;

CREATE TABLE IF NOT EXISTS service_records (
    id INT AUTO_INCREMENT PRIMARY KEY,

    customer_name VARCHAR(100) NOT NULL,

    phone_number VARCHAR(20) NOT NULL,

    email_id VARCHAR(150) NOT NULL,

    vehicle_number VARCHAR(30) NOT NULL,

    vehicle_brand VARCHAR(100) NOT NULL,

    vehicle_model VARCHAR(100) NOT NULL,

    service_type VARCHAR(100) NOT NULL,

    service_date DATE NOT NULL,

    service_status VARCHAR(50) NOT NULL
);

SELECT * FROM service_records;