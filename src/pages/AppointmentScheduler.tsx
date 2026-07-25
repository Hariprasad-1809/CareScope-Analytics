import React, { useState, useMemo } from 'react';
import { useCareStore } from '../store/useCareStore';
import { Button } from '../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/Dialog';
import { Calendar as CalendarIcon, Clock, Plus, Trash } from 'lucide-react';
import type { Appointment } from '../types';
import { cn } from '../utils/cn';

export const AppointmentScheduler: React.FC = () => {
  const { 
    appointments, 
    patients, 
    hospitalResources, 
    addAppointment, 
    deleteAppointment 
  } = useCareStore();

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Form State
  const [patientId, setPatientId] = useState('');
  const [bookingType, setBookingType] = useState<'Consultation' | 'Surgery' | 'Follow-up' | 'Therapy' | 'Diagnostic'>('Consultation');
  const [doctorName, setDoctorName] = useState('');
  const [resourceId, setResourceId] = useState('');
  const [bookingDate, setBookingDate] = useState('2026-07-25');
  const [bookingTime, setBookingTime] = useState('09:00');
  const [notes, setNotes] = useState('');

  const doctorsList = [
    "Dr. Gregory House",
    "Dr. Allison Cameron",
    "Dr. Robert Chase",
    "Dr. Eric Foreman",
    "Dr. James Wilson",
    "Dr. Lisa Cuddy",
    "Dr. John Dorian",
    "Dr. Elliot Reid"
  ];

  // Calendar Helpers (July 2026)
  const daysInMonth = 31;
  const startDayOfWeek = 3; // July 1, 2026 is a Wednesday

  // Generate calendar grid cells
  const calendarCells = useMemo(() => {
    const cells: { dateStr: string; dayNum: number | null; appointments: Appointment[] }[] = [];
    
    // Previous month padding
    for (let i = 0; i < startDayOfWeek; i++) {
      cells.push({ dateStr: '', dayNum: null, appointments: [] });
    }

    // Days of July 2026
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `2026-07-${String(day).padStart(2, '0')}`;
      const dayApps = appointments.filter(app => app.date === dateStr);
      cells.push({
        dateStr,
        dayNum: day,
        appointments: dayApps
      });
    }

    // Remaining cells padding
    while (cells.length % 7 !== 0) {
      cells.push({ dateStr: '', dayNum: null, appointments: [] });
    }

    return cells;
  }, [appointments]);

  const handleDayClick = (dateStr: string) => {
    if (!dateStr) return;
    setBookingDate(dateStr);
    setIsBookModalOpen(true);
  };

  const handleAppClick = (app: Appointment, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAppointment(app);
    setIsDetailModalOpen(true);
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorName || !resourceId) return;

    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    addAppointment({
      patientId,
      patientName: patient.name,
      date: bookingDate,
      time: bookingTime,
      duration: 45,
      department: patient.department,
      type: bookingType,
      doctor: doctorName,
      resourceId,
      notes
    });

    // Reset Form & Close Modal
    setPatientId('');
    setDoctorName('');
    setResourceId('');
    setNotes('');
    setIsBookModalOpen(false);
  };

  const handleCancelAppointment = (id: string) => {
    deleteAppointment(id);
    setIsDetailModalOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-ink tracking-wide font-display">Appointment Scheduler</h2>
          <p className="text-xs text-ink/70 mt-1">
            Book slots, reserve clinical environments, and assign medical personnel.
          </p>
        </div>
        <Button onClick={() => setIsBookModalOpen(true)} variant="primary" className="self-start sm:self-auto select-none">
          <Plus className="w-4 h-4 mr-1.5" /> Book Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Resources & Active Slots */}
        <section className="lg:col-span-3 space-y-6 flex flex-col">
          {/* Calendar Header Month Indicator */}
          <div className="bg-white border border-grid rounded-lg p-5 text-center shadow-sm">
            <CalendarIcon className="w-8 h-8 text-teal mx-auto mb-2" />
            <h4 className="font-bold text-lg text-ink font-display">July 2026</h4>
            <span className="text-xs text-ink/60 font-semibold font-mono">Scheduler active</span>
          </div>

          {/* Hospital Resources List */}
          <div className="bg-white border border-grid rounded-lg p-5 flex-1 space-y-4 shadow-sm">
            <h5 className="text-sm font-semibold text-ink border-b border-grid pb-2 font-display">Active Resource Monitor</h5>
            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {hospitalResources.map((res) => (
                <div key={res.id} className="flex items-center justify-between p-2.5 bg-paper border border-grid rounded-lg text-xs">
                  <div className="text-left">
                    <span className="font-semibold text-ink block font-display">{res.name}</span>
                    <span className="text-[10px] text-ink/60 font-mono">{res.type} • {res.department}</span>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 rounded font-bold text-[9px] uppercase font-mono",
                    res.status === 'Available' && 'bg-teal/10 text-teal',
                    res.status === 'Occupied' && 'bg-coral/10 text-coral',
                    res.status === 'Maintenance' && 'bg-grid/60 text-ink/80'
                  )}>
                    {res.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Side: Month Grid */}
        <section className="lg:col-span-9 bg-white border border-grid rounded-lg p-5 shadow-sm flex flex-col">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-ink/65 mb-2 border-b border-grid pb-2 font-display">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2 flex-1 min-h-[480px]">
            {calendarCells.map((cell, idx) => {
              const isToday = cell.dayNum === 25; // July 25, 2026
              
              return (
                <div
                  key={idx}
                  onClick={() => cell.dateStr && handleDayClick(cell.dateStr)}
                  className={cn(
                    "min-h-[85px] border rounded-lg p-1.5 flex flex-col justify-between transition-all select-none",
                    cell.dayNum 
                      ? "bg-paper/40 border-grid hover:border-teal cursor-pointer" 
                      : "bg-transparent border-transparent opacity-0 pointer-events-none",
                    isToday && "border-teal bg-teal/5"
                  )}
                >
                  <span className={cn(
                    "text-xs font-bold self-end font-mono",
                    isToday ? "text-teal" : "text-ink/60"
                  )}>
                    {cell.dayNum}
                  </span>

                  {/* Appointments indicators */}
                  <div className="space-y-1 mt-1 flex-1 overflow-y-auto">
                    {cell.appointments.slice(0, 2).map((app) => (
                      <div
                        key={app.id}
                        onClick={(e) => handleAppClick(app, e)}
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-bold truncate transition-all text-left font-mono",
                          app.type === 'Surgery' && 'bg-coral/10 text-coral border border-coral/30',
                          app.type === 'Consultation' && 'bg-teal/10 text-teal border border-teal/20',
                          app.type === 'Follow-up' && 'bg-cyan/15 text-teal border border-cyan/40',
                          app.type === 'Diagnostic' && 'bg-cyan/15 text-teal border border-cyan/40',
                          app.type === 'Therapy' && 'bg-teal/10 text-teal border border-teal/20'
                        )}
                      >
                        {app.time} {app.patientName.split(' ').pop()}
                      </div>
                    ))}
                    {cell.appointments.length > 2 && (
                      <div className="text-[9px] text-ink/60 pl-1 font-bold font-mono">
                        +{cell.appointments.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* MODAL 1: Book Appointment Dialog */}
      <Dialog open={isBookModalOpen} onOpenChange={setIsBookModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Hospital Appointment</DialogTitle>
            <DialogDescription>
              Assign a patient to a physician, allocate a ward resource, and confirm slot.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBookAppointment} className="space-y-4 mt-2">
            {/* Patient Select */}
            <div className="flex flex-col space-y-1.5 text-left">
              <label className="text-xs text-ink/65 font-bold font-display">Patient</label>
              <select
                required
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full bg-paper border border-grid rounded-lg p-2 text-sm text-ink font-mono focus:outline-none focus:ring-1 focus:ring-teal"
              >
                <option value="">Select Patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>

            {/* Doctor & Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5 text-left">
                <label className="text-xs text-ink/65 font-bold font-display">Physician</label>
                <select
                  required
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full bg-paper border border-grid rounded-lg p-2 text-sm text-ink font-display focus:outline-none focus:ring-1 focus:ring-teal"
                >
                  <option value="">Select Doctor</option>
                  {doctorsList.map((doc, idx) => (
                    <option key={idx} value={doc}>{doc}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-1.5 text-left">
                <label className="text-xs text-ink/65 font-bold font-display">Appointment Type</label>
                <select
                  value={bookingType}
                  onChange={(e) => setBookingType(e.target.value as any)}
                  className="w-full bg-paper border border-grid rounded-lg p-2 text-sm text-ink font-display focus:outline-none"
                >
                  <option value="Consultation">Consultation</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Therapy">Therapy</option>
                  <option value="Diagnostic">Diagnostic</option>
                </select>
              </div>
            </div>

            {/* Resource select */}
            <div className="flex flex-col space-y-1.5 text-left">
              <label className="text-xs text-ink/65 font-bold font-display">Environment / Equipment Resource</label>
              <select
                required
                value={resourceId}
                onChange={(e) => setResourceId(e.target.value)}
                className="w-full bg-paper border border-grid rounded-lg p-2 text-sm text-ink font-mono focus:outline-none focus:ring-1 focus:ring-teal"
              >
                <option value="">Select Resource</option>
                {hospitalResources
                  .filter(r => r.status === 'Available')
                  .map(res => (
                    <option key={res.id} value={res.id}>{res.name} ({res.department})</option>
                  ))}
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5 text-left">
                <label className="text-xs text-ink/65 font-bold font-display">Date</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-paper border border-grid rounded-lg p-2 text-sm text-ink font-mono focus:outline-none"
                />
              </div>

              <div className="flex flex-col space-y-1.5 text-left">
                <label className="text-xs text-ink/65 font-bold font-display">Time</label>
                <input
                  type="time"
                  required
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full bg-paper border border-grid rounded-lg p-2 text-sm text-ink font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col space-y-1.5 text-left">
              <label className="text-xs text-ink/65 font-bold font-display">Consultation Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Chief complaints, pre-op instructions..."
                rows={2}
                className="w-full bg-paper border border-grid rounded-lg p-2 text-sm text-ink placeholder-ink/40 focus:outline-none focus:ring-1 focus:ring-teal"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsBookModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Book Slot
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Appointment Detail View / Cancellation */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-md">
          {selectedAppointment && (
            <>
              <DialogHeader>
                <DialogTitle>Appointment Details</DialogTitle>
                <DialogDescription>
                  Review booking credentials or cancel the schedule slot.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-left">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-ink/60 font-semibold font-display">Patient Name</span>
                    <p className="text-ink font-bold mt-0.5 font-display">{selectedAppointment.patientName}</p>
                  </div>
                  <div>
                    <span className="text-ink/60 font-semibold font-display">Attending Doctor</span>
                    <p className="text-ink font-bold mt-0.5 font-display">{selectedAppointment.doctor}</p>
                  </div>
                  <div>
                    <span className="text-ink/60 font-semibold font-display">Schedule Time</span>
                    <p className="text-ink font-bold mt-0.5 flex items-center font-mono">
                      <Clock className="w-3 h-3 mr-1 text-teal" />
                      {selectedAppointment.date} @ {selectedAppointment.time}
                    </p>
                  </div>
                  <div>
                    <span className="text-ink/60 font-semibold font-display">Department</span>
                    <p className="text-ink font-bold mt-0.5 font-display">{selectedAppointment.department}</p>
                  </div>
                </div>

                <div className="text-xs border-t border-grid pt-3">
                  <span className="text-ink/60 font-semibold font-display">Assigned Resource</span>
                  <p className="text-ink font-bold mt-0.5 font-display">
                    {hospitalResources.find(r => r.id === selectedAppointment.resourceId)?.name || 'Equipment Standard'}
                  </p>
                </div>

                {selectedAppointment.notes && (
                  <div className="text-xs border-t border-grid pt-3">
                    <span className="text-ink/60 font-semibold font-display">Clinical Notes</span>
                    <p className="text-ink/75 italic mt-0.5 bg-paper border border-grid p-2.5 rounded-lg font-medium">"{selectedAppointment.notes}"</p>
                  </div>
                )}
              </div>

              <DialogFooter className="pt-4 border-t border-grid flex sm:justify-between items-center">
                <Button 
                  type="button" 
                  variant="danger" 
                  onClick={() => handleCancelAppointment(selectedAppointment.id)}
                  className="mr-auto select-none"
                >
                  <Trash className="w-4 h-4 mr-1.5" /> Cancel Appointment
                </Button>
                <Button type="button" variant="secondary" onClick={() => setIsDetailModalOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default AppointmentScheduler;
