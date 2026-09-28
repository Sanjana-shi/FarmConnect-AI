# FarmConnect AI - System Architecture

FarmConnect AI is an India-focused, mobile-first agricultural workforce management platform designed specifically for rural agricultural ecosystems, limited literacy, and low-connectivity environments.

## 1. High-Level Architecture

```
+-------------------------------------------------------------+
|                      Client Layer                           |
|  Android Native App (Java + XML Layouts + Material Design)  |
|  - Multilingual (8 Indian Languages: EN, TA, HI, TE, KN...) |
|  - Voice Assistant Input / Accessibility UI                 |
|  - Retrofit REST Client + Local Offline Cache               |
+------------------------------+------------------------------+
                               | HTTPS / JSON (REST)
                               v
+-------------------------------------------------------------+
|                   Backend Service Layer                     |
|           Java 17 + Spring Boot 3.2.x Ecosystem             |
|  - Mobile OTP Authentication (Passwordless / JWT)           |
|  - Role-Based Access Control (FARMER, WORKER, ADMIN)        |
|  - Job, Application & Wage Lifecycle Management             |
|  - Gemini GenAI Orchestration & Action Validation           |
|  - Spring Data JPA + Hibernate Validation                   |
+---------------+-----------------------------+---------------+
                |                             |
     JDBC Pool  v                  HTTP/REST  v
+-----------------------+     +-------------------------------+
|      MySQL 8.0        |     |       Python ML Microservice  |
|  Normalized Relational|     |   (FastAPI + scikit-learn)    |
|  - Users, Farmers,    |     | - Worker Recommendation Model |
|    Workers, Skills,   |     | - Agricultural Wage Predictor |
|    Jobs, Applications,|     | - Reliability Scoring Engine  |
|    Hiring, Ratings    |     +-------------------------------+
+-----------------------+
```

## 2. Key Technology Choices

- **Android Application:** Java 17 + Material Components + Retrofit 2 + ViewBinding.
- **Backend API:** Java 17 + Spring Boot 3.2.3 + Spring Security + JJWT.
- **Relational Database:** MySQL 8.0 with InnoDB, UTF-8 MB4 charset.
- **Machine Learning Microservice:** Python 3.11 + FastAPI + scikit-learn + NumPy.
- **Generative AI:** Google Gemini API proxied securely through Spring Boot (`GeminiService.java`), never exposing API keys to mobile clients.
- **Localization:** Standard Android resource bundles (`res/values-*/strings.xml`) supporting English, Tamil, Hindi, Telugu, Kannada, Malayalam, Marathi, and Bengali.
- **Deployment:** Docker & Docker-Compose multi-container orchestration.
