# 🌾 FarmConnect AI

### AI-Powered Connection Platform for Farmers and Agricultural Labourers

FarmConnect AI is a digital platform designed to bridge the gap between **farmers and agricultural labourers** by making it easier to find, connect, and coordinate agricultural workforce requirements.

The platform aims to simplify the process of finding suitable workers for farming activities while helping labourers discover available agricultural work opportunities.

## 🚀 Live Demo

🌐 **FarmConnect AI:**
https://ais-pre-xgixolt7als2sd3shcgitr-908404315161.asia-east1.run.app/

> The live application is deployed using Google AI Studio.

## 🎯 Problem Statement

Finding reliable agricultural labour at the right time can be challenging for farmers, especially during activities such as:

* 🌱 Sowing
* 🌾 Harvesting
* 💧 Irrigation
* 🌿 Weeding
* 🧑‍🌾 General farm maintenance

At the same time, agricultural labourers may struggle to find nearby and suitable employment opportunities.

FarmConnect AI addresses this gap by providing a centralized digital platform for connecting both sides.

## 💡 Proposed Solution

FarmConnect AI provides a simple platform where:

**Farmers → Post agricultural work requirements**

**Labourers → Discover suitable work opportunities**

**Platform → Helps connect the right people**

This creates a more accessible and organized way to coordinate agricultural labour.

## ✨ Key Features

### 👨‍🌾 For Farmers

* Create and manage agricultural job requirements
* Specify work type and requirements
* Find available agricultural labourers
* Connect with suitable workers
* Manage workforce requirements

### 👷 For Labourers

* Discover available agricultural jobs
* View work requirements
* Find suitable opportunities
* Connect with farmers
* Manage job opportunities

### 🤖 AI-Powered Approach

The platform is designed with AI-assisted functionality to improve the process of connecting farmers and labourers.

Potential AI capabilities include:

* Intelligent worker-job matching
* Requirement-based recommendations
* Natural-language assistance
* Smart search
* Location-aware matching
* Personalized agricultural work suggestions

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      FarmConnect     │
                    │          AI          │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┴─────────────────┐
             │                                   │
       ┌─────▼─────┐                       ┌─────▼─────┐
       │  Farmers  │                       │ Labourers │
       └─────┬─────┘                       └─────┬─────┘
             │                                   │
             └─────────────────┬─────────────────┘
                               │
                       ┌───────▼────────┐
                       │ AI Matching &  │
                       │ Job Platform   │
                       └───────┬────────┘
                               │
                       ┌───────▼────────┐
                       │   Connection   │
                       │   & Discovery  │
                       └────────────────┘
```

## 🛠️ Technology Stack

### Frontend

* React
* TypeScript
* Vite
* HTML5
* CSS

### Backend

* Node.js
* TypeScript
* Server-side APIs

### AI

* Google AI Studio
* Gemini-based AI capabilities

### Development

* Git
* GitHub
* Bun / npm
* Vite

## 📂 Project Structure

```text
FarmConnect-AI/
│
├── FarmConnectAI/
│
├── server/
│
├── src/
│
├── .env.example
├── .gitignore
├── index.html
├── metadata.json
├── package.json
├── server.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Sanjana-shi/FarmConnect-AI.git
```

### 2. Navigate to the project

```bash
cd FarmConnect-AI
```

### 3. Install dependencies

Using npm:

```bash
npm install
```

Or using Bun:

```bash
bun install
```

### 4. Configure environment variables

Create a `.env` file based on:

```text
.env.example
```

Add the required API keys and configuration values.

### 5. Start the development server

```bash
npm run dev
```

Or:

```bash
bun run dev
```

The application should then be available through the local development URL displayed in the terminal.

## 🔄 How It Works

### Step 1 — User Access

Users enter the platform as either a **Farmer** or **Labourer**.

### Step 2 — Add Requirements

Farmers can provide details about the agricultural work they need.

### Step 3 — Discover Opportunities

Labourers can browse available agricultural work opportunities.

### Step 4 — Intelligent Matching

The platform can use user requirements and available information to identify potentially suitable matches.

### Step 5 — Connect

Farmers and labourers can connect and coordinate the work.

## 🌱 Future Enhancements

FarmConnect AI can be expanded with:

* 📍 GPS-based nearby worker/job matching
* 🤖 Advanced AI recommendation engine
* 🗣️ Multilingual voice assistant
* 🌐 Regional language support
* 📱 Mobile application
* ⭐ Farmer/labourer ratings and reviews
* 🔔 Job notifications
* 📅 Work scheduling
* 💰 Digital payment integration
* 🌦️ Weather-aware work planning
* 📊 Agricultural workforce analytics
* 🪪 Worker verification
* 📈 Demand and labour availability prediction

## 🌍 Impact

FarmConnect AI aims to contribute to a more connected agricultural ecosystem by:

* Reducing the difficulty of finding agricultural labour
* Improving access to employment opportunities
* Making agricultural workforce coordination easier
* Supporting digital transformation in agriculture
* Creating a more organized connection between farmers and workers

## 🔐 Security

Sensitive credentials and API keys should be stored using environment variables and should **not** be committed to the repository.

Use:

```text
.env
```

for local secrets and keep it excluded through `.gitignore`.

## 👩‍💻 Project

**FarmConnect AI**

Developed by **Sanjana T C**

GitHub:
https://github.com/Sanjana-shi/FarmConnect-AI

## 📜 License

This project is developed for educational, innovation, and demonstration purposes.
