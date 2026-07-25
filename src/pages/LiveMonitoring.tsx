import React, { useEffect, useState, useMemo } from 'react';
import { useCareStore } from '../store/useCareStore';
import { AlertBadge } from '../components/AlertBadge';
import { Heart, Activity, Radio, AlertOctagon, ShieldCheck, Thermometer } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { cn } from '../utils/cn';

export const LiveMonitoring: React.FC = () => {
  const { patients, hospitalResources, activityLogs, updatePatientVitals } = useCareStore();
  const [selectedMonitorId, setSelectedMonitorId] = useState('PT-1001'); // Default to Robert Chen

  // Fetch targeted patient
  const targetPatient = useMemo(() => {
    return patients.find(p => p.id === selectedMonitorId) || patients[0];
  }, [patients, selectedMonitorId]);

  // Telemetry simulator (Ticks every 3 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      patients.forEach(pat => {
        if (pat.status === 'Critical' || pat.department === 'ICU') {
          const hrDelta = Math.floor(Math.random() * 8) - 4;
          const o2Delta = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          const sysDelta = Math.floor(Math.random() * 6) - 3;
          const diaDelta = Math.floor(Math.random() * 4) - 2;

          const bpParts = pat.vitals.bloodPressure.split('/');
          const nextSys = Math.max(80, Math.min(190, parseInt(bpParts[0]) + sysDelta));
          const nextDia = Math.max(50, Math.min(110, parseInt(bpParts[1]) + diaDelta));

          const nextHr = Math.max(40, Math.min(160, pat.vitals.heartRate + hrDelta));
          const nextO2 = Math.max(85, Math.min(100, pat.vitals.oxygenSat + o2Delta));
          const nextTemp = parseFloat((pat.vitals.temperature + (Math.random() * 0.4 - 0.2)).toFixed(1));

          updatePatientVitals(pat.id, {
            heartRate: nextHr,
            bloodPressure: `${nextSys}/${nextDia}`,
            oxygenSat: nextO2,
            temperature: nextTemp,
            respiratoryRate: Math.max(10, Math.min(30, pat.vitals.respiratoryRate + (Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0))),
            timestamp: new Date().toISOString()
          });
        }
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [patients, updatePatientVitals]);

  // Format vitals history for waveforms
  const liveChartData = useMemo(() => {
    if (!targetPatient) return [];
    return targetPatient.vitalsHistory.map((item, idx) => ({
      index: idx,
      time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      'Heart Rate': item.heartRate,
      'Oxygen Sat (SpO2)': item.oxygenSat,
      'Systolic BP': item.bloodPressureSystolic,
      'Diastolic BP': item.bloodPressureDiastolic
    }));
  }, [targetPatient]);

  // ICU Beds counts
  const bedStats = useMemo(() => {
    const beds = hospitalResources.filter(r => r.type === 'ICU Bed');
    const occupied = beds.filter(b => b.status === 'Occupied').length;
    return {
      total: beds.length,
      occupied,
      available: beds.length - occupied
    };
  }, [hospitalResources]);

  // Vitals threshold classes
  const getHrColorClass = (hr: number) => {
    if (hr > 115 || hr < 50) return 'text-coral';
    if (hr > 100 || hr < 60) return 'text-amber-600';
    return 'text-teal';
  };

  const getSpO2ColorClass = (o2: number) => {
    if (o2 < 91) return 'text-coral';
    if (o2 < 94) return 'text-amber-600';
    return 'text-teal';
  };

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 border-b border-grid pb-4">
        <div>
          <h2 className="text-2xl font-bold text-ink tracking-wide flex items-center font-display">
            <Radio className="w-6 h-6 mr-2 text-coral" />
            Live ICU Telemetry Panel
          </h2>
          <p className="text-xs text-ink/75 mt-1">
            Simulated live vitals transmission (updating every 3 seconds). Select patient to isolate feed.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Waveform Monitor & Stats */}
        <section className="lg:col-span-8 space-y-6 flex flex-col justify-between">
          {/* Active wave monitor screen */}
          <div className="bg-white border border-grid rounded-lg p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between border-b border-grid pb-3 mb-5 gap-3">
              <div className="flex items-center space-x-3">
                <div className="h-3.5 w-3.5 rounded-full bg-coral" />
                <h4 className="font-bold text-base text-ink font-display">Isolate: {targetPatient.name} ({targetPatient.id})</h4>
                <AlertBadge status={targetPatient.status} className="scale-90" />
              </div>
              <span className="text-[10px] text-ink/60 font-bold uppercase tracking-widest font-mono">
                Bed allocation: {targetPatient.bedNumber || 'ER Trauma 2'}
              </span>
            </div>

            {/* Numerical metrics readout */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-paper border border-grid p-3 rounded-lg flex items-center space-x-3">
                <Heart className="w-8 h-8 text-coral shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-ink/65 block font-display">ECG Heart Rate</span>
                  <h3 className={cn("text-2xl font-bold mt-0.5 font-mono", getHrColorClass(targetPatient.vitals.heartRate))}>
                    {targetPatient.vitals.heartRate} <span className="text-xs text-ink/60 font-semibold font-display">bpm</span>
                  </h3>
                </div>
              </div>

              <div className="bg-paper border border-grid p-3 rounded-lg flex items-center space-x-3">
                <Activity className="w-8 h-8 text-teal shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-ink/65 block font-display">Arterial BP</span>
                  <h3 className="text-2xl font-bold text-ink mt-0.5 font-mono">
                    {targetPatient.vitals.bloodPressure} <span className="text-[10px] text-ink/60 font-semibold font-display">mmHg</span>
                  </h3>
                </div>
              </div>

              <div className="bg-paper border border-grid p-3 rounded-lg flex items-center space-x-3">
                <Activity className="w-8 h-8 text-teal shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-ink/65 block font-display">SpO2 Pulse Ox</span>
                  <h3 className={cn("text-2xl font-bold mt-0.5 font-mono", getSpO2ColorClass(targetPatient.vitals.oxygenSat))}>
                    {targetPatient.vitals.oxygenSat}%
                  </h3>
                </div>
              </div>

              <div className="bg-paper border border-grid p-3 rounded-lg flex items-center space-x-3">
                <Thermometer className="w-8 h-8 text-teal shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-ink/65 block font-display">Core Temp</span>
                  <h3 className="text-2xl font-bold text-ink mt-0.5 font-mono">
                    {targetPatient.vitals.temperature}°F
                  </h3>
                </div>
              </div>
            </div>

            {/* Live Chart Visualizer */}
            <div className="space-y-4">
              <div className="h-[180px] w-full">
                <span className="text-[10px] font-bold text-ink/65 uppercase tracking-widest mb-1.5 block font-display">Live ECG Pulse Waveform (Heart Rate)</span>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={liveChartData}>
                    <CartesianGrid strokeDasharray="2 2" stroke="var(--color-grid)" />
                    <XAxis dataKey="time" stroke="var(--color-ink)" opacity={0.6} fontSize={8} />
                    <YAxis stroke="var(--color-ink)" opacity={0.6} fontSize={8} domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip />
                    <Area type="monotone" dataKey="Heart Rate" stroke="#FF6B5B" strokeWidth={2} fill="#FF6B5B" fillOpacity={0.06} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="h-[180px] w-full mt-4">
                <span className="text-[10px] font-bold text-ink/65 uppercase tracking-widest mb-1.5 block font-display">Live SpO2 Pulse Oxygen Waveform</span>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={liveChartData}>
                    <CartesianGrid strokeDasharray="2 2" stroke="var(--color-grid)" />
                    <XAxis dataKey="time" stroke="var(--color-ink)" opacity={0.6} fontSize={8} />
                    <YAxis stroke="var(--color-ink)" opacity={0.6} fontSize={8} domain={[80, 101]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="Oxygen Sat (SpO2)" stroke="#0F5C56" strokeWidth={2} fill="#0F5C56" fillOpacity={0.06} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: ICU Beds and Telemetry listings */}
        <section className="lg:col-span-4 space-y-6 flex flex-col">
          {/* ICU Bed Capacity Gauge */}
          <div className="bg-white border border-grid rounded-lg p-5 shadow-sm text-left">
            <h5 className="text-sm font-semibold text-ink mb-4 border-b border-grid pb-2 font-display">ICU Bed Capacities</h5>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-paper border border-grid rounded-lg">
                <span className="text-[9px] text-ink/65 font-bold block uppercase font-display">Occupied</span>
                <span className="text-xl font-bold text-coral font-mono">{bedStats.occupied}</span>
              </div>
              <div className="p-2 bg-paper border border-grid rounded-lg">
                <span className="text-[9px] text-ink/65 font-bold block uppercase font-display">Available</span>
                <span className="text-xl font-bold text-teal font-mono">{bedStats.available}</span>
              </div>
              <div className="p-2 bg-paper border border-grid rounded-lg flex flex-col justify-center">
                <span className="text-[9px] text-ink/65 font-bold block uppercase font-display">Cap %</span>
                <span className="text-sm font-bold text-ink mt-0.5 font-mono">
                  {Math.round((bedStats.occupied / bedStats.total) * 100)}%
                </span>
              </div>
            </div>
            {/* Visual Gauge Bar */}
            <div className="h-2.5 w-full bg-paper border border-grid rounded-full overflow-hidden mt-4">
              <div 
                style={{ width: `${(bedStats.occupied / bedStats.total) * 100}%` }}
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  (bedStats.occupied / bedStats.total) > 0.8 ? "bg-coral" : "bg-teal"
                )}
              />
            </div>
          </div>

          {/* ICU Critical Active Logs ticker */}
          <div className="bg-white border border-grid rounded-lg p-5 flex-1 shadow-sm flex flex-col justify-between">
            <h5 className="text-sm font-semibold text-ink border-b border-grid pb-2 font-display">Ward Alarms & Notifications</h5>
            
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[220px] pr-1">
              {activityLogs
                .filter(log => log.severity === 'critical' || log.severity === 'high')
                .slice(0, 4)
                .map((log) => (
                  <div key={log.id} className="p-3 bg-coral/5 border border-coral/20 rounded-lg flex items-start space-x-2.5 text-xs text-left">
                    <AlertOctagon className="w-4 h-4 text-coral shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] text-ink/60 block font-mono">
                        {new Date(log.timestamp).toLocaleTimeString()} • {log.patientName}
                      </span>
                      <p className="text-ink font-medium leading-normal mt-0.5">{log.message}</p>
                    </div>
                  </div>
                ))}
              {activityLogs.filter(log => log.severity === 'critical' || log.severity === 'high').length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-ink/60 text-xs">
                  <ShieldCheck className="w-8 h-8 text-ink/40 mb-2" />
                  No active telemetry warnings.
                </div>
              )}
            </div>

            {/* List of ICU patients to click/isolate */}
            <div className="border-t border-grid pt-4 mt-4">
              <span className="text-[10px] text-ink/60 uppercase font-bold tracking-widest pl-1 block mb-2 font-display">ICU Census Patients</span>
              <div className="flex flex-wrap gap-2">
                {patients
                  .filter(p => p.status === 'Critical' || p.department === 'ICU')
                  .slice(0, 4)
                  .map(p => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedMonitorId(p.id)}
                      className={cn(
                        "px-2.5 py-1 rounded border text-[10px] font-bold cursor-pointer transition-colors font-mono",
                        selectedMonitorId === p.id 
                          ? "bg-coral/10 border-coral text-coral"
                          : "bg-paper border-grid text-ink/75 hover:text-ink"
                      )}
                    >
                      {p.name.split(' ').pop()} ({p.id})
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
export default LiveMonitoring;
