# CareScope Analytics

CareScope Analytics is a premium, frontend-only Healthcare Analytics SaaS dashboard built as an instrument-panel clinical interface for hospital ward managers and clinicians. 

---

## 🎨 Clinical Instrument Design System

The visual theme resembles diagnostic hardware screens, replacing translucent cards with high-contrast, paper-and-ink layouts:

### 🔴 Color Tokens
* **Paper (`#F7F5EF`)**: base screen backdrop.
* **Ink (`#0F2E2B`)**: headers, text, and primary dark components.
* **Teal (`#0F5C56`)**: primary buttons, active selectors, and baseline curves.
* **Coral (`#FF6B5B`)**: critical warnings, hazard badges, and alarm peaks.
* **Cyan (`#4FD1C5`)**: secondary data curves and highlighting.
* **Grid (`#D8DCD4`)**: structural borders, separators, and background grids.

### 🔤 Typography Configuration
* **Headings**: `Space Grotesk` (technical display sans).
* **Body text**: `Inter` (high-readability interface sans).
* **Numbers & Codes**: `IBM Plex Mono` (instrument-style numerical readouts).

### ⚡ PulseLine Header
A fixed canvas ECG wave running at the top edge of the screen. Under normal conditions, it sweeps a calm teal heart rhythm. Whenever a warning alert is logged in the system, it spikes in amplitude and sweeps a warning coral wave for 2.5 seconds.

---

## 🚀 Key Functional Modules

1. **Dashboard Home**: Summary ICU bed occupancy, admissions area charts, ward census distributions, and clinical prognosis advisories. Contains a flat SVG network map schematic.
2. **Census Directory**: Directory search table that lists patient records, attending physicians, active wards, and alert levels.
3. **Clinical Profiler & Reports**: Historical vitals tracking, procedure timelines, chemical blood panel analysis reports, and reference-range progress gauges.
4. **Live ICU Telemetry**: Multi-patient vital signs loops (heart rate, BP, SpO2, temp) updating every 3 seconds alongside running area waveforms.
5. **Prognostic Forecasting**: Composed charts simulating bed demand forecasts and target treatment efficacy curves.
6. **Query Builder**: Demographic query criteria dropdowns with custom bar/line distributions and CSV/PDF export mockups.
7. **System Settings**: Theme toggling, notification triggers, and cache wipes.

---

## 🛠️ Technology Stack

* **Core**: React 18 + TypeScript
* **Build Engine**: Vite
* **Styles**: Tailwind CSS v4
* **State Management**: Zustand with persistent middleware
* **Visual Data**: Recharts
* **Motion & Anim**: Framer Motion
* **Base Components**: Radix UI primitives (Tabs, Dialog)
* **Icons**: Lucide React

---

## 💻 Commands Guide

### 1. Installation
Install the project dependencies:
```bash
npm install
```

### 2. Development Server
Start the local hot-reloading development server:
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Production Compile
Compile strictly typed, minified client assets:
```bash
npm run build
```
The compiled assets will compile inside the `./dist` folder.
