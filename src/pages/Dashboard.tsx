import React, { useMemo } from 'react';
import { useCareStore } from '../store/useCareStore';
import { StatCard } from '../components/StatCard';
import { ChartWidget } from '../components/ChartWidget';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  BedDouble, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  Brain,
  ShieldAlert
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { AlertBadge } from '../components/AlertBadge';

// Colors mapped to the clinical instrument palette
const COLORS = ['#0F5C56', '#4FD1C5', '#FF6B5B', '#0F2E2B', '#D8DCD4', '#E28743'];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { patients, appointments, hospitalResources, activityLogs } = useCareStore();

  // Calculate KPIs
  const totalPatientsCount = patients.length;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = useMemo(() => {
    return appointments.filter(app => app.date === todayStr);
  }, [appointments, todayStr]);

  const activeAlertsCount = useMemo(() => {
    return activityLogs.filter(log => log.type === 'alert' && log.severity === 'critical').length;
  }, [activityLogs]);

  const bedOccupancy = useMemo(() => {
    const beds = hospitalResources.filter(res => res.type === 'ICU Bed' || res.name.includes('Bed'));
    if (beds.length === 0) return 0;
    const occupied = beds.filter(b => b.status === 'Occupied').length;
    return Math.round((occupied / beds.length) * 100);
  }, [hospitalResources]);

  // Department distribution
  const deptData = useMemo(() => {
    const counts = patients.reduce((acc, p) => {
      acc[p.department] = (acc[p.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({
      name,
      value
    }));
  }, [patients]);

  // Admission trends (last 7 days)
  const intakeData = [
    { day: 'Mon', Admissions: 8, Discharges: 6 },
    { day: 'Tue', Admissions: 14, Discharges: 10 },
    { day: 'Wed', Admissions: 11, Discharges: 9 },
    { day: 'Thu', Admissions: 18, Discharges: 13 },
    { day: 'Fri', Admissions: 22, Discharges: 15 },
    { day: 'Sat', Admissions: 15, Discharges: 18 },
    { day: 'Sun', Admissions: 10, Discharges: 8 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Schematic Welcome block */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-white border border-grid rounded-lg p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <span className="text-xs bg-teal/10 text-teal font-bold px-3 py-1 rounded uppercase tracking-wider inline-block font-display">
              Dr. John Doe • Internal Medicine
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-ink leading-tight font-display">
              Hospital Clinical Analytics Dashboard
            </h1>
            <p className="text-ink/80 text-sm md:text-base leading-relaxed max-w-lg">
              Observe real-time telemetry inputs, allocate critical resources, and track chronological treatment timelines across departments using AI-prognosed predictive risk indicators.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link to="/scheduler">
              <button className="px-5 py-2.5 bg-teal hover:bg-teal/90 text-paper text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer font-display">
                Schedule Appointment
              </button>
            </Link>
            <Link to="/patients">
              <button className="px-5 py-2.5 bg-white border border-grid text-ink hover:bg-paper text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer font-display">
                View Patient Directory
              </button>
            </Link>
          </div>
        </div>

        {/* Flat Clinical Network Schematic Grid */}
        <div className="lg:col-span-5 bg-white border border-grid rounded-lg overflow-hidden relative flex flex-col justify-between p-6 min-h-[300px] shadow-sm grid-bg">
          <div>
            <span className="text-xs text-ink/50 font-bold block font-display tracking-widest">CARE NETWORK SCHEMATIC</span>
            <span className="text-[10px] text-teal flex items-center font-bold font-mono mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-teal mr-1"></span>
              ACTIVE STREAM
            </span>
          </div>
          
          {/* Schematic SVG Vector design */}
          <div className="w-full flex-1 flex items-center justify-center py-4">
            <svg className="w-full h-36 text-grid" viewBox="0 0 300 120" fill="none" stroke="currentColor">
              <g strokeWidth="1" strokeDasharray="3 3">
                <line x1="0" y1="20" x2="300" y2="20" />
                <line x1="0" y1="60" x2="300" y2="60" />
                <line x1="0" y1="100" x2="300" y2="100" />
                <line x1="60" y1="0" x2="60" y2="120" />
                <line x1="150" y1="0" x2="150" y2="120" />
                <line x1="240" y1="0" x2="240" y2="120" />
              </g>
              <g strokeWidth="1.5">
                {/* Node Circles */}
                <circle cx="60" cy="60" r="4" className="fill-teal stroke-ink" />
                <circle cx="150" cy="20" r="4" className="fill-teal stroke-ink" />
                <circle cx="150" cy="100" r="4" className="fill-coral stroke-ink" strokeWidth="2" />
                <circle cx="240" cy="60" r="4" className="fill-cyan stroke-ink" />
                {/* Connecting Lines */}
                <path d="M 60 60 L 150 20 L 240 60" className="stroke-teal" fill="none" />
                <path d="M 60 60 L 150 100 L 240 60" className="stroke-coral" strokeDasharray="2 2" fill="none" />
                <path d="M 150 20 L 150 100" className="stroke-cyan" fill="none" />
              </g>
            </svg>
          </div>

          <div className="flex items-center justify-between text-[9px] text-ink/65 font-mono border-t border-grid pt-3">
            <span>NODES: 04 ACTIVE</span>
            <span>ERROR RATIO: 0.00%</span>
            <span>SYSTEM: NOMINAL</span>
          </div>
        </div>
      </section>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Patients"
          value={totalPatientsCount}
          icon={<Users className="w-5 h-5" />}
          change="+4%"
          changeType="increase"
          description="vs last week"
          glowColor="blue"
        />
        <StatCard
          title="Today's Bookings"
          value={todayAppointments.length}
          icon={<Calendar className="w-5 h-5" />}
          change="+12%"
          changeType="increase"
          description="vs average"
          glowColor="teal"
        />
        <StatCard
          title="ICU Bed Occupancy"
          value={`${bedOccupancy}%`}
          icon={<BedDouble className="w-5 h-5" />}
          change="+3%"
          changeType="increase"
          description="intensive resources"
          glowColor="green"
        />
        <StatCard
          title="Critical Alerts"
          value={activeAlertsCount}
          icon={<AlertTriangle className="w-5 h-5" />}
          change={activeAlertsCount > 2 ? "+25%" : "0%"}
          changeType={activeAlertsCount > 2 ? "decrease" : "neutral"}
          description="immediate response"
          glowColor="red"
        />
      </section>

      {/* Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Admission Trends Area Chart */}
        <ChartWidget 
          title="Intake Analytics" 
          description="Comparison of admissions vs discharges over the last week"
          className="lg:col-span-8"
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={intakeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="var(--color-grid)" />
              <XAxis dataKey="day" stroke="var(--color-ink)" opacity={0.6} fontSize={10} fontStyle="normal" />
              <YAxis stroke="var(--color-ink)" opacity={0.6} fontSize={10} />
              <Tooltip />
              <Area type="monotone" dataKey="Admissions" stroke="#0F5C56" fill="#0F5C56" fillOpacity={0.06} strokeWidth={2} />
              <Area type="monotone" dataKey="Discharges" stroke="#4FD1C5" fill="#4FD1C5" fillOpacity={0.06} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartWidget>

        {/* Department Distribution Donut Chart */}
        <ChartWidget 
          title="Patient Allocation" 
          description="Distribution of current patients across major clinical wards"
          className="lg:col-span-4"
        >
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={deptData}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {deptData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-[10px] text-ink font-semibold font-display">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartWidget>
      </section>

      {/* Feed & Insights grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity Ticker */}
        <div className="lg:col-span-7 bg-white border border-grid rounded-lg p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-grid pb-3">
            <h4 className="text-base font-semibold text-ink font-display">Live Activity Logs</h4>
            <Link to="/monitoring" className="text-xs text-teal hover:text-teal/80 flex items-center hover:underline font-display">
              Telemetries Feed <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {activityLogs.slice(0, 5).map((log) => (
              <div 
                key={log.id} 
                className="flex items-start justify-between p-3.5 rounded-lg bg-paper border border-grid hover:border-teal transition-colors cursor-pointer"
                onClick={() => log.patientId && navigate(`/patients/${log.patientId}`)}
              >
                <div className="space-y-1 text-left flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-ink/60 font-semibold font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                    <AlertBadge status={log.severity} className="text-[9px] scale-90" />
                  </div>
                  <p className="text-xs text-ink/85 font-medium">{log.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Prognostic Insights Panel */}
        <div className="lg:col-span-5 bg-white border border-grid rounded-lg p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-grid pb-3">
            <h4 className="text-base font-semibold text-ink flex items-center font-display">
              <Brain className="w-5 h-5 mr-2 text-teal" />
              CareScope AI Insights
            </h4>
            <Link to="/insights" className="text-xs text-teal hover:text-teal/80 flex items-center hover:underline font-display">
              Deep Forecasts <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-teal/5 border border-teal/20 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-teal shrink-0 mt-0.5" />
              <div className="text-left">
                <span className="text-xs font-bold text-ink font-display">ICU Capacity Advisory</span>
                <p className="text-[11px] text-ink/75 mt-1 leading-normal">
                  ICU occupancy is currently at {bedOccupancy}%. Preemptive discharge assessments are advised for stable patients in ICU-Bed 11 to reserve resource margins.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-cyan/10 border border-cyan/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-teal shrink-0 mt-0.5" />
              <div className="text-left">
                <span className="text-xs font-bold text-ink font-display">Oncology Outlier Alert</span>
                <p className="text-[11px] text-ink/75 mt-1 leading-normal font-medium">
                  Low platelet counts identified in Oncology cohort (ref: Sarah Jenkins). Monitor CBC blood chemistry before next infusion cycle.
                </p>
              </div>
            </div>
            
            <div className="p-3 text-center bg-paper rounded-lg border border-grid">
              <span className="text-[10px] text-ink/65 italic font-mono">
                AI clinical analytics are based on local data models. Correlate with physical assessments.
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Dashboard;
