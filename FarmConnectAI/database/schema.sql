-- ==========================================================
-- FarmConnect AI - MySQL Database Schema (DDL)
-- Production normalized schema for Agricultural Workforce Management
-- Target Database: MySQL 8.0+
-- ==========================================================

CREATE DATABASE IF NOT EXISTS farmconnect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE farmconnect_db;

-- 1. Users Table (Core Auth & Account Identity)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mobile_number VARCHAR(15) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('FARMER', 'WORKER', 'ADMIN') NOT NULL,
    preferred_language VARCHAR(10) DEFAULT 'en',
    village_or_town VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_mobile (mobile_number),
    INDEX idx_role (role),
    INDEX idx_location (state, district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Farmers Profile Table
CREATE TABLE IF NOT EXISTS farmers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    farm_size_acres DECIMAL(6, 2) NOT NULL DEFAULT 1.0,
    main_crops TEXT NOT NULL, -- JSON or comma-separated: e.g. ["Paddy", "Sugarcane"]
    farm_address TEXT NULL,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    total_jobs_posted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Workers Profile Table
CREATE TABLE IF NOT EXISTS workers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    experience_years INT NOT NULL DEFAULT 1,
    availability_status ENUM('AVAILABLE', 'BUSY', 'AVAILABLE_FROM_DATE') DEFAULT 'AVAILABLE',
    available_from_date DATE NULL,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    reliability_score INT DEFAULT 95, -- 0 to 100 score
    completed_jobs_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_availability (availability_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Skills Master Table
CREATE TABLE IF NOT EXISTS skills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) DEFAULT 'GENERAL',
    description VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Worker Skills Mapping Table (Many-to-Many)
CREATE TABLE IF NOT EXISTS worker_skills (
    worker_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    experience_years INT DEFAULT 1,
    PRIMARY KEY (worker_id, skill_id),
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    work_type VARCHAR(100) NOT NULL,
    description TEXT NULL,
    workers_required INT NOT NULL DEFAULT 1,
    workers_hired INT NOT NULL DEFAULT 0,
    wage_amount DECIMAL(10, 2) NOT NULL,
    wage_type ENUM('PER_HOUR', 'PER_DAY', 'PER_WEEK', 'PER_JOB', 'PER_ACRE', 'SEASONAL') NOT NULL DEFAULT 'PER_DAY',
    currency VARCHAR(5) DEFAULT 'INR',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    working_hours VARCHAR(50) DEFAULT '8:00 AM - 5:00 PM',
    location_address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,
    food_provided BOOLEAN DEFAULT FALSE,
    accommodation_provided BOOLEAN DEFAULT FALSE,
    status ENUM('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'OPEN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
    INDEX idx_job_status (status),
    INDEX idx_job_dates (start_date, end_date),
    INDEX idx_crop_work (crop_type, work_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    worker_id BIGINT NOT NULL,
    status ENUM('APPLIED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'WITHDRAWN', 'COMPLETED') DEFAULT 'APPLIED',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    notes TEXT NULL,
    UNIQUE KEY unique_job_worker (job_id, worker_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
    INDEX idx_application_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Hiring Records Table
CREATE TABLE IF NOT EXISTS hiring (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    worker_id BIGINT NOT NULL,
    farmer_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    agreed_wage DECIMAL(10, 2) NOT NULL,
    wage_type ENUM('PER_HOUR', 'PER_DAY', 'PER_WEEK', 'PER_JOB', 'PER_ACRE', 'SEASONAL') NOT NULL,
    currency VARCHAR(5) DEFAULT 'INR',
    work_status ENUM('SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Work History Table
CREATE TABLE IF NOT EXISTS work_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    worker_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    farmer_id BIGINT NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    work_type VARCHAR(100) NOT NULL,
    duration_days INT NOT NULL,
    rating_given DECIMAL(3, 2) NULL,
    performance_feedback TEXT NULL,
    completion_status ENUM('COMPLETED', 'PARTIALLY_COMPLETED', 'ABANDONED') DEFAULT 'COMPLETED',
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Ratings and Reviews Table
CREATE TABLE IF NOT EXISTS ratings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    from_user_id BIGINT NOT NULL,
    to_user_id BIGINT NOT NULL,
    stars INT NOT NULL CHECK (stars BETWEEN 1 AND 5),
    review_text TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. OTP Verification Table (Mobile Authentication)
CREATE TABLE IF NOT EXISTS otp_verifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    mobile_number VARCHAR(15) NOT NULL,
    otp_hash VARCHAR(100) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_otp_mobile (mobile_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Seed Essential Skills Master
INSERT INTO skills (name, category, description) VALUES
('Harvesting', 'FIELD_WORK', 'Harvesting mature crops like paddy, wheat, fruits'),
('Sowing', 'FIELD_WORK', 'Seed sowing and field preparation'),
('Irrigation', 'WATER_MGMT', 'Water management, canal irrigation, drip/sprinkler'),
('Weeding', 'MAINTENANCE', 'Manual and tool-based weed removal'),
('Planting', 'FIELD_WORK', 'Sapling transplantation and row planting'),
('Fruit picking', 'HARVEST', 'Delicate fruit picking, sorting and packaging'),
('Vegetable harvesting', 'HARVEST', 'Daily fresh vegetable picking and packing'),
('Paddy work', 'SPECIALIZED', 'Paddy transplantation, water puddling, threshing'),
('Livestock work', 'ANIMAL_HUSBANDRY', 'Cattle caring, milking, and shed maintenance'),
('Tractor operation', 'MACHINERY', 'Tractor driving, plowing, rotary tillers'),
('Farm machinery operation', 'MACHINERY', 'Harvesters, power sprayers, threshers'),
('Fertilizer application', 'MAINTENANCE', 'Organic and chemical fertilizer broadcasting')
ON DUPLICATE KEY UPDATE name=name;

-- ==========================================================
-- ADVANCED AGRICULTURAL WORKFORCE INTELLIGENCE EXTENSIONS
-- ==========================================================

-- 13. Worker Teams Table (Feature 3: Worker Team Formation)
CREATE TABLE IF NOT EXISTS worker_teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    leader_worker_id BIGINT NOT NULL,
    team_name VARCHAR(120) NOT NULL,
    primary_skills TEXT NOT NULL, -- JSON array of skills: e.g. ["Paddy Harvesting", "Sowing"]
    total_members INT NOT NULL DEFAULT 1,
    team_rating DECIMAL(3, 2) DEFAULT 5.00,
    completed_team_jobs INT DEFAULT 0,
    availability_status ENUM('AVAILABLE', 'BUSY', 'PARTIALLY_AVAILABLE') DEFAULT 'AVAILABLE',
    preferred_district VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (leader_worker_id) REFERENCES workers(id) ON DELETE CASCADE,
    INDEX idx_team_lead (leader_worker_id),
    INDEX idx_team_location (preferred_district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Worker Team Members Table
CREATE TABLE IF NOT EXISTS worker_team_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT NOT NULL,
    worker_id BIGINT NOT NULL,
    role_in_team ENUM('LEADER', 'SENIOR_WORKER', 'MEMBER') DEFAULT 'MEMBER',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_team_worker (team_id, worker_id),
    FOREIGN KEY (team_id) REFERENCES worker_teams(id) ON DELETE CASCADE,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. Agricultural Skill Passport Table (Feature 4: Skill Passport)
CREATE TABLE IF NOT EXISTS skill_passports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    worker_id BIGINT NOT NULL UNIQUE,
    verified_jobs_count INT DEFAULT 0,
    attendance_rate DECIMAL(5, 2) DEFAULT 95.00,
    punctuality_score INT DEFAULT 92,
    work_quality_score INT DEFAULT 94,
    safety_compliance_score INT DEFAULT 98,
    machinery_competency_score INT DEFAULT 85,
    last_verified_at TIMESTAMP NULL,
    verification_badge ENUM('VERIFIED_EXPERT', 'PROVEN_WORKER', 'DEVELOPING') DEFAULT 'PROVEN_WORKER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. Digital Work Certificates Table (Feature 5: Work Certificates)
CREATE TABLE IF NOT EXISTS work_certificates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    certificate_number VARCHAR(64) NOT NULL UNIQUE, -- e.g. FC-CERT-2026-PAD-90218
    worker_id BIGINT NOT NULL,
    farmer_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    work_type VARCHAR(100) NOT NULL,
    duration_days INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    performance_rating DECIMAL(3, 2) NOT NULL,
    performance_grade ENUM('EXCELLENT', 'VERY_GOOD', 'GOOD', 'SATISFACTORY') NOT NULL,
    farmer_testimonial TEXT NULL,
    farm_location VARCHAR(200) NOT NULL,
    digital_signature_hash VARCHAR(128) NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    INDEX idx_cert_worker (worker_id),
    INDEX idx_cert_number (certificate_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. Trusted Workers Table (Feature 6: Repeat Hiring)
CREATE TABLE IF NOT EXISTS trusted_workers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id BIGINT NOT NULL,
    worker_id BIGINT NOT NULL,
    notes VARCHAR(255) NULL,
    times_hired INT DEFAULT 1,
    last_hired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_favorite BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_farmer_trusted_worker (farmer_id, worker_id),
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 18. Farmer-Worker Relationship History Table (Feature 7: Relationship History)
CREATE TABLE IF NOT EXISTS work_relationships (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id BIGINT NOT NULL,
    worker_id BIGINT NOT NULL,
    jobs_together INT DEFAULT 1,
    successful_completions INT DEFAULT 1,
    average_rating DECIMAL(3, 2) DEFAULT 5.00,
    attendance_rate DECIMAL(5, 2) DEFAULT 100.00,
    last_worked_date DATE NOT NULL,
    reliability_index INT DEFAULT 95,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_relationship (farmer_id, worker_id),
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 19. Job Communication & Chat Table (Feature 8: Job-Specific Messaging)
CREATE TABLE IF NOT EXISTS job_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    sender_user_id BIGINT NOT NULL,
    receiver_user_id BIGINT NOT NULL,
    message_text TEXT NOT NULL,
    is_template BOOLEAN DEFAULT FALSE,
    template_type VARCHAR(50) NULL, -- e.g. 'ARRIVAL_TIME', 'FARM_LOCATION', 'TOOLS_NEEDED'
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_job_chat (job_id, sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 20. Crop Lifecycle Workforce Plans (Feature 12: Crop Lifecycle Planner)
CREATE TABLE IF NOT EXISTS workforce_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id BIGINT NOT NULL,
    plan_name VARCHAR(150) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    farm_size_acres DECIMAL(6, 2) NOT NULL,
    farm_location VARCHAR(200) NOT NULL,
    season VARCHAR(50) DEFAULT 'Kharif',
    estimated_total_cost DECIMAL(12, 2) NOT NULL,
    estimated_total_workers INT NOT NULL,
    status ENUM('DRAFT', 'ACTIVE', 'COMPLETED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 21. Workforce Plan Stage Items Table
CREATE TABLE IF NOT EXISTS workforce_plan_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plan_id BIGINT NOT NULL,
    stage_name VARCHAR(100) NOT NULL, -- SOWING, IRRIGATION, WEEDING, HARVESTING, POST_HARVEST
    workers_needed INT NOT NULL,
    duration_days INT NOT NULL,
    target_month VARCHAR(30) NOT NULL,
    estimated_wage_rate DECIMAL(10, 2) NOT NULL,
    stage_cost DECIMAL(12, 2) NOT NULL,
    weather_risk_level ENUM('LOW', 'MODERATE', 'HIGH') DEFAULT 'LOW',
    suggested_action TEXT NULL,
    stage_order INT DEFAULT 1,
    FOREIGN KEY (plan_id) REFERENCES workforce_plans(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 22. What-If Workforce Scenarios Table (Feature 14: What-If Analysis)
CREATE TABLE IF NOT EXISTS workforce_scenarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id BIGINT NOT NULL,
    base_plan_title VARCHAR(150) NOT NULL,
    scenario_title VARCHAR(150) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    base_workers INT NOT NULL,
    base_days INT NOT NULL,
    base_cost DECIMAL(12, 2) NOT NULL,
    simulated_workers INT NOT NULL,
    simulated_days INT NOT NULL,
    simulated_cost DECIMAL(12, 2) NOT NULL,
    cost_difference DECIMAL(12, 2) NOT NULL,
    time_saved_days INT NOT NULL,
    ai_recommendation TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 23. Predictive Workforce Demand Table (Feature 2: Labor Demand Prediction)
CREATE TABLE IF NOT EXISTS workforce_predictions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    work_type VARCHAR(100) NOT NULL,
    season VARCHAR(50) NOT NULL,
    demand_level ENUM('VERY_HIGH', 'HIGH', 'MODERATE', 'LOW') NOT NULL,
    shortage_risk_percent INT NOT NULL,
    expected_peak_period VARCHAR(100) NOT NULL,
    suggested_action TEXT NOT NULL,
    confidence_score DECIMAL(4, 2) DEFAULT 0.90,
    valid_until DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_pred_loc_crop (state, district, crop_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 24. Personal AI Insights Table (Feature 16: Personal AI Insights)
CREATE TABLE IF NOT EXISTS ai_insights (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role ENUM('FARMER', 'WORKER') NOT NULL,
    insight_type VARCHAR(50) NOT NULL, -- 'SKILL_UPGRADE', 'DEMAND_ALERT', 'EFFICIENCY_TIP', 'EARNING_BOOST'
    headline VARCHAR(200) NOT NULL,
    detailed_text TEXT NOT NULL,
    metric_highlight VARCHAR(100) NULL,
    actionable_cta VARCHAR(100) NULL,
    is_dismissed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_insight_user (user_id, is_dismissed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 25. Structured Multi-Dimensional Ratings Table (Feature 15: Fair Rating Analysis)
CREATE TABLE IF NOT EXISTS structured_ratings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    from_user_id BIGINT NOT NULL,
    to_user_id BIGINT NOT NULL,
    overall_rating DECIMAL(3, 2) NOT NULL,
    attendance_rating DECIMAL(3, 2) NOT NULL,
    work_quality_rating DECIMAL(3, 2) NOT NULL,
    punctuality_rating DECIMAL(3, 2) NOT NULL,
    communication_rating DECIMAL(3, 2) NOT NULL,
    feedback_comments TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_job_user_rating (job_id, from_user_id, to_user_id),
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 26. Emergency / Urgent Workforce Requests Table (Feature 10: Urgent Workforce)
CREATE TABLE IF NOT EXISTS urgent_workforce_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    job_id BIGINT NOT NULL,
    farmer_id BIGINT NOT NULL,
    urgency_level ENUM('HIGH', 'CRITICAL', 'EMERGENCY') DEFAULT 'CRITICAL',
    premium_wage_percent INT DEFAULT 15,
    broadcast_radius_km INT DEFAULT 25,
    reported_reason VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    broadcast_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 27. Offline Action Synchronization Queue (Feature 17: Offline-First Support)
CREATE TABLE IF NOT EXISTS offline_sync_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    action_type VARCHAR(64) NOT NULL, -- 'APPLY_JOB', 'POST_JOB', 'SAVE_JOB', 'SEND_MESSAGE', 'ATTENDANCE_MARK'
    payload_json TEXT NOT NULL,
    client_action_id VARCHAR(100) NOT NULL UNIQUE,
    sync_status ENUM('PENDING', 'PROCESSED', 'FAILED', 'CONFLICT') DEFAULT 'PENDING',
    retry_count INT DEFAULT 0,
    error_message VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sync_user (user_id, sync_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

