import React from 'react';
import { Layers, Database, Cpu, Shield, Smartphone, Globe, Radio, GitBranch } from 'lucide-react';

export const ArchitectureDoc: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 text-slate-800">
      <div>
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-800" />
          <span>FarmConnect AI - Production Architecture Overview</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Designed for Indian rural farmers and agricultural workers with limited literacy, high latency, and multilingual requirements.
        </p>
      </div>

      {/* Layer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Android Native */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Smartphone className="w-4 h-4" />
            <span>1. Android Native Client (Java)</span>
          </div>
          <ul className="mt-2 space-y-1 text-xs text-slate-600 list-disc list-inside">
            <li>Strict Java implementation with clean XML Layouts & Material Components.</li>
            <li>Retrofit 2 REST client communicating over JSON to Spring Boot.</li>
            <li>Localized resource bundles for 8 Indian languages (Tamil, Hindi, Telugu, etc.).</li>
            <li>Voice-assisted UI enabling hands-free accessibility for rural users.</li>
          </ul>
        </div>

        {/* Spring Boot Backend */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Shield className="w-4 h-4" />
            <span>2. Primary Backend (Spring Boot 3.2 + Java 17)</span>
          </div>
          <ul className="mt-2 space-y-1 text-xs text-slate-600 list-disc list-inside">
            <li>Spring Security + Stateless JWT auth with Indian +91 mobile OTP verification.</li>
            <li>Role-Based Access Control (RBAC): ROLE_FARMER, ROLE_WORKER, ROLE_ADMIN.</li>
            <li>Central orchestrator for Job postings, Applications, and Gemini GenAI queries.</li>
            <li>Spring Data JPA with connection pooling and MySQL transaction control.</li>
          </ul>
        </div>

        {/* MySQL Database */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Database className="w-4 h-4" />
            <span>3. Relational Storage (MySQL 8.0)</span>
          </div>
          <ul className="mt-2 space-y-1 text-xs text-slate-600 list-disc list-inside">
            <li>Normalized schema (users, farmers, workers, skills, jobs, applications, hiring).</li>
            <li>Monetary values strictly stored as decimal numbers with separate currency code (INR).</li>
            <li>Spatial coordinates (latitude/longitude) indexed for nearby labor matching.</li>
          </ul>
        </div>

        {/* Python ML Microservice */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Cpu className="w-4 h-4" />
            <span>4. ML Microservice (FastAPI + scikit-learn)</span>
          </div>
          <ul className="mt-2 space-y-1 text-xs text-slate-600 list-disc list-inside">
            <li>Worker Recommendation Engine scoring skill match, distance decay & reliability.</li>
            <li>Seasonal Agricultural Wage Predictor estimating fair INR ranges.</li>
            <li>Independent microservice container communicating with Spring Boot via REST.</li>
          </ul>
        </div>
      </div>

      {/* Directory Structure Summary */}
      <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto">
        <div className="text-emerald-400 font-bold mb-2">📁 FarmConnectAI / Project Directory Layout:</div>
        <div>├── android-app/       # Native Java Android project with XML layouts & multi-lang strings</div>
        <div>├── backend/           # Java 17 + Spring Boot 3.2.x REST API & Security (com.farmconnect)</div>
        <div>├── ml-service/        # Python FastAPI microservice (recommendation, wage, reliability)</div>
        <div>├── database/          # Production MySQL schema (schema.sql) with initial skills & indexes</div>
        <div>├── ai/                # Gemini GenAI service prompt models & backend proxy handlers</div>
        <div>├── docker/            # Docker Compose & Dockerfiles for multi-container orchestration</div>
        <div>└── docs/              # Complete documentation (architecture, database, api, setup)</div>
      </div>
    </div>
  );
};
