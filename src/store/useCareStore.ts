import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Patient, DiagnosticReport, Appointment, HospitalResource, ActivityLog } from '../types';
import { mockPatients, mockDiagnosticReports, mockAppointments, mockHospitalResources, mockActivityLogs } from '../data/mockData';

interface CareState {
  patients: Patient[];
  diagnosticReports: DiagnosticReport[];
  appointments: Appointment[];
  hospitalResources: HospitalResource[];
  activityLogs: ActivityLog[];
  theme: 'dark' | 'light';
  searchQuery: string;
  selectedDepartment: string;
  selectedStatus: string;
  
  // Theme Action
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  
  // Appointment Actions
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
  
  // Vitals Actions (for Live Telemetry)
  updatePatientVitals: (patientId: string, vitals: Patient['vitals']) => void;
  
  // Activity Log Actions
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  clearActivityLogs: () => void;
  
  // Filtering Actions
  setSearchQuery: (query: string) => void;
  setSelectedDepartment: (dept: string) => void;
  setSelectedStatus: (status: string) => void;
  
  // Patient Actions
  updatePatientStatus: (patientId: string, status: Patient['status']) => void;
}

export const useCareStore = create<CareState>()(
  persist(
    (set, get) => ({
      patients: mockPatients,
      diagnosticReports: mockDiagnosticReports,
      appointments: mockAppointments,
      hospitalResources: mockHospitalResources,
      activityLogs: mockActivityLogs,
      theme: 'dark',
      searchQuery: '',
      selectedDepartment: 'All',
      selectedStatus: 'All',
      
      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        if (nextTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme: nextTheme });
      },
      
      setTheme: (theme) => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme });
      },
      
      addAppointment: (app) => {
        const newApp: Appointment = {
          ...app,
          id: `APP-${Date.now()}`
        };
        
        // Log activity
        const newLog: ActivityLog = {
          id: `ACT-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'appointment',
          patientId: app.patientId,
          patientName: app.patientName,
          message: `Scheduled ${app.type} for ${app.patientName} with ${app.doctor} on ${app.date} at ${app.time}.`,
          severity: 'low'
        };

        // Update resource status if matching
        const updatedResources = get().hospitalResources.map(res => {
          if (res.id === app.resourceId) {
            return { ...res, status: 'Occupied' as const, assignedTo: app.patientName };
          }
          return res;
        });
        
        set((state) => ({
          appointments: [...state.appointments, newApp],
          activityLogs: [newLog, ...state.activityLogs].slice(0, 100), // Cap logs at 100
          hospitalResources: updatedResources
        }));
      },
      
      updateAppointment: (updatedApp) => {
        set((state) => ({
          appointments: state.appointments.map((app) => 
            app.id === updatedApp.id ? updatedApp : app
          )
        }));
      },
      
      deleteAppointment: (id) => {
        const app = get().appointments.find(a => a.id === id);
        
        const newLog: ActivityLog = {
          id: `ACT-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'appointment',
          message: app 
            ? `Cancelled appointment for ${app.patientName} on ${app.date} at ${app.time}.`
            : `Cancelled appointment (ID: ${id}).`,
          severity: 'medium'
        };

        // Release resource if applicable
        let updatedResources = get().hospitalResources;
        if (app) {
          updatedResources = get().hospitalResources.map(res => {
            if (res.id === app.resourceId && res.status === 'Occupied') {
              return { ...res, status: 'Available' as const, assignedTo: undefined };
            }
            return res;
          });
        }
        
        set((state) => ({
          appointments: state.appointments.filter((app) => app.id !== id),
          activityLogs: [newLog, ...state.activityLogs].slice(0, 100),
          hospitalResources: updatedResources
        }));
      },
      
      updatePatientVitals: (patientId, newVitals) => {
        set((state) => {
          const updatedPatients = state.patients.map((pat) => {
            if (pat.id === patientId) {
              const systolic = parseInt(newVitals.bloodPressure.split('/')[0]);
              const diastolic = parseInt(newVitals.bloodPressure.split('/')[1]);
              
              const historyItem = {
                timestamp: new Date().toISOString(),
                heartRate: newVitals.heartRate,
                bloodPressureSystolic: systolic,
                bloodPressureDiastolic: diastolic,
                oxygenSat: newVitals.oxygenSat,
                temperature: newVitals.temperature,
                respiratoryRate: newVitals.respiratoryRate
              };
              
              // Maintain history length of 12
              const updatedHistory = [...pat.vitalsHistory, historyItem].slice(-12);
              
              return {
                ...pat,
                vitals: { ...newVitals, timestamp: new Date().toISOString() },
                vitalsHistory: updatedHistory
              };
            }
            return pat;
          });
          
          // Check if vitals triggers a critical alert log
          const targetPat = state.patients.find(p => p.id === patientId);
          const alertLogs: ActivityLog[] = [];
          
          if (targetPat) {
            const bpSys = parseInt(newVitals.bloodPressure.split('/')[0]);
            
            let message = '';
            let severity: ActivityLog['severity'] = 'low';
            
            if (newVitals.oxygenSat < 90) {
              message = `CRITICAL ALERT: ${targetPat.name}'s SpO2 fell dangerously to ${newVitals.oxygenSat}%.`;
              severity = 'critical';
            } else if (newVitals.heartRate > 120 || newVitals.heartRate < 45) {
              message = `CRITICAL ALERT: ${targetPat.name} is experiencing severe arrhythmia (HR: ${newVitals.heartRate} bpm).`;
              severity = 'critical';
            } else if (bpSys > 170 || bpSys < 85) {
              message = `ALERT: ${targetPat.name} blood pressure abnormal: ${newVitals.bloodPressure} mmHg.`;
              severity = 'high';
            }
            
            if (message) {
              alertLogs.push({
                id: `ACT-ALERT-${Date.now()}`,
                timestamp: new Date().toISOString(),
                type: 'alert',
                patientId,
                patientName: targetPat.name,
                message,
                severity
              });
            }
          }
          
          return {
            patients: updatedPatients,
            activityLogs: alertLogs.length > 0 
              ? [...alertLogs, ...state.activityLogs].slice(0, 100) 
              : state.activityLogs
          };
        });
      },
      
      addActivityLog: (log) => {
        const newLog: ActivityLog = {
          ...log,
          id: `ACT-${Date.now()}`,
          timestamp: new Date().toISOString()
        };
        set((state) => ({
          activityLogs: [newLog, ...state.activityLogs].slice(0, 100)
        }));
      },
      
      clearActivityLogs: () => set({ activityLogs: [] }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedDepartment: (dept) => set({ selectedDepartment: dept }),
      setSelectedStatus: (status) => set({ selectedStatus: status }),
      
      updatePatientStatus: (patientId, newStatus) => {
        const pat = get().patients.find(p => p.id === patientId);
        const newLog: ActivityLog = {
          id: `ACT-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'admission',
          patientId,
          patientName: pat?.name,
          message: `${pat?.name || 'Patient'} status changed to ${newStatus}.`,
          severity: newStatus === 'Critical' ? 'critical' : newStatus === 'Recovering' ? 'low' : 'medium'
        };
        
        set((state) => ({
          patients: state.patients.map((p) => 
            p.id === patientId ? { ...p, status: newStatus } : p
          ),
          activityLogs: [newLog, ...state.activityLogs].slice(0, 100)
        }));
      }
    }),
    {
      name: 'carescope-storage',
      partialize: (state) => ({
        patients: state.patients,
        diagnosticReports: state.diagnosticReports,
        appointments: state.appointments,
        hospitalResources: state.hospitalResources,
        activityLogs: state.activityLogs,
        theme: state.theme
      }),
    }
  )
);
