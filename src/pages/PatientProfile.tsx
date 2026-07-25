import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCareStore } from '../store/useCareStore';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Timeline } from '../components/Timeline';
import { AlertBadge } from '../components/AlertBadge';
import { Button } from '../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Patient } from '../types';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldAlert, 
  Heart, 
  Thermometer, 
  Activity, 
  FileText, 
  Printer, 
  ArrowRightLeft
} from 'lucide-react';
import { cn } from '../utils/cn';

export const PatientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { patients, diagnosticReports, updatePatientStatus } = useCareStore();
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Fetch Patient details
  const patient = useMemo(() => {
    return patients.find(p => p.id === id);
  }, [patients, id]);

  // Fetch all diagnostic reports associated with this patient
  const patientReports = useMemo(() => {
    return diagnosticReports.filter(r => r.patientId === id);
  }, [diagnosticReports, id]);

  // Fetch specific report details if selected
  const activeReport = useMemo(() => {
    return diagnosticReports.find(r => r.id === selectedReportId);
  }, [diagnosticReports, selectedReportId]);

  if (!patient) {
    return (
      <div className="py-20 text-center">
        <h3 className="text-xl font-bold text-ink font-display">Patient Record Not Found</h3>
        <p className="text-ink/70 mt-2">The requested patient ID does not exist in the database.</p>
        <Button onClick={() => navigate('/patients')} className="mt-6">
          Return to Directory
        </Button>
      </div>
    );
  }

  // Aggregate vitals history for charts
  const chartData = useMemo(() => {
    return patient.vitalsHistory.map(item => {
      const timeStr = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        time: timeStr,
        'Heart Rate (bpm)': item.heartRate,
        'Systolic BP (mmHg)': item.bloodPressureSystolic,
        'Diastolic BP (mmHg)': item.bloodPressureDiastolic,
        'SpO2 (%)': item.oxygenSat,
        'Temp (°F)': item.temperature,
        'Resp Rate (rpm)': item.respiratoryRate
      };
    });
  }, [patient]);

  const handleStatusChange = () => {
    const statuses: Patient['status'][] = ['Stable', 'Critical', 'Recovering'];
    const currentIndex = statuses.indexOf(patient.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    updatePatientStatus(patient.id, nextStatus);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Back button */}
      <button 
        onClick={() => navigate('/patients')} 
        className="flex items-center space-x-1.5 text-ink/60 hover:text-teal transition-colors cursor-pointer text-sm font-bold font-display"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Patient Directory</span>
      </button>

      {/* Profile Header Summary */}
      <section className="bg-white border border-grid rounded-lg p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
          {/* Avatar Icon */}
          <div className="h-16 w-16 rounded-lg bg-paper border border-grid flex items-center justify-center text-ink text-2xl font-bold font-display select-none">
            {patient.name.split(' ').map(n => n[0]).join('')}
          </div>
          
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-ink font-display">{patient.name}</h1>
              <AlertBadge status={patient.status} />
              <button 
                onClick={handleStatusChange} 
                className="text-[10px] text-teal hover:text-ink border border-grid bg-paper px-2 py-0.5 rounded cursor-pointer flex items-center font-display font-bold"
              >
                <ArrowRightLeft className="w-2.5 h-2.5 mr-1" /> Cycle Status
              </button>
            </div>
            <p className="text-sm text-ink/75">
              ID: <span className="font-mono font-bold text-ink">{patient.id}</span> • {patient.age} years old • {patient.gender} • Blood Type: <strong className="text-ink font-mono">{patient.bloodType}</strong>
            </p>
            <p className="text-xs text-ink/60 font-semibold font-display">
              Attending Physician: <span className="text-ink font-bold">{patient.attendingPhysician}</span> • Ward Bed: <span className="text-ink font-bold font-mono">{patient.bedNumber || 'Unassigned'}</span>
            </p>
          </div>
        </div>

        {/* Quick Contact & Allergies Panel */}
        <div className="flex flex-col sm:flex-row gap-6 border-t lg:border-t-0 lg:border-l border-grid pt-6 lg:pt-0 lg:pl-6 max-w-md">
          <div className="space-y-2 text-xs text-ink/75">
            <span className="text-[10px] uppercase font-bold text-ink/60 block tracking-wider font-display">Contact Info</span>
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-ink/50" />
              <span className="font-mono">{patient.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-ink/50" />
              <span className="truncate">{patient.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-ink/50" />
              <span className="truncate">{patient.address}</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-ink/65 block tracking-wider font-display">Clinical Alerts</span>
            <div className="space-y-1.5">
              {patient.allergies.length > 0 ? (
                patient.allergies.map((allergy, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-0.5 rounded bg-coral/10 border border-coral/30 text-coral font-bold font-display mr-1.5">
                    <ShieldAlert className="w-3 h-3 mr-1" />
                    Allergy: {allergy}
                  </span>
                ))
              ) : (
                <span className="text-ink/60 italic block font-mono">No known drug allergies.</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Tabs Container */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="timeline">Treatment Timeline</TabsTrigger>
          <TabsTrigger value="vitals">Telemetry & Vitals</TabsTrigger>
          <TabsTrigger value="reports">Diagnostic Reports ({patientReports.length})</TabsTrigger>
        </TabsList>

        {/* 1. Timeline Tab */}
        <TabsContent value="timeline" className="bg-white border border-grid rounded-lg p-6 shadow-sm">
          <h4 className="text-lg font-semibold text-ink mb-6 font-display">Clinical History & Procedures</h4>
          <Timeline events={patient.medicalHistory} />
        </TabsContent>

        {/* 2. Vitals / Telemetry Tab */}
        <TabsContent value="vitals" className="space-y-6">
          {/* Current Live Vitals Display */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-grid rounded-lg p-4 text-center shadow-sm">
              <span className="text-xs text-ink/75 flex items-center justify-center font-display"><Heart className="w-3.5 h-3.5 mr-1 text-coral" /> Heart Rate</span>
              <h4 className="text-2xl font-bold text-ink mt-1 font-mono">{patient.vitals.heartRate} <span className="text-xs text-ink/60 font-semibold font-display">bpm</span></h4>
            </div>
            <div className="bg-white border border-grid rounded-lg p-4 text-center shadow-sm">
              <span className="text-xs text-ink/75 flex items-center justify-center font-display"><Activity className="w-3.5 h-3.5 mr-1 text-teal" /> Blood Pressure</span>
              <h4 className="text-2xl font-bold text-ink mt-1 font-mono">{patient.vitals.bloodPressure} <span className="text-xs text-ink/60 font-semibold font-display">mmHg</span></h4>
            </div>
            <div className="bg-white border border-grid rounded-lg p-4 text-center shadow-sm">
              <span className="text-xs text-ink/75 flex items-center justify-center font-display"><Activity className="w-3.5 h-3.5 mr-1 text-teal" /> Oxygen Saturation</span>
              <h4 className="text-2xl font-bold text-ink mt-1 font-mono">{patient.vitals.oxygenSat}%</h4>
            </div>
            <div className="bg-white border border-grid rounded-lg p-4 text-center shadow-sm">
              <span className="text-xs text-ink/75 flex items-center justify-center font-display"><Thermometer className="w-3.5 h-3.5 mr-1 text-teal" /> Temperature</span>
              <h4 className="text-2xl font-bold text-ink mt-1 font-mono">{patient.vitals.temperature} <span className="text-xs text-ink/60 font-semibold font-display">°F</span></h4>
            </div>
          </div>

          {/* Vitals Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-grid rounded-lg p-5 shadow-sm">
              <h5 className="text-sm font-semibold text-ink mb-4 font-display">Heart Rate & Blood Oxygen Saturation Trends</h5>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="var(--color-grid)" />
                  <XAxis dataKey="time" stroke="var(--color-ink)" opacity={0.6} fontSize={10} />
                  <YAxis yAxisId="hr" stroke="var(--color-ink)" opacity={0.6} fontSize={10} domain={['dataMin - 10', 'dataMax + 10']} />
                  <YAxis yAxisId="o2" orientation="right" stroke="var(--color-ink)" opacity={0.6} fontSize={10} domain={[80, 100]} />
                  <Tooltip />
                  <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-[10px] text-ink font-mono">{value}</span>} />
                  <Line yAxisId="hr" type="monotone" dataKey="Heart Rate (bpm)" stroke="#FF6B5B" strokeWidth={2} activeDot={{ r: 6 }} dot={false} />
                  <Line yAxisId="o2" type="monotone" dataKey="SpO2 (%)" stroke="#0F5C56" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-grid rounded-lg p-5 shadow-sm">
              <h5 className="text-sm font-semibold text-ink mb-4 font-display">Hemodynamic Blood Pressure Trends</h5>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="var(--color-grid)" />
                  <XAxis dataKey="time" stroke="var(--color-ink)" opacity={0.6} fontSize={10} />
                  <YAxis stroke="var(--color-ink)" opacity={0.6} fontSize={10} domain={['dataMin - 15', 'dataMax + 15']} />
                  <Tooltip />
                  <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-[10px] text-ink font-mono">{value}</span>} />
                  <Line type="monotone" dataKey="Systolic BP (mmHg)" stroke="#0F5C56" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Diastolic BP (mmHg)" stroke="#4FD1C5" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        {/* 3. Diagnostic Reports Tab */}
        <TabsContent value="reports" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Reports Index list */}
          <div className="lg:col-span-4 bg-white border border-grid rounded-lg p-5 space-y-3 shadow-sm">
            <h5 className="text-sm font-semibold text-ink mb-4 font-display">Report Directory</h5>
            {patientReports.length > 0 ? (
              patientReports.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  className={cn(
                    "p-3 rounded-lg border text-left cursor-pointer transition-all",
                    selectedReportId === rep.id
                      ? "bg-teal/10 border-teal text-ink"
                      : "bg-paper border-grid text-ink/80 hover:border-teal"
                  )}
                >
                  <span className="text-[10px] text-ink/60 font-bold block font-mono">{rep.date} • {rep.id}</span>
                  <h6 className="text-xs font-semibold mt-1 truncate font-display">{rep.title}</h6>
                  <span className="text-[10px] text-ink/65 mt-1 block font-mono">Attending: {rep.doctor}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-ink/60 italic py-6 text-center font-mono">No reports uploaded for this patient.</p>
            )}
          </div>

          {/* Report Detail View workspace */}
          <div className="lg:col-span-8 bg-white border border-grid rounded-lg p-6 flex flex-col justify-between shadow-sm">
            {activeReport ? (
              <div className="space-y-6">
                {/* Header detail */}
                <div className="flex items-start justify-between border-b border-grid pb-4">
                  <div>
                    <span className="text-xs font-bold text-ink/60 uppercase tracking-widest font-display">{activeReport.testType} Diagnostic Report</span>
                    <h3 className="text-xl font-bold text-ink mt-1 font-display">{activeReport.title}</h3>
                    <p className="text-xs text-ink/65 mt-1 font-mono">ID: {activeReport.id} • Issued: {activeReport.date} by {activeReport.doctor}</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={handlePrintReport} className="text-xs">
                    <Printer className="w-3.5 h-3.5 mr-1" /> Print Report
                  </Button>
                </div>

                {/* Patient / Doctor meta */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-paper border border-grid p-4 rounded-lg text-xs">
                  <div>
                    <span className="text-ink/60 font-semibold font-display">Patient Name</span>
                    <p className="text-ink font-bold mt-0.5 font-display">{activeReport.patientName}</p>
                  </div>
                  <div>
                    <span className="text-ink/60 font-semibold font-display">Department</span>
                    <p className="text-ink font-bold mt-0.5 font-display">{activeReport.department}</p>
                  </div>
                  <div>
                    <span className="text-ink/60 font-semibold font-display">Reviewing Physician</span>
                    <p className="text-ink font-bold mt-0.5 font-display">{activeReport.doctor}</p>
                  </div>
                  <div>
                    <span className="text-ink/60 font-semibold font-display">Status</span>
                    <p className="text-ink font-bold mt-0.5">
                      <span className="inline-flex items-center text-[10px] font-bold bg-teal/15 text-teal border border-teal/20 px-1.5 py-0.2 rounded font-mono">
                        {activeReport.status}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Diagnostics Findings */}
                <div className="space-y-2 text-xs text-left">
                  <span className="text-ink/60 uppercase font-bold tracking-wider text-[10px] font-display">Findings SUMMARY</span>
                  <p className="text-ink/85 leading-relaxed bg-paper border border-grid p-3.5 rounded-lg font-medium">
                    {activeReport.findings}
                  </p>
                </div>

                {/* Test results with custom progress range gauges */}
                <div className="space-y-4">
                  <span className="text-ink/60 uppercase font-bold tracking-wider text-[10px] font-display">Reference Chemistry Panels</span>
                  <div className="space-y-3.5">
                    {activeReport.results.map((res, index) => {
                      const rangeSpan = res.maxNormal - res.minNormal;
                      // Calculate width offset percentage for value position relative to normal range
                      let pct = ((res.value - res.minNormal) / rangeSpan) * 100;
                      // Clamp between 0 and 100 for safety
                      pct = Math.max(0, Math.min(100, pct));
                      
                      return (
                        <div key={index} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-ink font-display">{res.parameter}</span>
                            <span className="text-ink/75 font-mono">
                              <strong className={cn(
                                "text-sm font-mono",
                                res.status === 'High' && 'text-coral',
                                res.status === 'Low' && 'text-coral',
                                res.status === 'Normal' && 'text-teal'
                              )}>{res.value}</strong> {res.unit}{" "}
                              <span className="text-[10px] text-ink/60 font-mono">({res.referenceRange} normal)</span>
                            </span>
                          </div>

                          {/* Horizontal Gauge */}
                          <div className="h-2 w-full bg-grid rounded relative overflow-hidden">
                            {/* Normal Range indicator band */}
                            <div className="absolute left-[20%] right-[20%] top-0 bottom-0 bg-teal/15" />
                            
                            {/* Current value bullet */}
                            <div 
                              style={{ left: `${pct}%` }} 
                              className={cn(
                                "absolute top-[50%] translate-y-[-50%] w-3 h-3 rounded-full border border-white shadow-sm cursor-pointer",
                                res.status === 'High' || res.status === 'Low' ? 'bg-coral' : 'bg-teal'
                              )} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Doctor's Notes */}
                <div className="space-y-2 text-xs text-left">
                  <span className="text-ink/60 uppercase font-bold tracking-wider text-[10px] font-display">Clinical Recommendations</span>
                  <p className="text-ink/75 italic bg-paper border border-grid p-3 rounded-lg font-medium">
                    "{activeReport.notes}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-ink/50 text-xs font-mono">
                <FileText className="w-12 h-12 text-ink/30 mb-3 animate-none" />
                Select a diagnostic report from the sidebar directory to load results.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default PatientProfile;
