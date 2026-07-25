import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareStore } from '../store/useCareStore';
import { DataTable } from '../components/DataTable';
import type { ColumnDef } from '../components/DataTable';
import { AlertBadge } from '../components/AlertBadge';
import { FilterBar } from '../components/FilterBar';
import type { Patient } from '../types';
import { RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const PatientDirectory: React.FC = () => {
  const navigate = useNavigate();
  const { 
    patients, 
    searchQuery, 
    setSearchQuery,
    selectedDepartment, 
    setSelectedDepartment,
    selectedStatus, 
    setSelectedStatus 
  } = useCareStore();

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('All');
    setSelectedStatus('All');
  };

  // Filter Patients list based on queries and filters
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      // 1. Search Query Match
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        patient.name.toLowerCase().includes(searchLower) ||
        patient.id.toLowerCase().includes(searchLower) ||
        patient.attendingPhysician.toLowerCase().includes(searchLower) ||
        (patient.bedNumber && patient.bedNumber.toLowerCase().includes(searchLower));

      // 2. Department Match
      const matchesDept = selectedDepartment === 'All' || patient.department === selectedDepartment;

      // 3. Status Match
      const matchesStatus = selectedStatus === 'All' || patient.status === selectedStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [patients, searchQuery, selectedDepartment, selectedStatus]);

  // Define Columns for the DataTable
  const columns: ColumnDef<Patient>[] = [
    {
      header: "Patient ID",
      accessorKey: "id",
      sortable: true,
      cell: (patient) => <span className="font-mono text-xs font-bold text-ink/60">{patient.id}</span>
    },
    {
      header: "Patient Name",
      accessorKey: "name",
      sortable: true,
      cell: (patient) => (
        <div className="flex flex-col text-left">
          <span className="font-semibold text-ink hover:text-teal transition-colors font-display">{patient.name}</span>
          <span className="text-xs text-ink/65 font-mono">{patient.age} yrs • {patient.gender} • Blood: {patient.bloodType}</span>
        </div>
      )
    },
    {
      header: "Attending Physician",
      accessorKey: "attendingPhysician",
      sortable: true,
      cell: (patient) => <span className="text-xs font-semibold text-ink/75">{patient.attendingPhysician}</span>
    },
    {
      header: "Department",
      accessorKey: "department",
      sortable: true,
      cell: (patient) => (
        <span className="text-xs px-2 py-0.5 bg-paper border border-grid text-ink rounded font-mono">
          {patient.department}
        </span>
      )
    },
    {
      header: "Bed Allocation",
      accessorKey: "bedNumber",
      sortable: true,
      cell: (patient) => (
        <span className="text-xs font-semibold text-ink font-mono">
          {patient.bedNumber || 'Not Assigned'}
        </span>
      )
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      cell: (patient) => <AlertBadge status={patient.status} />
    },
    {
      header: "Last Activity",
      accessorKey: "lastVisit",
      sortable: true,
      cell: (patient) => <span className="text-xs text-ink/60 font-mono">{patient.lastVisit}</span>
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Add Patient option */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-ink tracking-wide font-display">Patient Directory</h2>
          <p className="text-xs text-ink/70 mt-1">
            Search, filter, and sort hospital census data. Click rows to inspect profiles.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="secondary" size="sm" onClick={handleResetFilters} className="text-xs select-none">
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Custom Dynamic Filter Bar */}
      <FilterBar 
        selectedDept={selectedDepartment}
        setSelectedDept={setSelectedDepartment}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* Main Datatable */}
      <div className="bg-white border border-grid rounded-lg p-5 shadow-sm">
        <DataTable
          columns={columns}
          data={filteredPatients}
          searchKey="name"
          searchPlaceholder="Filter patients by name, ID, physician..."
          pageSize={10}
          onRowClick={(patient) => navigate(`/patients/${patient.id}`)}
          initialSort={{ key: 'id', direction: 'asc' }}
        />
      </div>
    </div>
  );
};
export default PatientDirectory;
