# FarmConnect AI - Database Design

The relational database uses **MySQL 8.0** with UTF8MB4 encoding for complete Indian regional script compatibility.

## Entity Relationship Overview

1. **`users`**: Base identity for all accounts (Mobile number primary key / unique index, role enum, geolocation coordinates).
2. **`farmers`**: 1-to-1 extension of `users` storing farm size (acres), crop specialties, and rating.
3. **`workers`**: 1-to-1 extension of `users` storing experience (years), availability status, and reliability score (0-100).
4. **`skills`**: Master list of agricultural tasks (e.g., Harvesting, Sowing, Paddy work, Tractor operation).
5. **`worker_skills`**: Many-to-many junction connecting workers to verified skills.
6. **`jobs`**: Job postings created by farmers (crop, work type, workers required, wage in INR, start/end dates, location).
7. **`applications`**: Applications submitted by workers for specific jobs.
8. **`hiring`**: Official hiring agreements with locked wages in INR and work status.
9. **`work_history`**: Digital agricultural resume for workers recording verified completed jobs and feedback.
10. **`ratings`**: Mutual 1-5 star reviews between farmers and workers.
11. **`otp_verifications`**: Mobile OTP transient verification logs with expiry and retry protection.
