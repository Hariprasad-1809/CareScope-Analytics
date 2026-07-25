export interface Vitals {
  heartRate: number;
  bloodPressure: string;
  oxygenSat: number;
  temperature: number;
  respiratoryRate: number;
  timestamp: string;
}

export interface VitalsHistoryItem {
  timestamp: string;
  heartRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  oxygenSat: number;
  temperature: number;
  respiratoryRate: number;
}

export interface MedicalHistoryItem {
  id: string;
  date: string;
  eventType: 'Admission' | 'Discharge' | 'Surgery' | 'Diagnosis' | 'Treatment' | 'Medication Change';
  title: string;
  description: string;
  doctor: string;
  status: 'Completed' | 'Ongoing' | 'Scheduled';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Discontinued';
}

export interface DiagnosticReportShort {
  id: string;
  title: string;
  date: string;
  status: 'Final' | 'Pending';
}

export interface TestResultItem {
  parameter: string;
  value: number;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'High' | 'Low';
  minNormal: number;
  maxNormal: number;
}

export interface DiagnosticReport {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  testType: string;
  date: string;
  doctor: string;
  department: string;
  status: 'Final' | 'Pending';
  findings: string;
  notes: string;
  results: TestResultItem[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodType: string;
  phone: string;
  email: string;
  address: string;
  allergies: string[];
  department: 'Cardiology' | 'Oncology' | 'ICU' | 'Pediatrics' | 'Neurology' | 'Emergency' | 'General';
  status: 'Stable' | 'Critical' | 'Recovering';
  lastVisit: string;
  admissionDate: string;
  bedNumber: string;
  attendingPhysician: string;
  vitals: Vitals;
  vitalsHistory: VitalsHistoryItem[];
  medicalHistory: MedicalHistoryItem[];
  medications: Medication[];
  reports: DiagnosticReportShort[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // in minutes
  department: string;
  type: 'Consultation' | 'Surgery' | 'Follow-up' | 'Therapy' | 'Diagnostic';
  doctor: string;
  resourceId: string;
  notes: string;
}

export interface HospitalResource {
  id: string;
  name: string;
  type: 'Room' | 'ICU Bed' | 'Ventilator' | 'ECG Machine' | 'Staff';
  status: 'Available' | 'Occupied' | 'Maintenance';
  department: string;
  assignedTo?: string; // patient name or ID
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'admission' | 'discharge' | 'alert' | 'appointment' | 'medication' | 'report';
  patientId?: string;
  patientName?: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}
