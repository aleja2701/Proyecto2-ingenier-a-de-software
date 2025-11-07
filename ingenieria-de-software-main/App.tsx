import React, { useState, useEffect } from 'react';
import { Patient, LabTechnician, LipidProfile, ProfessionalTitle } from './types';
import { patientService } from './src/services/api';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Results from './pages/Results';
import LabTechs from './pages/LabTechs';
import { DashboardIcon, LabIcon, PatientIcon, ResultsIcon } from './components/Icons';

export enum Page {
  DASHBOARD,
  PATIENTS,
  RESULTS,
  LAB_TECHS
}

// Mock Data
const initialPatients: Patient[] = [
    { id: '10203040', entryCode: 'P0001', name: 'Juan', lastName: 'Pérez', address: 'Calle 123', phone: '3001234567' },
    { id: '50607080', entryCode: 'P0002', name: 'Ana', lastName: 'García', address: 'Av. Siempre Viva 742', phone: '3109876543' },
];

const initialLabTechs: LabTechnician[] = [
    { id: 'LT-01', name: 'Carlos Rodriguez', title: ProfessionalTitle.BACTERIOLOGIST, phone: '3216549870' },
    { id: 'LT-02', name: 'Maria Lopez', title: ProfessionalTitle.MICROBIOLOGIST, phone: '3157894561' },
];

const initialResults: LipidProfile[] = [
    { id: 'R001', patientEntryCode: 'P0001', totalCholesterol: 210, hdlCholesterol: 45, ldlCholesterol: 130, triglycerides: 150, labTechnicianId: 'LT-01', date: new Date().toISOString() },
];

const App: React.FC = () => {
  const [page, setPage] = useState<Page>(Page.DASHBOARD);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [labTechnicians, setLabTechnicians] = useState<LabTechnician[]>(initialLabTechs);
  const [results, setResults] = useState<LipidProfile[]>(initialResults);

  // Patient CRUD
  // Load patients from backend on mount
  useEffect(() => {
    let mounted = true;
    patientService.getAll()
      .then(res => {
        if (!mounted) return;
        const mapped: Patient[] = res.data.map((p: any) => ({
          id: p.document || String(p.id),
          entryCode: p.admission_code || '',
          name: p.first_name || '',
          lastName: p.last_name || '',
          address: p.address || '',
          phone: p.phone || '',
          backendId: p.id,
        }));
        if (mapped.length) setPatients(mapped);
      })
      .catch(() => {
        // keep initialPatients if backend not available
      });
    return () => { mounted = false; };
  }, []);

  const addPatient = async (patient: Omit<Patient, 'entryCode'>) => {
    try {
      const payload = {
        document: patient.id,
        first_name: patient.name,
        last_name: patient.lastName,
        address: patient.address,
        phone: patient.phone,
      };
      const res = await patientService.create(payload);
      const p = res.data;
      const mapped: Patient = {
        id: p.document || patient.id,
        entryCode: p.admission_code || `P${(patients.length + 1).toString().padStart(4, '0')}`,
        name: p.first_name || patient.name,
        lastName: p.last_name || patient.lastName,
        address: p.address || patient.address,
        phone: p.phone || patient.phone,
        backendId: p.id,
      };
      setPatients(prev => [...prev, mapped]);
    } catch (err) {
      // fallback to local-only behavior
      const newEntryCode = `P${(patients.length + 1).toString().padStart(4, '0')}`;
      setPatients(prev => [...prev, { ...patient, entryCode: newEntryCode }]);
    }
  };
  const updatePatient = async (updatedPatient: Patient) => {
    if (updatedPatient.backendId) {
      try {
        const payload = {
          document: updatedPatient.id,
          first_name: updatedPatient.name,
          last_name: updatedPatient.lastName,
          address: updatedPatient.address,
          phone: updatedPatient.phone,
        };
        const res = await patientService.update(String(updatedPatient.backendId), payload);
        const p = res.data;
        const mapped: Patient = {
          id: p.document || updatedPatient.id,
          entryCode: p.admission_code || updatedPatient.entryCode,
          name: p.first_name || updatedPatient.name,
          lastName: p.last_name || updatedPatient.lastName,
          address: p.address || updatedPatient.address,
          phone: p.phone || updatedPatient.phone,
          backendId: p.id || updatedPatient.backendId,
        };
        setPatients(prev => prev.map(x => x.id === mapped.id ? mapped : x));
        return;
      } catch (e) {
        // fall through to local update
      }
    }
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };
  const deletePatient = async (id: string) => {
    const found = patients.find(p => p.id === id);
    if (found && found.backendId) {
      try {
        await patientService.delete(String(found.backendId));
        setPatients(prev => prev.filter(p => p.id !== id));
        return;
      } catch (e) {
        // fallback to local delete
      }
    }
    setPatients(prev => prev.filter(p => p.id !== id));
  };
  
  // LabTech CRUD
  const addLabTechnician = (labTech: LabTechnician) => setLabTechnicians([...labTechnicians, labTech]);
  const updateLabTechnician = (updatedLabTech: LabTechnician) => setLabTechnicians(labTechnicians.map(l => l.id === updatedLabTech.id ? updatedLabTech : l));
  const deleteLabTechnician = (id: string) => setLabTechnicians(labTechnicians.filter(l => l.id !== id));

  // Result CRUD
  const addResult = (result: Omit<LipidProfile, 'id' | 'date'>) => {
    const newResult = { ...result, id: `R${(results.length + 1).toString().padStart(3, '0')}`, date: new Date().toISOString() };
    setResults([...results, newResult]);
  };
  const updateResult = (updatedResult: LipidProfile) => setResults(results.map(r => r.id === updatedResult.id ? updatedResult : r));
  const deleteResult = (id: string) => setResults(results.filter(r => r.id !== id));

  const renderPage = () => {
    switch (page) {
      case Page.PATIENTS:
        return <Patients patients={patients} addPatient={addPatient} updatePatient={updatePatient} deletePatient={deletePatient} setPage={setPage} />;
      case Page.RESULTS:
        return <Results results={results} patients={patients} labTechnicians={labTechnicians} addResult={addResult} updateResult={updateResult} deleteResult={deleteResult} setPage={setPage} />;
      case Page.LAB_TECHS:
        return <LabTechs labTechnicians={labTechnicians} addLabTechnician={addLabTechnician} updateLabTechnician={updateLabTechnician} deleteLabTechnician={deleteLabTechnician} setPage={setPage} />;
      case Page.DASHBOARD:
      default:
        return <Dashboard setPage={setPage} />;
    }
  };

  // FIX: Changed JSX.Element to React.ReactElement to avoid "Cannot find namespace 'JSX'" error.
  const NavItem = ({ targetPage, icon, label }: { targetPage: Page, icon: React.ReactElement, label: string }) => {
    const isActive = page === targetPage;
    return (
      <button
        onClick={() => setPage(targetPage)}
        className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
          isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-200 hover:bg-blue-800'
        }`}
      >
        {React.cloneElement(icon, { className: 'w-6 h-6 mr-4' })}
        <span className="font-medium">{label}</span>
      </button>
    );
  };
  
  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col p-4 shadow-2xl">
        <div className="text-2xl font-bold mb-10 p-2 border-b border-slate-700">
          VitalSoft <span className="text-blue-400">LIS</span>
        </div>
        <nav className="flex flex-col space-y-2">
          <NavItem targetPage={Page.DASHBOARD} icon={<DashboardIcon />} label="Página Principal" />
          <NavItem targetPage={Page.PATIENTS} icon={<PatientIcon />} label="Ingresar Paciente" />
          <NavItem targetPage={Page.RESULTS} icon={<ResultsIcon />} label="Resultados" />
          <NavItem targetPage={Page.LAB_TECHS} icon={<LabIcon />} label="Gestión de Laboratorio" />
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto bg-slate-50">
        <div key={page} className="page-transition">
          {renderPage()}
        </div>
      </main>
      <style>{`
        .page-transition {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;