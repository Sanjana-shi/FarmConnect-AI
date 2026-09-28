# FarmConnect AI - Setup & Execution Guide

## 1. Prerequisites

- **Java JDK 17+**
- **Maven 3.8+**
- **MySQL 8.0+**
- **Android Studio Giraffe/Hedgehog/Iguana** (or Android SDK)
- **Python 3.10+** (for ML microservice)
- **Docker & Docker Compose** (Optional, for 1-command startup)

---

## 2. Quick Start with Docker (Recommended)

To spin up MySQL, Spring Boot Backend, and Python ML service together:

```bash
cd FarmConnectAI/docker
docker compose up --build
```

- MySQL will initialize database schema at `localhost:3306`
- Spring Boot Backend will run on `http://localhost:8080`
- Python ML Microservice will run on `http://localhost:8000`

---

## 3. Manual Component Execution

### Step A: Initialize MySQL Database
```bash
mysql -u root -p < FarmConnectAI/database/schema.sql
```

### Step B: Run Spring Boot Backend
```bash
cd FarmConnectAI/backend
mvn clean spring-boot:run
```

### Step C: Run Python ML Service
```bash
cd FarmConnectAI/ml-service
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Step D: Build & Run Android App
1. Open `FarmConnectAI/android-app` in Android Studio.
2. Ensure Android Emulator is running or connect a physical Android device.
3. For Android Emulator, `10.0.2.2:8080` routes to host machine Spring Boot backend.
4. Click **Run 'app'** (`Shift + F10`).
