import React, { useState } from 'react';
import { Send, CheckCircle, Database, Server, Clock, RefreshCw } from 'lucide-react';

interface ApiLog {
  id: string;
  time: string;
  endpoint: string;
  method: string;
  status: number;
  payload: any;
  response: any;
}

interface ApiTesterProps {
  logs: ApiLog[];
  onClearLogs: () => void;
}

export const ApiTester: React.FC<ApiTesterProps> = ({ logs, onClearLogs }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/auth/send-otp');
  const [method, setMethod] = useState<string>('POST');
  const [requestBody, setRequestBody] = useState<string>('{\n  "mobileNumber": "+919840123456"\n}');
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleEndpointSelect = (ep: string, meth: string, defaultBody: string) => {
    setSelectedEndpoint(ep);
    setMethod(meth);
    setRequestBody(defaultBody);
  };

  const handleSendRequest = () => {
    setIsLoading(true);
    setResponseOutput(null);

    setTimeout(() => {
      setIsLoading(false);
      try {
        const parsed = JSON.parse(requestBody);
        if (selectedEndpoint === '/api/auth/send-otp') {
          setResponseOutput({
            success: true,
            message: `OTP sent successfully to ${parsed.mobileNumber || '+919840123456'}`,
            data: 'DEV_MODE_OTP:123456'
          });
        } else if (selectedEndpoint === '/api/auth/verify-otp') {
          setResponseOutput({
            success: true,
            message: 'OTP verified successfully',
            data: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              userId: 1,
              mobileNumber: parsed.mobileNumber || '+919840123456',
              role: 'FARMER',
              isRegistered: true
            }
          });
        } else if (selectedEndpoint === '/api/farmer/dashboard') {
          setResponseOutput({
            success: true,
            message: 'Farmer dashboard fetched',
            data: {
              farmerId: 1,
              fullName: 'Ramesh Kumar',
              location: 'Thanjavur, Tamil Nadu',
              farmSizeAcres: 3.5,
              activeJobsCount: 2,
              hiredWorkersCount: 5,
              profileCompletionPercentage: 90
            }
          });
        } else {
          setResponseOutput({
            success: true,
            message: 'Worker dashboard fetched',
            data: {
              workerId: 10,
              fullName: 'Murugesan V.',
              reliabilityScore: 95,
              rating: 4.9,
              completedJobsCount: 18,
              availabilityStatus: 'AVAILABLE'
            }
          });
        }
      } catch (err: any) {
        setResponseOutput({ success: false, message: 'Invalid JSON request format' });
      }
    }, 500);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-emerald-800" />
          <h3 className="font-bold text-slate-900 text-sm">Spring Boot REST API Console</h3>
        </div>
        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-mono text-[11px] font-bold rounded border border-emerald-200">
          Port: 8080 (Active)
        </span>
      </div>

      {/* Preset Endpoints Buttons */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        <button
          onClick={() => handleEndpointSelect('/api/v1/auth/send-otp', 'POST', '{\n  "mobileNumber": "+919840123456"\n}')}
          className={`px-2.5 py-1 text-xs rounded-md border font-medium ${
            selectedEndpoint === '/api/v1/auth/send-otp' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          POST /api/v1/auth/send-otp
        </button>

        <button
          onClick={() => handleEndpointSelect('/api/v1/jobs/create', 'POST', '{\n  "farmerId": 1,\n  "title": "Paddy Harvesting & Threshing",\n  "cropType": "Paddy",\n  "wageAmount": 750,\n  "workersRequired": 6\n}')}
          className={`px-2.5 py-1 text-xs rounded-md border font-medium ${
            selectedEndpoint === '/api/v1/jobs/create' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          POST /api/v1/jobs/create
        </button>

        <button
          onClick={() => handleEndpointSelect('/api/v1/jobs/101/apply', 'POST', '{\n  "workerId": 10,\n  "appliedWage": 750,\n  "message": "Experienced sickle harvester available."\n}')}
          className={`px-2.5 py-1 text-xs rounded-md border font-medium ${
            selectedEndpoint === '/api/v1/jobs/101/apply' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          POST /api/v1/jobs/apply
        </button>

        <button
          onClick={() => handleEndpointSelect('/api/v1/attendance/mark', 'POST', '{\n  "hiredId": "hw-101",\n  "status": "PRESENT",\n  "date": "2026-09-01"\n}')}
          className={`px-2.5 py-1 text-xs rounded-md border font-medium ${
            selectedEndpoint === '/api/v1/attendance/mark' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          POST /api/v1/attendance/mark
        </button>

        <button
          onClick={() => handleEndpointSelect('/api/ai/wage-estimator', 'POST', '{\n  "cropType": "Paddy",\n  "workType": "Harvesting",\n  "district": "Thanjavur",\n  "acres": 3\n}')}
          className={`px-2.5 py-1 text-xs rounded-md border font-medium ${
            selectedEndpoint === '/api/ai/wage-estimator' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-slate-50 text-slate-700 border-slate-200'
          }`}
        >
          POST /api/ai/wage-estimator
        </button>
      </div>

      {/* Interactive Request Bar */}
      <div className="flex gap-2 mt-3">
        <span className="px-3 py-2 bg-slate-100 font-mono font-bold text-xs rounded-lg text-slate-800 flex items-center">
          {method}
        </span>
        <input
          type="text"
          value={selectedEndpoint}
          readOnly
          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 rounded-lg"
        />
        <button
          onClick={handleSendRequest}
          disabled={isLoading}
          className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs"
        >
          {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span>Send Request</span>
        </button>
      </div>

      {/* Request & Response Split Grid */}
      <div className="grid grid-cols-2 gap-3 mt-3 flex-1 min-h-[160px]">
        {/* Request Payload */}
        <div className="flex flex-col">
          <label className="text-[11px] font-bold text-slate-700 mb-1">Request Payload (JSON)</label>
          <textarea
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            className="flex-1 p-2.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 resize-none outline-none"
          />
        </div>

        {/* Response */}
        <div className="flex flex-col">
          <label className="text-[11px] font-bold text-slate-700 mb-1">Response (HTTP 200 OK)</label>
          <pre className="flex-1 p-2.5 bg-slate-900 text-slate-200 font-mono text-xs rounded-xl border border-slate-800 overflow-auto">
            <code>
              {responseOutput ? JSON.stringify(responseOutput, null, 2) : '// Click "Send Request" or interact in Mobile screen'}
            </code>
          </pre>
        </div>
      </div>

      {/* Live Stream of API Events */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Live Network Activity Log</span>
          </span>
          {logs.length > 0 && (
            <button onClick={onClearLogs} className="text-[11px] text-slate-400 hover:text-slate-700">
              Clear Logs
            </button>
          )}
        </div>

        <div className="max-h-24 overflow-y-auto space-y-1.5">
          {logs.length === 0 ? (
            <div className="text-[11px] text-slate-400 italic py-1">
              No API requests triggered yet. Perform actions in the phone simulator above.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-1.5 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                    {log.method}
                  </span>
                  <span className="font-mono text-slate-800">{log.endpoint}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-700 font-bold">200 OK</span>
                  <span className="text-slate-400">{log.time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
