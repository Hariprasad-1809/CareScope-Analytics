import type { Patient, DiagnosticReport, Appointment, HospitalResource, ActivityLog, MedicalHistoryItem, Medication, DiagnosticReportShort } from '../types';

// Helper to generate dates relative to current time
const getPastDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

const getFutureDate = (daysAhead: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
};

// 1. Detailed Diagnostic Reports for Key Patients
export const mockDiagnosticReports: DiagnosticReport[] = [
  {
    id: "REP-2001",
    patientId: "PT-1001",
    patientName: "Robert Chen",
    title: "12-Lead Electrocardiogram (ECG)",
    testType: "Electrocardiogram",
    date: getPastDate(1),
    doctor: "Dr. Allison Cameron",
    department: "Cardiology",
    status: "Final",
    findings: "Sinus tachycardia with occasional premature ventricular contractions (PVCs). Mild ST-segment depression in anterolateral leads (V4-V6), suggestive of subendocardial ischemia. No acute ST-elevation myocardial infarction (STEMI) patterns noted.",
    notes: "Patient complains of chest pressure during episodes. Recommended continuous telemetry monitoring and repeat cardiac enzymes. Beta-blocker dosage adjusted.",
    results: [
      { parameter: "Heart Rate", value: 104, unit: "bpm", referenceRange: "60 - 100", status: "High", minNormal: 60, maxNormal: 100 },
      { parameter: "PR Interval", value: 162, unit: "ms", referenceRange: "120 - 200", status: "Normal", minNormal: 120, maxNormal: 200 },
      { parameter: "QRS Duration", value: 92, unit: "ms", referenceRange: "80 - 120", status: "Normal", minNormal: 80, maxNormal: 120 },
      { parameter: "QTc Interval", value: 448, unit: "ms", referenceRange: "350 - 450", status: "Normal", minNormal: 350, maxNormal: 450 },
      { parameter: "ST Segment", value: -1.2, unit: "mm", referenceRange: "-0.5 - 0.5", status: "Low", minNormal: -0.5, maxNormal: 0.5 }
    ]
  },
  {
    id: "REP-2002",
    patientId: "PT-1001",
    patientName: "Robert Chen",
    title: "Basic Metabolic Panel (BMP)",
    testType: "Blood Test",
    date: getPastDate(1),
    doctor: "Dr. Allison Cameron",
    department: "Cardiology",
    status: "Final",
    findings: "Electrolytes are within normal limits except for a slightly reduced potassium level. Elevated blood urea nitrogen (BUN) and creatinine indicate mild pre-renal azotemia, likely secondary to diuretic therapy (Furosemide).",
    notes: "Correlate with urine output and blood pressure. Rehydrate moderately, consider potassium supplementation.",
    results: [
      { parameter: "Sodium", value: 138, unit: "mmol/L", referenceRange: "136 - 145", status: "Normal", minNormal: 136, maxNormal: 145 },
      { parameter: "Potassium", value: 3.3, unit: "mmol/L", referenceRange: "3.5 - 5.1", status: "Low", minNormal: 3.5, maxNormal: 5.1 },
      { parameter: "Chloride", value: 101, unit: "mmol/L", referenceRange: "98 - 107", status: "Normal", minNormal: 98, maxNormal: 107 },
      { parameter: "Carbon Dioxide", value: 24, unit: "mmol/L", referenceRange: "22 - 29", status: "Normal", minNormal: 22, maxNormal: 29 },
      { parameter: "BUN", value: 26, unit: "mg/dL", referenceRange: "7 - 20", status: "High", minNormal: 7, maxNormal: 20 },
      { parameter: "Creatinine", value: 1.4, unit: "mg/dL", referenceRange: "0.7 - 1.3", status: "High", minNormal: 0.7, maxNormal: 1.3 },
      { parameter: "Glucose (Fasting)", value: 112, unit: "mg/dL", referenceRange: "70 - 100", status: "High", minNormal: 70, maxNormal: 100 }
    ]
  },
  {
    id: "REP-2003",
    patientId: "PT-1002",
    patientName: "Sarah Jenkins",
    title: "Complete Blood Count (CBC)",
    testType: "Blood Test",
    date: getPastDate(3),
    doctor: "Dr. James Wilson",
    department: "Oncology",
    status: "Final",
    findings: "Significant leukopenia (low white blood cell count) and neutropenia, consistent with chemotherapy-induced bone marrow suppression. Mild anemia present. Platelet count remains within acceptable limits for ongoing treatment.",
    notes: "Hold next cycle if absolute neutrophil count (ANC) drops below 1.0. Advise patient on neutropenic precautions. Prescribe Filgrastim if indicated.",
    results: [
      { parameter: "White Blood Cells (WBC)", value: 2.1, unit: "K/uL", referenceRange: "4.5 - 11.0", status: "Low", minNormal: 4.5, maxNormal: 11.0 },
      { parameter: "Red Blood Cells (RBC)", value: 3.8, unit: "M/uL", referenceRange: "4.2 - 5.4", status: "Low", minNormal: 4.2, maxNormal: 5.4 },
      { parameter: "Hemoglobin", value: 11.2, unit: "g/dL", referenceRange: "12.0 - 16.0", status: "Low", minNormal: 12.0, maxNormal: 16.0 },
      { parameter: "Hematocrit", value: 33.5, unit: "%", referenceRange: "37.0 - 47.0", status: "Low", minNormal: 37, maxNormal: 47 },
      { parameter: "Platelets", value: 165, unit: "K/uL", referenceRange: "150 - 450", status: "Normal", minNormal: 150, maxNormal: 450 }
    ]
  },
  {
    id: "REP-2004",
    patientId: "PT-1004",
    patientName: "Elena Rostova",
    title: "Routine Electroencephalogram (EEG)",
    testType: "Electroencephalogram",
    date: getPastDate(5),
    doctor: "Dr. Eric Foreman",
    department: "Neurology",
    status: "Final",
    findings: "Background activity shows symmetric 9.5 Hz alpha rhythm. Occasional spike-and-wave discharges localized to the left temporal lobe during photic stimulation. Hyperventilation trials triggered brief theta slowing but no clinical seizure activity.",
    notes: "Findings are consistent with localized cortical irritability and left temporal seizure susceptibility. Recommend continuing Keppra 500mg BID. Schedule follow-up in 3 months.",
    results: [
      { parameter: "Alpha Frequency", value: 9.5, unit: "Hz", referenceRange: "8.0 - 13.0", status: "Normal", minNormal: 8.0, maxNormal: 13.0 },
      { parameter: "Theta Percentage", value: 12, unit: "%", referenceRange: "< 15", status: "Normal", minNormal: 0, maxNormal: 15 },
      { parameter: "Spike Frequency", value: 2.4, unit: "episodes/hr", referenceRange: "0 - 0.5", status: "High", minNormal: 0, maxNormal: 0.5 }
    ]
  }
];

// 2. Base lists of names and demographics for programmatically generated patients
const FIRST_NAMES_MALE = ["John", "Michael", "David", "William", "James", "Robert", "Joseph", "Daniel", "Thomas", "Matthew", "Andrew", "Christopher", "Richard", "Daniel", "Brian", "Kevin", "Charles", "Edward", "Donald", "George"];
const FIRST_NAMES_FEMALE = ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen", "Lisa", "Nancy", "Betty", "Margaret", "Sandra", "Ashley", "Dorothy", "Kimberly", "Emily", "Donna"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White"];
const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
const DEPARTMENTS = ["Cardiology", "Oncology", "ICU", "Pediatrics", "Neurology", "Emergency", "General"] as const;
const DOCTORS = [
  { name: "Dr. Gregory House", dept: "Neurology" },
  { name: "Dr. Allison Cameron", dept: "Cardiology" },
  { name: "Dr. Robert Chase", dept: "Emergency" },
  { name: "Dr. Eric Foreman", dept: "Neurology" },
  { name: "Dr. James Wilson", dept: "Oncology" },
  { name: "Dr. Lisa Cuddy", dept: "General" },
  { name: "Dr. John Dorian", dept: "General" },
  { name: "Dr. Elliot Reid", dept: "Pediatrics" },
  { name: "Dr. Carla Espinosa", dept: "ICU" }
];

// Core Detailed Patients
const corePatients: Patient[] = [
  {
    id: "PT-1001",
    name: "Robert Chen",
    age: 68,
    gender: "Male",
    bloodType: "A+",
    phone: "(555) 124-5892",
    email: "robert.chen@email.com",
    address: "742 Evergreen Terrace, Sector 4, Hospital City",
    allergies: ["Penicillin", "Contrast Dye"],
    department: "Cardiology",
    status: "Critical",
    lastVisit: getPastDate(1),
    admissionDate: getPastDate(4),
    bedNumber: "ICU-Bed 12",
    attendingPhysician: "Dr. Allison Cameron",
    vitals: {
      heartRate: 104,
      bloodPressure: "142/92",
      oxygenSat: 92,
      temperature: 98.6,
      respiratoryRate: 22,
      timestamp: new Date().toISOString()
    },
    vitalsHistory: Array.from({ length: 12 }, (_, i) => ({
      timestamp: new Date(Date.now() - (11 - i) * 2 * 60 * 60 * 1000).toISOString(),
      heartRate: 98 + Math.floor(Math.random() * 12) - 4,
      bloodPressureSystolic: 135 + Math.floor(Math.random() * 15) - 5,
      bloodPressureDiastolic: 88 + Math.floor(Math.random() * 8) - 2,
      oxygenSat: 91 + Math.floor(Math.random() * 4),
      temperature: 98.2 + Math.floor(Math.random() * 10) / 10,
      respiratoryRate: 20 + Math.floor(Math.random() * 4) - 1
    })),
    medicalHistory: [
      { id: "MH-101", date: getPastDate(4), eventType: "Admission", title: "Admitted for Acute Decompensated Heart Failure", description: "Presented to ER with severe dyspnea on exertion, orthopnea, and 3+ bilateral pitting edema.", doctor: "Dr. Robert Chase", status: "Completed" },
      { id: "MH-102", date: getPastDate(3), eventType: "Diagnosis", title: "Echocardiogram: Reduced Ejection Fraction (LVEF 30%)", description: "Severe left ventricular systolic dysfunction, mild mitral regurgitation, and pulmonary hypertension.", doctor: "Dr. Allison Cameron", status: "Completed" },
      { id: "MH-103", date: getPastDate(3), eventType: "Treatment", title: "IV Diuretic Administration", description: "Initiated continuous IV Lasix infusion. Placed on fluid restriction (1.5L/day) and low-sodium diet.", doctor: "Dr. Allison Cameron", status: "Ongoing" },
      { id: "MH-104", date: getPastDate(2), eventType: "Medication Change", title: "Optimized GDMT Regimen", description: "Added Carvedilol 3.125mg BID, increased Lisinopril to 5mg daily. Discontinued amlodipine.", doctor: "Dr. Allison Cameron", status: "Completed" }
    ],
    medications: [
      { id: "MED-101", name: "Furosemide (Lasix)", dosage: "40mg", frequency: "IV twice daily", startDate: getPastDate(4), endDate: getFutureDate(3), status: "Active" },
      { id: "MED-102", name: "Carvedilol (Coreg)", dosage: "3.125mg", frequency: "Orally twice daily", startDate: getPastDate(2), endDate: getFutureDate(30), status: "Active" },
      { id: "MED-103", name: "Lisinopril", dosage: "5mg", frequency: "Orally once daily", startDate: getPastDate(2), endDate: getFutureDate(30), status: "Active" },
      { id: "MED-104", name: "Atorvastatin (Lipitor)", dosage: "40mg", frequency: "Orally nightly", startDate: getPastDate(2), endDate: getFutureDate(90), status: "Active" }
    ],
    reports: [
      { id: "REP-2001", title: "12-Lead Electrocardiogram (ECG)", date: getPastDate(1), status: "Final" },
      { id: "REP-2002", title: "Basic Metabolic Panel (BMP)", date: getPastDate(1), status: "Final" }
    ]
  },
  {
    id: "PT-1002",
    name: "Sarah Jenkins",
    age: 45,
    gender: "Female",
    bloodType: "O-",
    phone: "(555) 349-2045",
    email: "sarah.j@email.com",
    address: "12 Valley View Road, Pines, Hospital City",
    allergies: ["Sulfa Drugs", "Adhesive Tape"],
    department: "Oncology",
    status: "Stable",
    lastVisit: getPastDate(3),
    admissionDate: getPastDate(15),
    bedNumber: "Room 408A",
    attendingPhysician: "Dr. James Wilson",
    vitals: {
      heartRate: 78,
      bloodPressure: "115/72",
      oxygenSat: 98,
      temperature: 99.1,
      respiratoryRate: 16,
      timestamp: new Date().toISOString()
    },
    vitalsHistory: Array.from({ length: 8 }, (_, i) => ({
      timestamp: new Date(Date.now() - (7 - i) * 3 * 60 * 60 * 1000).toISOString(),
      heartRate: 75 + Math.floor(Math.random() * 10) - 5,
      bloodPressureSystolic: 110 + Math.floor(Math.random() * 10),
      bloodPressureDiastolic: 70 + Math.floor(Math.random() * 6),
      oxygenSat: 97 + Math.floor(Math.random() * 3),
      temperature: 98.4 + Math.floor(Math.random() * 10) / 10,
      respiratoryRate: 14 + Math.floor(Math.random() * 4)
    })),
    medicalHistory: [
      { id: "MH-201", date: getPastDate(15), eventType: "Admission", title: "Admitted for Cycle 3 Chemotherapy", description: "Scheduled oncology admission for adjuvant chemotherapy for Stage IIB Invasive Ductal Carcinoma.", doctor: "Dr. James Wilson", status: "Completed" },
      { id: "MH-202", date: getPastDate(14), eventType: "Treatment", title: "Infusion: Doxorubicin and Cyclophosphamide", description: "Completed infusion protocol. Monitored for immediate hypersensitivity and cardiac toxicity.", doctor: "Dr. James Wilson", status: "Completed" },
      { id: "MH-203", date: getPastDate(10), eventType: "Diagnosis", title: "Post-Chemo Lab Evaluation", description: "Routine lab testing. Patient experiencing mild nausea and fatigue.", doctor: "Dr. James Wilson", status: "Completed" }
    ],
    medications: [
      { id: "MED-201", name: "Doxorubicin", dosage: "60 mg/m2", frequency: "IV Infusion", startDate: getPastDate(14), endDate: getPastDate(14), status: "Discontinued" },
      { id: "MED-202", name: "Ondansetron (Zofran)", dosage: "8mg", frequency: "Orally every 8 hours as needed", startDate: getPastDate(15), endDate: getFutureDate(5), status: "Active" },
      { id: "MED-203", name: "Tamoxifen", dosage: "20mg", frequency: "Orally daily", startDate: getPastDate(15), endDate: getFutureDate(365), status: "Active" }
    ],
    reports: [
      { id: "REP-2003", title: "Complete Blood Count (CBC)", date: getPastDate(3), status: "Final" }
    ]
  },
  {
    id: "PT-1003",
    name: "Liam O'Connor",
    age: 9,
    gender: "Male",
    bloodType: "B+",
    phone: "(555) 872-1104",
    email: "oconnor.family@email.com",
    address: "33 Maple Avenue, Hilltop, Hospital City",
    allergies: ["Peanuts"],
    department: "Pediatrics",
    status: "Recovering",
    lastVisit: getPastDate(2),
    admissionDate: getPastDate(2),
    bedNumber: "Room 214B",
    attendingPhysician: "Dr. Elliot Reid",
    vitals: {
      heartRate: 90,
      bloodPressure: "102/64",
      oxygenSat: 99,
      temperature: 98.2,
      respiratoryRate: 20,
      timestamp: new Date().toISOString()
    },
    vitalsHistory: Array.from({ length: 6 }, (_, i) => ({
      timestamp: new Date(Date.now() - (5 - i) * 4 * 60 * 60 * 1000).toISOString(),
      heartRate: 88 + Math.floor(Math.random() * 10) - 4,
      bloodPressureSystolic: 100 + Math.floor(Math.random() * 8) - 2,
      bloodPressureDiastolic: 60 + Math.floor(Math.random() * 6) - 1,
      oxygenSat: 98 + Math.floor(Math.random() * 2),
      temperature: 98.0 + Math.floor(Math.random() * 12) / 10,
      respiratoryRate: 18 + Math.floor(Math.random() * 4)
    })),
    medicalHistory: [
      { id: "MH-301", date: getPastDate(2), eventType: "Admission", title: "Tonsillectomy Surgery", description: "Admitted for scheduled elective tonsillectomy and adenoidectomy due to recurrent chronic tonsillitis and mild sleep apnea.", doctor: "Dr. Robert Chase", status: "Completed" },
      { id: "MH-302", date: getPastDate(1), eventType: "Surgery", title: "Completed Tonsillectomy & Adenoidectomy", description: "Successful surgical extraction under general anesthesia. Minimal intra-operative blood loss.", doctor: "Dr. Robert Chase", status: "Completed" },
      { id: "MH-303", date: getPastDate(1), eventType: "Treatment", title: "Post-operative Care & Hydration", description: "Admitted to pediatric ward for monitoring of airway patency, hydration level, and pain control.", doctor: "Dr. Elliot Reid", status: "Ongoing" }
    ],
    medications: [
      { id: "MED-301", name: "Amoxicillin", dosage: "250mg/5mL", frequency: "Liquid suspension twice daily", startDate: getPastDate(1), endDate: getFutureDate(6), status: "Active" },
      { id: "MED-302", name: "Ibuprofen (Children's)", dosage: "100mg/5mL", frequency: "Liquid suspension every 6 hours as needed for pain", startDate: getPastDate(1), endDate: getFutureDate(4), status: "Active" }
    ],
    reports: []
  },
  {
    id: "PT-1004",
    name: "Elena Rostova",
    age: 34,
    gender: "Female",
    bloodType: "AB+",
    phone: "(555) 761-9031",
    email: "elena.r@email.com",
    address: "99 Moscow Blvd, North District, Hospital City",
    allergies: ["Aspirin", "Nuts"],
    department: "Neurology",
    status: "Stable",
    lastVisit: getPastDate(5),
    admissionDate: getPastDate(6),
    bedNumber: "Room 303F",
    attendingPhysician: "Dr. Eric Foreman",
    vitals: {
      heartRate: 72,
      bloodPressure: "118/78",
      oxygenSat: 97,
      temperature: 98.4,
      respiratoryRate: 14,
      timestamp: new Date().toISOString()
    },
    vitalsHistory: Array.from({ length: 8 }, (_, i) => ({
      timestamp: new Date(Date.now() - (7 - i) * 6 * 60 * 60 * 1000).toISOString(),
      heartRate: 70 + Math.floor(Math.random() * 8) - 3,
      bloodPressureSystolic: 115 + Math.floor(Math.random() * 8) - 2,
      bloodPressureDiastolic: 75 + Math.floor(Math.random() * 6) - 1,
      oxygenSat: 96 + Math.floor(Math.random() * 3),
      temperature: 98.2 + Math.floor(Math.random() * 6) / 10,
      respiratoryRate: 12 + Math.floor(Math.random() * 4)
    })),
    medicalHistory: [
      { id: "MH-401", date: getPastDate(6), eventType: "Admission", title: "Admitted for Neurological Study", description: "Admitted following recurrent focal neurological deficits and migraine-aura clusters.", doctor: "Dr. Gregory House", status: "Completed" },
      { id: "MH-402", date: getPastDate(5), eventType: "Diagnosis", title: "Electroencephalography Study", description: "Undertook standard 24-hr video EEG monitoring to capture localized temporal spike discharges.", doctor: "Dr. Eric Foreman", status: "Completed" }
    ],
    medications: [
      { id: "MED-401", name: "Keppra (Levetiracetam)", dosage: "500mg", frequency: "Orally twice daily", startDate: getPastDate(5), endDate: getFutureDate(180), status: "Active" },
      { id: "MED-402", name: "Sumatriptan (Imitrex)", dosage: "50mg", frequency: "Orally at onset of migraine", startDate: getPastDate(5), endDate: getFutureDate(90), status: "Active" }
    ],
    reports: [
      { id: "REP-2004", title: "Routine Electroencephalogram (EEG)", date: getPastDate(5), status: "Final" }
    ]
  },
  {
    id: "PT-1005",
    name: "Marcus Vance",
    age: 52,
    gender: "Male",
    bloodType: "B-",
    phone: "(555) 431-8902",
    email: "marcus.v@email.com",
    address: "244 Industrial Blvd, South District, Hospital City",
    allergies: [],
    department: "Emergency",
    status: "Critical",
    lastVisit: getPastDate(0),
    admissionDate: getPastDate(0),
    bedNumber: "ER-Trauma 2",
    attendingPhysician: "Dr. Robert Chase",
    vitals: {
      heartRate: 110,
      bloodPressure: "95/58",
      oxygenSat: 91,
      temperature: 97.8,
      respiratoryRate: 26,
      timestamp: new Date().toISOString()
    },
    vitalsHistory: Array.from({ length: 4 }, (_, i) => ({
      timestamp: new Date(Date.now() - (3 - i) * 30 * 60 * 1000).toISOString(),
      heartRate: 120 - (i * 3) + Math.floor(Math.random() * 4) - 2,
      bloodPressureSystolic: 85 + (i * 3) + Math.floor(Math.random() * 6) - 2,
      bloodPressureDiastolic: 50 + (i * 2) + Math.floor(Math.random() * 4) - 1,
      oxygenSat: 88 + Math.floor(i * 1) + Math.floor(Math.random() * 2),
      temperature: 97.4 + Math.floor(Math.random() * 6) / 10,
      respiratoryRate: 28 - (i * 1) + Math.floor(Math.random() * 2)
    })),
    medicalHistory: [
      { id: "MH-501", date: getPastDate(0), eventType: "Admission", title: "ER Trauma Admission: Fall from Height", description: "Brought in via EMS. Sustained a 15-foot fall at construction site. Presents with abdominal pain, left leg fracture, and hypotension.", doctor: "Dr. Robert Chase", status: "Ongoing" },
      { id: "MH-502", date: getPastDate(0), eventType: "Treatment", title: "Volume Resuscitation & Stabilization", description: "Initiated rapid infuser, normal saline boluses. Placed pelvic binder and splinted left tibia.", doctor: "Dr. Robert Chase", status: "Ongoing" }
    ],
    medications: [
      { id: "MED-501", name: "Morphine Sulfate", dosage: "4mg", frequency: "IV push as needed for pain", startDate: getPastDate(0), endDate: getFutureDate(1), status: "Active" },
      { id: "MED-502", name: "Normal Saline 0.9%", dosage: "1000mL", frequency: "IV infusion continuous", startDate: getPastDate(0), endDate: getFutureDate(1), status: "Active" }
    ],
    reports: []
  }
];

// Generate 50 additional patients (Total: 55 patients)
const generatePatients = (): Patient[] => {
  const generated: Patient[] = [...corePatients];
  
  for (let i = 6; i <= 55; i++) {
    const isMale = Math.random() > 0.5;
    const gender = isMale ? "Male" : "Female";
    const firstName = isMale 
      ? FIRST_NAMES_MALE[Math.floor(Math.random() * FIRST_NAMES_MALE.length)]
      : FIRST_NAMES_FEMALE[Math.floor(Math.random() * FIRST_NAMES_FEMALE.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const name = `${firstName} ${lastName}`;
    const id = `PT-${1000 + i}`;
    const age = Math.floor(Math.random() * 70) + 12; // Ages 12-82
    const bloodType = BLOOD_TYPES[Math.floor(Math.random() * BLOOD_TYPES.length)];
    const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    
    // Status distribution: 75% Stable, 15% Recovering, 10% Critical
    const statusRand = Math.random();
    const status = statusRand < 0.75 ? "Stable" : statusRand < 0.9 ? "Recovering" : "Critical";
    
    const docObj = DOCTORS.find(d => d.dept === department) || DOCTORS[Math.floor(Math.random() * DOCTORS.length)];
    const attendingPhysician = docObj.name;
    
    const bedNumber = status === "Critical" && department === "ICU"
      ? `ICU-Bed ${Math.floor(Math.random() * 20) + 1}`
      : `Room ${Math.floor(Math.random() * 300) + 100}${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`;
      
    const lastVisit = getPastDate(Math.floor(Math.random() * 15) + 1);
    const admissionDate = getPastDate(Math.floor(Math.random() * 20) + 1);

    // Mock vitals based on status
    let heartRate = 72 + Math.floor(Math.random() * 14) - 7;
    let bloodPressure = "120/80";
    let oxygenSat = 96 + Math.floor(Math.random() * 4);
    let temperature = 98.4 + Math.floor(Math.random() * 10) / 10 - 0.5;
    let respiratoryRate = 14 + Math.floor(Math.random() * 4) - 2;

    if (status === "Critical") {
      heartRate = 105 + Math.floor(Math.random() * 20) - 5;
      bloodPressure = Math.random() > 0.5 ? "152/98" : "90/55";
      oxygenSat = 89 + Math.floor(Math.random() * 4);
      temperature = 99.8 + Math.floor(Math.random() * 15) / 10;
      respiratoryRate = 22 + Math.floor(Math.random() * 6) - 1;
    } else if (status === "Recovering") {
      heartRate = 82 + Math.floor(Math.random() * 10) - 5;
      oxygenSat = 95 + Math.floor(Math.random() * 3);
    }

    const vitals: Patient['vitals'] = {
      heartRate,
      bloodPressure,
      oxygenSat,
      temperature,
      respiratoryRate,
      timestamp: new Date().toISOString()
    };

    // Vitals history
    const vitalsHistory: Patient['vitalsHistory'] = Array.from({ length: 6 }, (_, idx) => {
      const offset = (5 - idx) * 4 * 60 * 60 * 1000;
      const bpSystolic = parseInt(bloodPressure.split('/')[0]) + Math.floor(Math.random() * 12) - 6;
      const bpDiastolic = parseInt(bloodPressure.split('/')[1]) + Math.floor(Math.random() * 8) - 4;
      return {
        timestamp: new Date(Date.now() - offset).toISOString(),
        heartRate: heartRate + Math.floor(Math.random() * 10) - 5,
        bloodPressureSystolic: bpSystolic,
        bloodPressureDiastolic: bpDiastolic,
        oxygenSat: Math.min(100, oxygenSat + Math.floor(Math.random() * 3) - 1),
        temperature: temperature + Math.floor(Math.random() * 6) / 10 - 0.3,
        respiratoryRate: Math.max(10, respiratoryRate + Math.floor(Math.random() * 4) - 2)
      };
    });

    const medicalHistory: MedicalHistoryItem[] = [
      {
        id: `MH-${id}-${1}`,
        date: admissionDate,
        eventType: "Admission",
        title: `Admitted for ${department} Evaluation`,
        description: `Routine admission for clinical workup and therapy scheduling within ${department}.`,
        doctor: attendingPhysician,
        status: "Completed"
      }
    ];

    const medications: Medication[] = [
      {
        id: `MED-${id}-${1}`,
        name: department === "Cardiology" ? "Metoprolol" : department === "Oncology" ? "Ondansetron" : "Lisinopril",
        dosage: "25mg",
        frequency: "Once daily",
        startDate: admissionDate,
        endDate: getFutureDate(14),
        status: "Active"
      }
    ];

    const reports: DiagnosticReportShort[] = [];
    if (Math.random() > 0.4) {
      reports.push({
        id: `REP-${1000 + i}-A`,
        title: "Standard Lab Hematology Panel",
        date: getPastDate(2),
        status: "Final"
      });
      
      // Also write full report entry
      mockDiagnosticReports.push({
        id: `REP-${1000 + i}-A`,
        patientId: id,
        patientName: name,
        title: "Standard Lab Hematology Panel",
        testType: "Blood Test",
        date: getPastDate(2),
        doctor: attendingPhysician,
        department,
        status: "Final",
        findings: "White blood cell count and red blood cell count within normal limits. Hemoglobin normal. Mild elevation in platelet counts.",
        notes: "No acute intervention required. Follow up on discharge.",
        results: [
          { parameter: "White Blood Cells", value: 6.2, unit: "K/uL", referenceRange: "4.5 - 11.0", status: "Normal", minNormal: 4.5, maxNormal: 11.0 },
          { parameter: "Red Blood Cells", value: 4.8, unit: "M/uL", referenceRange: "4.2 - 5.4", status: "Normal", minNormal: 4.2, maxNormal: 5.4 },
          { parameter: "Hemoglobin", value: 14.1, unit: "g/dL", referenceRange: "12.0 - 16.0", status: "Normal", minNormal: 12.0, maxNormal: 16.0 },
          { parameter: "Platelets", value: 380, unit: "K/uL", referenceRange: "150 - 450", status: "Normal", minNormal: 150, maxNormal: 450 }
        ]
      });
    }

    generated.push({
      id,
      name,
      age,
      gender,
      bloodType,
      phone: `(555) ${Math.floor(Math.random() * 800) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      address: `${Math.floor(Math.random() * 999) + 1} Medical Way, Hospital City`,
      allergies: Math.random() > 0.7 ? ["Sulfa Drugs"] : [],
      department,
      status,
      lastVisit,
      admissionDate,
      bedNumber,
      attendingPhysician,
      vitals,
      vitalsHistory,
      medicalHistory,
      medications,
      reports
    });
  }

  return generated;
};

export const mockPatients = generatePatients();

// 3. Mock Hospital Resources
export const mockHospitalResources: HospitalResource[] = [
  { id: "RES-101", name: "ICU Ward Bed 10", type: "ICU Bed", status: "Available", department: "ICU" },
  { id: "RES-102", name: "ICU Ward Bed 11", type: "ICU Bed", status: "Occupied", department: "ICU", assignedTo: "Robert Chen" },
  { id: "RES-103", name: "ICU Ward Bed 12", type: "ICU Bed", status: "Occupied", department: "ICU", assignedTo: "Robert Chen" },
  { id: "RES-104", name: "Operating Room A", type: "Room", status: "Available", department: "General" },
  { id: "RES-105", name: "Operating Room B", type: "Room", status: "Occupied", department: "General" },
  { id: "RES-106", name: "Pediatric Consultation Room", type: "Room", status: "Available", department: "Pediatrics" },
  { id: "RES-107", name: "Ventilator V-300", type: "Ventilator", status: "Occupied", department: "ICU", assignedTo: "PT-1001" },
  { id: "RES-108", name: "Ventilator V-301", type: "Ventilator", status: "Available", department: "ICU" },
  { id: "RES-109", name: "ECG System Pro", type: "ECG Machine", status: "Available", department: "Cardiology" },
  { id: "RES-110", name: "Dr. Gregory House", type: "Staff", status: "Available", department: "Neurology" },
  { id: "RES-111", name: "Dr. Allison Cameron", type: "Staff", status: "Occupied", department: "Cardiology" },
  { id: "RES-112", name: "Dr. James Wilson", type: "Staff", status: "Available", department: "Oncology" },
  { id: "RES-113", name: "Dr. Robert Chase", type: "Staff", status: "Occupied", department: "Emergency" }
];

// 4. Initial Appointments
export const mockAppointments: Appointment[] = [
  {
    id: "APP-3001",
    patientId: "PT-1001",
    patientName: "Robert Chen",
    date: getPastDate(0),
    time: "09:00",
    duration: 30,
    department: "Cardiology",
    type: "Diagnostic",
    doctor: "Dr. Allison Cameron",
    resourceId: "RES-109",
    notes: "Follow-up ECG post decompensation adjustment."
  },
  {
    id: "APP-3002",
    patientId: "PT-1002",
    patientName: "Sarah Jenkins",
    date: getFutureDate(1),
    time: "11:00",
    duration: 60,
    department: "Oncology",
    type: "Consultation",
    doctor: "Dr. James Wilson",
    resourceId: "RES-112",
    notes: "Cycle 4 pre-assessment and toxicity review."
  },
  {
    id: "APP-3003",
    patientId: "PT-1003",
    patientName: "Liam O'Connor",
    date: getPastDate(0),
    time: "14:30",
    duration: 30,
    department: "Pediatrics",
    type: "Follow-up",
    doctor: "Dr. Elliot Reid",
    resourceId: "RES-106",
    notes: "Tonsillectomy post-op day 1 healing and swallowing check."
  },
  {
    id: "APP-3004",
    patientId: "PT-1004",
    patientName: "Elena Rostova",
    date: getFutureDate(2),
    time: "10:00",
    duration: 45,
    department: "Neurology",
    type: "Consultation",
    doctor: "Dr. Eric Foreman",
    resourceId: "RES-110",
    notes: "Review temporal lobe spike activity findings and adjust Keppra dosage."
  },
  {
    id: "APP-3005",
    patientId: "PT-1006",
    patientName: "John Smith",
    date: getFutureDate(0),
    time: "15:00",
    duration: 30,
    department: "General",
    type: "Consultation",
    doctor: "Dr. Lisa Cuddy",
    resourceId: "RES-104",
    notes: "Annual wellness exam and lipid panel review."
  }
];

// 5. Initial Activity Logs
export const mockActivityLogs: ActivityLog[] = [
  {
    id: "ACT-4001",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 mins ago
    type: "alert",
    patientId: "PT-1001",
    patientName: "Robert Chen",
    message: "Critical Alarm: SpO2 dropped below 92% (recorded 90% in ICU Ward Bed 12). Oxygen flow adjusted.",
    severity: "critical"
  },
  {
    id: "ACT-4002",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
    type: "admission",
    patientId: "PT-1005",
    patientName: "Marcus Vance",
    message: "Emergency Trauma Admission: Patient admitted to ER-Trauma 2 via EMS post fall.",
    severity: "high"
  },
  {
    id: "ACT-4003",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
    type: "report",
    patientId: "PT-1001",
    patientName: "Robert Chen",
    message: "ECG Diagnostic Report uploaded for Robert Chen by Dr. Allison Cameron. Findings: ST-depression.",
    severity: "medium"
  },
  {
    id: "ACT-4004",
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(), // 2 hours ago
    type: "appointment",
    patientId: "PT-1003",
    patientName: "Liam O'Connor",
    message: "Follow-up consultation successfully completed by Dr. Elliot Reid.",
    severity: "low"
  },
  {
    id: "ACT-4005",
    timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(), // 3 hours ago
    type: "medication",
    patientId: "PT-1001",
    patientName: "Robert Chen",
    message: "Medication updated: Added Carvedilol 3.125mg BID, discontinued Amlodipine.",
    severity: "medium"
  }
];
