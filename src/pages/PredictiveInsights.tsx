import React, { useMemo } from 'react';
import { useCareStore } from '../store/useCareStore';
import { ChartWidget } from '../components/ChartWidget';
import { Brain, Cpu } from 'lucide-react';
import { cn } from '../utils/cn';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  AreaChart,
  Area
} from 'recharts';

export const PredictiveInsights: React.FC = () => {
  const { patients } = useCareStore();

  // Calculate mock readmission risks for the top 5 highest-risk patients
  const highRiskCohort = useMemo(() => {
    return patients
      .map(p => {
        let riskScore = 20;
        if (p.status === 'Critical') riskScore += 45;
        if (p.status === 'Recovering') riskScore += 15;
        if (p.age > 65) riskScore += 20;
        if (p.allergies.length > 1) riskScore += 10;
        riskScore += Math.floor((parseInt(p.id.slice(3)) % 10) * 2.5);
        
        return {
          ...p,
          riskScore: Math.min(95, riskScore)
        };
      })
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5);
  }, [patients]);

  // Resource Demand Projections (ICU Bed Capacity forecasting)
  const resourceDemandProjection = [
    { name: 'Week 1', ProjectedDemand: 11, SafeCapacity: 14, TotalBeds: 20 },
    { name: 'Week 2', ProjectedDemand: 16, SafeCapacity: 14, TotalBeds: 20 },
    { name: 'Week 3', ProjectedDemand: 13, SafeCapacity: 14, TotalBeds: 20 },
    { name: 'Week 4', ProjectedDemand: 15, SafeCapacity: 14, TotalBeds: 20 },
    { name: 'Week 5', ProjectedDemand: 10, SafeCapacity: 14, TotalBeds: 20 }
  ];

  // Recovery Rate modeling (Therapy protocol A vs Standard Care)
  const recoveryProjections = [
    { day: 'Day 0', ProtocolA: 10, StandardCare: 10 },
    { day: 'Day 5', ProtocolA: 32, StandardCare: 22 },
    { day: 'Day 10', ProtocolA: 68, StandardCare: 45 },
    { day: 'Day 15', ProtocolA: 89, StandardCare: 68 },
    { day: 'Day 20', ProtocolA: 96, StandardCare: 82 }
  ];

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 border-b border-grid pb-4">
        <div>
          <h2 className="text-2xl font-bold text-ink tracking-wide flex items-center font-display">
            <Brain className="w-6 h-6 mr-2 text-teal" />
            AI Predictive Risk Insights
          </h2>
          <p className="text-xs text-ink/75 mt-1">
            Clinical prognostic modeling. Illustrated ML trends for readmission, recovery, and bed demands.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: High-Risk Readmission cohort */}
        <section className="lg:col-span-5 bg-white border border-grid rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-2 border-b border-grid pb-3 mb-4">
            <h4 className="text-sm font-semibold text-ink flex items-center font-display">
              <Cpu className="w-4 h-4 mr-1.5 text-teal" /> 
              Highest 30-Day Readmission Risks
            </h4>
            <p className="text-[11px] text-ink/70">
              Prognosticated risk score based on vital fluctuations, age demographics, and length of stay.
            </p>
          </div>

          <div className="space-y-4 flex-1">
            {highRiskCohort.map((pat) => (
              <div key={pat.id} className="p-3 bg-paper border border-grid rounded-lg space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <span className="font-semibold text-ink block font-display">{pat.name} ({pat.id})</span>
                    <span className="text-[10px] text-ink/65 font-mono">{pat.department} • Age {pat.age} • Attending: {pat.attendingPhysician}</span>
                  </div>
                  <span className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded font-mono",
                    pat.riskScore > 75 ? 'bg-coral/10 text-coral' : 'bg-grid text-ink'
                  )}>
                    {pat.riskScore}% Risk
                  </span>
                </div>

                {/* Risk Progress Bar */}
                <div className="h-1.5 w-full bg-grid rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${pat.riskScore}%` }}
                    className={cn(
                      "h-full rounded-full",
                      pat.riskScore > 75 ? "bg-coral" : "bg-teal"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-paper rounded-lg border border-grid text-[10px] text-ink/65 italic text-center font-mono">
            Prognostic metrics are purely illustrative and calculated locally. Correlate with physician directives.
          </div>
        </section>

        {/* Right Side: Projections charts */}
        <section className="lg:col-span-7 space-y-6">
          {/* Chart 1: Resource Capacity Forecast */}
          <ChartWidget
            title="ICU Bed Demand Projection"
            description="AI forecast of required ICU bed capacity over the next 5 weeks vs safe thresholds"
          >
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={resourceDemandProjection} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="var(--color-grid)" />
                <XAxis dataKey="name" stroke="var(--color-ink)" opacity={0.6} fontSize={10} />
                <YAxis stroke="var(--color-ink)" opacity={0.6} fontSize={10} />
                <Tooltip />
                <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-[10px] text-ink font-mono">{value}</span>} />
                <Bar dataKey="ProjectedDemand" fill="#0F5C56" name="Projected Bed Needs" barSize={20} radius={[2, 2, 0, 0]} />
                <Line type="monotone" dataKey="SafeCapacity" stroke="#FF6B5B" name="Target Safe Capacity" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                <Line type="monotone" dataKey="TotalBeds" stroke="#0F2E2B" name="Max Total Beds" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartWidget>

          {/* Chart 2: Protocol recovery rate curve */}
          <ChartWidget
            title="Patient Recovery Curve Modeler"
            description="Efficacy projection: Target Therapy Protocol A vs Standard Care cycles"
          >
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={recoveryProjections} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 2" stroke="var(--color-grid)" />
                <XAxis dataKey="day" stroke="var(--color-ink)" opacity={0.6} fontSize={10} />
                <YAxis stroke="var(--color-ink)" opacity={0.6} fontSize={10} />
                <Tooltip />
                <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-[10px] text-ink font-mono">{value}</span>} />
                <Area type="monotone" dataKey="ProtocolA" stroke="#0F5C56" name="Protocol A Efficacy" strokeWidth={2} fill="#0F5C56" fillOpacity={0.06} />
                <Line type="monotone" dataKey="StandardCare" stroke="#D8DCD4" name="Standard Regimen Efficacy" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartWidget>
        </section>
      </div>
    </div>
  );
};
export default PredictiveInsights;
