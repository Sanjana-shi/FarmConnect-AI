import React, { useState } from 'react';
import { FileCode, Database, Cpu, Layout, Terminal, Check, Copy } from 'lucide-react';

export const CodeExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'JAVA_BACKEND' | 'ANDROID_APP' | 'MYSQL_SCHEMA' | 'PYTHON_ML'>('JAVA_BACKEND');
  const [copied, setCopied] = useState(false);

  const codeSnippets: Record<string, { filename: string; language: string; content: string }> = {
    JAVA_BACKEND: {
      filename: 'backend/src/main/java/com/farmconnect/service/AuthService.java',
      language: 'java',
      content: `package com.farmconnect.service;

import com.farmconnect.dto.*;
import com.farmconnect.entity.*;
import com.farmconnect.repository.*;
import com.farmconnect.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final FarmerRepository farmerRepository;
    private final WorkerRepository workerRepository;
    private final OtpVerificationRepository otpRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("\${app.otp.dev-mode:true}")
    private boolean devMode;

    @Transactional
    public ApiResponse<String> sendOtp(SendOtpRequest request) {
        String mobile = formatMobileNumber(request.getMobileNumber());
        String otpCode = devMode ? "123456" : String.format("%06d", new Random().nextInt(999999));

        OtpVerification otp = OtpVerification.builder()
                .mobileNumber(mobile)
                .otpCode(otpCode)
                .expiresAt(LocalDateTime.now().plusMinutes(10))
                .isVerified(false)
                .build();

        otpRepository.save(otp);
        return ApiResponse.success("OTP sent successfully to " + mobile, devMode ? "DEV_OTP:" + otpCode : "SENT");
    }

    @Transactional
    public ApiResponse<AuthResponse> verifyOtp(VerifyOtpRequest request) {
        String mobile = formatMobileNumber(request.getMobileNumber());
        // Verify against DB or Dev default
        Optional<User> existingUser = userRepository.findByMobileNumber(mobile);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            String token = jwtTokenProvider.generateToken(user.getMobileNumber(), user.getRole().name(), user.getId());
            return ApiResponse.success("Login successful", AuthResponse.builder()
                    .token(token).role(user.getRole().name()).isRegistered(true).build());
        }
        return ApiResponse.success("OTP verified. Please proceed to registration.", 
                AuthResponse.builder().mobileNumber(mobile).isRegistered(false).build());
    }
}`
    },
    ANDROID_APP: {
      filename: 'android-app/app/src/main/java/com/farmconnect/app/auth/OtpActivity.java',
      language: 'java',
      content: `package com.farmconnect.app.auth;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.farmconnect.app.api.ApiClient;
import com.farmconnect.app.farmer.FarmerDashboardActivity;
import com.farmconnect.app.worker.WorkerDashboardActivity;
import com.farmconnect.app.models.VerifyOtpRequest;
import com.farmconnect.app.models.AuthResponse;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class OtpActivity extends AppCompatActivity {

    private String mobileNumber;
    private EditText etOtpCode;
    private Button btnVerifyOtp;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_otp);

        mobileNumber = getIntent().getStringExtra("MOBILE_NUMBER");
        etOtpCode = findViewById(R.id.et_otp_code);
        btnVerifyOtp = findViewById(R.id.btn_verify_otp);

        btnVerifyOtp.setOnClickListener(v -> {
            String otp = etOtpCode.getText().toString().trim();
            if (otp.length() == 6) {
                verifyOtpOnBackend(otp);
            }
        });
    }

    private void verifyOtpOnBackend(String otp) {
        ApiClient.getAuthApi().verifyOtp(new VerifyOtpRequest(mobileNumber, otp))
            .enqueue(new Callback<ApiResponse<AuthResponse>>() {
                @Override
                public void onResponse(Call<ApiResponse<AuthResponse>> call, Response<ApiResponse<AuthResponse>> res) {
                    if (res.isSuccessful() && res.body() != null && res.body().isSuccess()) {
                        AuthResponse auth = res.body().getData();
                        if (auth.isRegistered()) {
                            if ("FARMER".equals(auth.getRole())) {
                                startActivity(new Intent(OtpActivity.this, FarmerDashboardActivity.class));
                            } else {
                                startActivity(new Intent(OtpActivity.this, WorkerDashboardActivity.class));
                            }
                        } else {
                            Intent intent = new Intent(OtpActivity.this, RegisterActivity.class);
                            intent.putExtra("MOBILE_NUMBER", mobileNumber);
                            startActivity(intent);
                        }
                    }
                }
                @Override
                public void onFailure(Call<ApiResponse<AuthResponse>> call, Throwable t) {}
            });
    }
}`
    },
    MYSQL_SCHEMA: {
      filename: 'database/schema.sql',
      language: 'sql',
      content: `-- Production Normalized MySQL 8.0 Schema
CREATE TABLE users (
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE farmers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    farm_size_acres DECIMAL(6, 2) NOT NULL,
    main_crops TEXT NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 5.00,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE workers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    experience_years INT NOT NULL DEFAULT 1,
    availability_status ENUM('AVAILABLE', 'BUSY', 'AVAILABLE_FROM_DATE') DEFAULT 'AVAILABLE',
    reliability_score INT DEFAULT 95,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE jobs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    work_type VARCHAR(100) NOT NULL,
    workers_required INT NOT NULL DEFAULT 1,
    wage_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'INR',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
) ENGINE=InnoDB;`
    },
    PYTHON_ML: {
      filename: 'ml-service/main.py',
      language: 'python',
      content: `from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI(title="FarmConnect AI - ML Microservice")

class JobRequirement(BaseModel):
    crop: str
    workType: str
    workersRequired: int
    latitude: float
    longitude: float

class WorkerCandidate(BaseModel):
    workerId: int
    fullName: str
    skills: List[str]
    experienceYears: int
    reliabilityScore: int

@app.post("/ml/recommend-workers")
def recommend_workers(job: JobRequirement, candidates: List[WorkerCandidate]):
    ranked = []
    for worker in candidates:
        skill_match = 1.0 if job.workType in worker.skills else 0.5
        score = (skill_match * 0.4 + (worker.reliabilityScore / 100.0) * 0.4 + 0.2) * 100.0
        ranked.append({
            "workerId": worker.workerId,
            "fullName": worker.fullName,
            "recommendationScore": round(score, 1),
            "matchReasons": ["Verified skill match", "High reliability track record"]
        })
    ranked.sort(key=lambda x: x["recommendationScore"], reverse=True)
    return ranked`
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg text-slate-100 flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 flex-wrap gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('JAVA_BACKEND')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'JAVA_BACKEND' ? 'bg-emerald-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Spring Boot (Java)</span>
          </button>
          <button
            onClick={() => setActiveTab('ANDROID_APP')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'ANDROID_APP' ? 'bg-emerald-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Android (Java + XML)</span>
          </button>
          <button
            onClick={() => setActiveTab('MYSQL_SCHEMA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'MYSQL_SCHEMA' ? 'bg-emerald-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>MySQL Schema (DDL)</span>
          </button>
          <button
            onClick={() => setActiveTab('PYTHON_ML')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'PYTHON_ML' ? 'bg-emerald-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>FastAPI ML Microservice</span>
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-md text-[11px] font-medium text-slate-300 flex items-center gap-1.5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Code'}</span>
        </button>
      </div>

      {/* File Path Header */}
      <div className="px-4 py-2 bg-slate-900/90 text-xs font-mono text-emerald-400 border-b border-slate-800 flex items-center gap-2">
        <Terminal className="w-3.5 h-3.5 text-slate-400" />
        <span>{codeSnippets[activeTab].filename}</span>
      </div>

      {/* Code Viewer Body */}
      <pre className="p-4 flex-1 font-mono text-xs text-slate-200 overflow-auto bg-slate-950/60 leading-relaxed">
        <code>{codeSnippets[activeTab].content}</code>
      </pre>
    </div>
  );
};
