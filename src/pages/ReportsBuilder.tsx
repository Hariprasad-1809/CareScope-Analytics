import React, { useState, useMemo } from 'react';
import { useCareStore } from '../store/useCareStore';
import { Button } from '../components/ui/Button';
import { ChartWidget } from '../components/ChartWidget';
import { AlertBadge } from '../components/AlertBadge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, CartesianGrid } from 'recharts';
import { FileSpreadsheet, Loader2, Download, Printer, Filter, Database, Check } from 'lucide-react';

export const ReportsBuilder: React.FC = () => {
  const { patients } = useCareStore();

  // Query state
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedCohort, setSelectedCohort] = useState('All');
  const [chartType, setChartType] = useState<'Bar' | 'Line' | 'Area'>('Bar');

  // Generating state
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Filtered data according to query criteria
  const queryResults = useMemo(() => {
    return patients.filter((patient) => {
      // Dept Match
      const matchDept = selectedDept === 'All' || patient.department === selectedDept;

      // Cohort Match
      let matchCohort = true;
      if (selectedCohort === 'Pediatrics') matchCohort = patient.age < 18;
      else if (selectedCohort === 'Adults') matchCohort = patient.age >= 18 && patient.age < 65;
      else if (selectedCohort === 'Seniors') matchCohort = patient.age >= 65;

      return matchDept && matchCohort;
    });
  }, [patients, selectedDept, selectedCohort, hasGenerated]);

  // Data aggregation for reports charts
  const aggregatedChartData = useMemo(() => {
    const statusCounts = queryResults.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      'Patient Count': count
    }));
  }, [queryResults]);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasGenerated(true);
    }, 1000);
  };

  const handleExport = (_format: 'PDF' | 'CSV') => {
    setIsDownloading(true);
    setDownloadSuccess(false);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 border-b border-grid pb-4">
        <div>
          <h2 className="text-2xl font-bold text-ink tracking-wide flex items-center font-display">
            <FileSpreadsheet className="w-6 h-6 mr-2 text-teal" />
            Query & Report Builder
          </h2>
          <p className="text-xs text-ink/75 mt-1">
            Build custom datasets, generate analytics visualizations, and export reports.
          </p>
        </div>
      </div>

      {/* Control Panel Query Filters */}
      <section className="bg-white border border-grid rounded-lg p-5 flex flex-col md:flex-row gap-5 items-end justify-between shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1 w-full">
          {/* Department Select */}
          <div className="flex flex-col space-y-1.5 text-left">
            <span className="text-[10px] font-bold text-ink/65 uppercase tracking-widest pl-0.5 font-display">Clinical Department</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-paper border border-grid rounded-lg p-2 text-xs text-ink focus:outline-none font-mono"
            >
              <option value="All">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Oncology">Oncology</option>
              <option value="ICU">ICU</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Neurology">Neurology</option>
              <option value="Emergency">Emergency</option>
              <option value="General">General</option>
            </select>
          </div>

          {/* Patient Cohort Select */}
          <div className="flex flex-col space-y-1.5 text-left">
            <span className="text-[10px] font-bold text-ink/65 uppercase tracking-widest pl-0.5 font-display">Demographic Cohort</span>
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              className="w-full bg-paper border border-grid rounded-lg p-2 text-xs text-ink focus:outline-none font-mono"
            >
              <option value="All">All Age Cohorts</option>
              <option value="Pediatrics">Pediatrics (&lt;18)</option>
              <option value="Adults">Adults (18-64)</option>
              <option value="Seniors">Seniors (65+)</option>
            </select>
          </div>

          {/* Chart visual format */}
          <div className="flex flex-col space-y-1.5 text-left">
            <span className="text-[10px] font-bold text-ink/65 uppercase tracking-widest pl-0.5 font-display">Visualization Type</span>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as any)}
              className="w-full bg-paper border border-grid rounded-lg p-2 text-xs text-ink focus:outline-none font-mono"
            >
              <option value="Bar">Bar Chart (Admissions)</option>
              <option value="Line">Line Chart (Intake)</option>
              <option value="Area">Area Chart (Filled)</option>
            </select>
          </div>
        </div>

        {/* Generate Trigger */}
        <Button 
          onClick={handleGenerateReport} 
          disabled={isGenerating} 
          variant="primary"
          className="w-full md:w-auto text-xs shrink-0 select-none"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              Compiling...
            </>
          ) : (
            <>
              <Filter className="w-4 h-4 mr-1.5" />
              Generate Analytics
            </>
          )}
        </Button>
      </section>

      {/* Report Workspace Display */}
      {hasGenerated && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Dynamic Generated Chart Panel */}
          <div className="lg:col-span-8 space-y-6">
            <ChartWidget
              title="Query Cohort Analytics: Status Allocations"
              description={`Representing ${queryResults.length} matching records inside the database`}
              actions={
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => handleExport('CSV')} 
                    disabled={isDownloading} 
                    variant="secondary" 
                    size="sm"
                    className="text-xs select-none"
                  >
                    {isDownloading ? (
                      <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                    ) : downloadSuccess ? (
                      <Check className="w-3.5 h-3.5 mr-1 text-teal" />
                    ) : (
                      <Download className="w-3.5 h-3.5 mr-1" />
                    )}
                    Export CSV
                  </Button>
                  <Button 
                    onClick={() => handleExport('PDF')} 
                    disabled={isDownloading} 
                    variant="secondary" 
                    size="sm"
                    className="text-xs select-none"
                  >
                    <Printer className="w-3.5 h-3.5 mr-1" /> Print Report
                  </Button>
                </div>
              }
            >
              {aggregatedChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  {chartType === 'Bar' ? (
                    <BarChart data={aggregatedChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="2 2" stroke="var(--color-grid)" />
                      <XAxis dataKey="status" stroke="var(--color-ink)" opacity={0.6} fontSize={10} />
                      <YAxis stroke="var(--color-ink)" opacity={0.6} fontSize={10} />
                      <Tooltip />
                      <Bar dataKey="Patient Count" fill="#0F5C56" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  ) : chartType === 'Line' ? (
                    <LineChart data={aggregatedChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="2 2" stroke="var(--color-grid)" />
                      <XAxis dataKey="status" stroke="var(--color-ink)" opacity={0.6} fontSize={10} />
                      <YAxis stroke="var(--color-ink)" opacity={0.6} fontSize={10} />
                      <Tooltip />
                      <Line type="monotone" dataKey="Patient Count" stroke="#0F5C56" strokeWidth={2} />
                    </LineChart>
                  ) : (
                    <AreaChart data={aggregatedChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="2 2" stroke="var(--color-grid)" />
                      <XAxis dataKey="status" stroke="var(--color-ink)" opacity={0.6} fontSize={10} />
                      <YAxis stroke="var(--color-ink)" opacity={0.6} fontSize={10} />
                      <Tooltip />
                      <Area type="monotone" dataKey="Patient Count" stroke="#0F5C56" fill="#0F5C56" fillOpacity={0.06} strokeWidth={2} />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center py-20 text-ink/60 text-xs font-mono">
                  No records match selected criteria.
                </div>
              )}
            </ChartWidget>

            {/* Simulated CSV/PDF download indicator overlay alert */}
            {downloadSuccess && (
              <div className="p-3 bg-teal/10 border border-teal/20 text-teal rounded-lg text-xs flex items-center space-x-2">
                <Check className="w-4 h-4 shrink-0" />
                <span className="font-mono">Success: Custom query compile generated. Export download initiated successfully!</span>
              </div>
            )}
          </div>

          {/* Table summary of matched census records */}
          <div className="lg:col-span-4 bg-white border border-grid rounded-lg p-5 flex flex-col justify-between shadow-sm">
            <div>
              <h5 className="text-sm font-semibold text-ink mb-2 flex items-center font-display">
                <Database className="w-4 h-4 mr-1.5 text-teal" />
                Report Census Data
              </h5>
              <span className="text-[10px] text-ink/65 font-bold block uppercase border-b border-grid pb-2 mb-3 font-mono">
                Matching Database Records
              </span>
              
              <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1 text-xs">
                {queryResults.slice(0, 8).map((pat) => (
                  <div key={pat.id} className="flex justify-between items-center p-2 bg-paper border border-grid rounded">
                    <div className="text-left font-display">
                      <span className="font-semibold text-ink">{pat.name}</span>
                      <span className="text-[9px] text-ink/60 block font-mono">Age {pat.age} • Bed: {pat.bedNumber || 'Unallocated'}</span>
                    </div>
                    <AlertBadge status={pat.status} className="scale-80" />
                  </div>
                ))}
                {queryResults.length === 0 && (
                  <p className="text-center text-ink/60 italic py-8 font-mono">No records match filters.</p>
                )}
              </div>
            </div>

            {queryResults.length > 8 && (
              <span className="text-[10px] text-ink/60 italic mt-3 text-center block font-mono">
                Showing top 8 of {queryResults.length} records. Export full report for details.
              </span>
            )}
          </div>
        </section>
      )}
    </div>
  );
};
export default ReportsBuilder;
