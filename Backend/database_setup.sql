CREATE DATABASE IF NOT EXISTS lis_db;
USE lis_db;

-- Tabla para los especialistas de laboratorio
CREATE TABLE lab_specialists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    internal_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    title ENUM('BACT', 'MICR', 'BIOL') NOT NULL,
    phone VARCHAR(20) NOT NULL
);

-- Tabla para los pacientes
CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document VARCHAR(20) NOT NULL,
    admission_code VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL
);

-- Tabla para los resultados de laboratorio
CREATE TABLE lab_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admission_code VARCHAR(50) NOT NULL,
    specialist_code VARCHAR(50) NOT NULL,
    total_cholesterol DECIMAL(10,2),
    hdl_cholesterol DECIMAL(10,2),
    ldl_cholesterol DECIMAL(10,2),
    triglycerides DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admission_code) REFERENCES patients(admission_code),
    FOREIGN KEY (specialist_code) REFERENCES lab_specialists(internal_code)
);