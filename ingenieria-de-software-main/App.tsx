import React, { useState, useEffect } from 'react';
import { Patient, LabTechnician, LipidProfile, ProfessionalTitle } from './types';
import { patientService, specialistService, resultService } from './src/services/api';
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

  // Helper maps between backend title codes and our ProfessionalTitle enum
  const codeToProfessionalTitle = (code: string): ProfessionalTitle => {
    switch (code) {
      case 'BACT':
        return ProfessionalTitle.BACTERIOLOGIST;
      case 'MICR':
        return ProfessionalTitle.MICROBIOLOGIST;
      case 'BIOL':
        return ProfessionalTitle.BIOLOGIST;
      default:
        return ProfessionalTitle.BACTERIOLOGIST;
    }
  };

  const professionalTitleToCode = (title: ProfessionalTitle): string => {
    switch (title) {
      case ProfessionalTitle.BACTERIOLOGIST:
        return 'BACT';
      case ProfessionalTitle.MICROBIOLOGIST:
        return 'MICR';
      case ProfessionalTitle.BIOLOGIST:
        return 'BIOL';
      default:
        return 'BACT';
    }
  };

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
      .catch((err) => {
        console.error('Error loading patients from backend:', err);
        // keep initialPatients if backend not available
      });
    return () => { mounted = false; };
  }, []);

  // Load specialists (lab technicians) from backend on mount
  useEffect(() => {
    let mounted = true;
    specialistService.getAll()
      .then(res => {
        if (!mounted) return;
        // The backend returns internal_code, name, title (code), phone, id
        const mapped: LabTechnician[] = res.data.map((s: any) => ({
          id: s.internal_code || String(s.id),
          name: s.name || '',
          title: codeToProfessionalTitle(s.title || 'BACT'),
          phone: s.phone || '',
          backendId: s.id,
        }));
        if (mapped.length) setLabTechnicians(mapped);
      })
      .catch(err => {
        console.error('Error loading specialists from backend:', err);
        // keep initialLabTechs if backend not available
      });
    return () => { mounted = false; };
  }, []);

  // Load results from backend on mount
  useEffect(() => {
    let mounted = true;
    resultService.getAll()
      .then(res => {
        if (!mounted) return;
        // Backend returns result objects with patient_details and specialist_details
        const mapped: LipidProfile[] = res.data.map((r: any) => ({
          id: String(r.id),
          patientEntryCode: (r.patient_details && r.patient_details.admission_code) || '',
          totalCholesterol: Number(r.total_cholesterol) || 0,
          hdlCholesterol: Number(r.hdl_cholesterol) || 0,
          ldlCholesterol: Number(r.ldl_cholesterol) || 0,
          triglycerides: Number(r.triglycerides) || 0,
          labTechnicianId: (r.specialist_details && r.specialist_details.internal_code) || '',
          date: r.created_at || new Date().toISOString(),
        }));
        if (mapped.length) setResults(mapped);
      })
      .catch(err => {
        console.error('Error loading results from backend:', err);
        // keep initialResults if backend not available
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
      console.error('Error creating patient via API:', err);
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
        console.error('Error updating patient via API:', e);
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
        console.error('Error deleting patient via API:', e);
        // fallback to local delete
      }
    }
    setPatients(prev => prev.filter(p => p.id !== id));
  };
  
  // LabTech CRUD
  const addLabTechnician = (labTech: LabTechnician) => {
    // attempt to persist to backend, but fall back to local-only
    (async () => {
      try {
        const payload = {
          internal_code: labTech.id,
          name: labTech.name,
          title: professionalTitleToCode(labTech.title),
          phone: labTech.phone,
        };
        const res = await specialistService.create(payload);
        const s = res.data;
        const mapped: LabTechnician = {
          id: s.internal_code || labTech.id,
          name: s.name || labTech.name,
          title: codeToProfessionalTitle(s.title || 'BACT'),
          phone: s.phone || labTech.phone,
          backendId: s.id,
        };
        setLabTechnicians(prev => [...prev, mapped]);
        return;
      } catch (e) {
        console.error('Error creating specialist via API:', e);
        setLabTechnicians(prev => [...prev, labTech]);
      }
    })();
  };

  const updateLabTechnician = (updatedLabTech: LabTechnician) => {
    (async () => {
      // If we have a backendId, update on server
      const backendId = (updatedLabTech as any).backendId;
      if (backendId) {
        try {
          const payload = {
            internal_code: updatedLabTech.id,
            name: updatedLabTech.name,
            title: professionalTitleToCode(updatedLabTech.title),
            phone: updatedLabTech.phone,
          };
          const res = await specialistService.update(String(backendId), payload);
          const s = res.data;
          const mapped: LabTechnician = {
            id: s.internal_code || updatedLabTech.id,
            name: s.name || updatedLabTech.name,
            title: codeToProfessionalTitle(s.title || 'BACT'),
            phone: s.phone || updatedLabTech.phone,
            backendId: s.id || backendId,
          };
          setLabTechnicians(prev => prev.map(l => l.id === mapped.id ? mapped : l));
          return;
        } catch (e) {
          console.error('Error updating specialist via API:', e);
          // fall back to local update
        }
      }
      setLabTechnicians(prev => prev.map(l => l.id === updatedLabTech.id ? updatedLabTech : l));
    })();
  };

  const deleteLabTechnician = (id: string) => {
    const found = labTechnicians.find(l => l.id === id);
    if (found && (found as any).backendId) {
      (async () => {
        try {
          await specialistService.delete(String((found as any).backendId));
          setLabTechnicians(prev => prev.filter(l => l.id !== id));
          return;
        } catch (e) {
          console.error('Error deleting specialist via API:', e);
        }
        // fallback local delete
        setLabTechnicians(prev => prev.filter(l => l.id !== id));
      })();
      return;
    }
    setLabTechnicians(prev => prev.filter(l => l.id !== id));
  };

  // Result CRUD
  const addResult = (result: Omit<LipidProfile, 'id' | 'date'>) => {
    // Try to persist to backend using patient.backendId and specialist.backendId when available
    (async () => {
      try {
        // find patient backend id from patients list
        const patient = patients.find(p => p.entryCode === result.patientEntryCode);
        const patientPk = patient && patient.backendId ? patient.backendId : undefined;
        // find specialist backend id from labTechnicians list
        const specialist = labTechnicians.find(l => l.id === result.labTechnicianId);
        const specialistPk = specialist && (specialist as any).backendId ? (specialist as any).backendId : undefined;

        if (patientPk && specialistPk) {
          const payload = {
            patient: patientPk,
            specialist: specialistPk,
            total_cholesterol: result.totalCholesterol,
            hdl_cholesterol: result.hdlCholesterol,
            ldl_cholesterol: result.ldlCholesterol,
            triglycerides: result.triglycerides,
          };
          const res = await resultService.create(payload);
          const r = res.data;
          const mapped: LipidProfile = {
            id: String(r.id),
            patientEntryCode: (r.patient_details && r.patient_details.admission_code) || result.patientEntryCode,
            totalCholesterol: Number(r.total_cholesterol) || result.totalCholesterol,
            hdlCholesterol: Number(r.hdl_cholesterol) || result.hdlCholesterol,
            ldlCholesterol: Number(r.ldl_cholesterol) || result.ldlCholesterol,
            triglycerides: Number(r.triglycerides) || result.triglycerides,
            labTechnicianId: (r.specialist_details && r.specialist_details.internal_code) || result.labTechnicianId,
            date: r.created_at || new Date().toISOString(),
          };
          setResults(prev => [...prev, mapped]);
          return;
        }
      } catch (e) {
        console.error('Error creating result via API:', e);
        // fallback to local-only below
      }

      const newResult = { ...result, id: `R${(results.length + 1).toString().padStart(3, '0')}`, date: new Date().toISOString() };
      setResults(prev => [...prev, newResult]);
    })();
  };

  const updateResult = (updatedResult: LipidProfile) => {
    (async () => {
      // if id looks like a backend id (numeric) try updating backend
      const backendId = Number(updatedResult.id);
      if (!Number.isNaN(backendId)) {
        try {
          // Map fields for API
          const payload = {
            total_cholesterol: updatedResult.totalCholesterol,
            hdl_cholesterol: updatedResult.hdlCholesterol,
            ldl_cholesterol: updatedResult.ldlCholesterol,
            triglycerides: updatedResult.triglycerides,
          };
          const res = await resultService.update(String(backendId), payload);
          const r = res.data;
          const mapped: LipidProfile = {
            id: String(r.id),
            patientEntryCode: (r.patient_details && r.patient_details.admission_code) || updatedResult.patientEntryCode,
            totalCholesterol: Number(r.total_cholesterol) || updatedResult.totalCholesterol,
            hdlCholesterol: Number(r.hdl_cholesterol) || updatedResult.hdlCholesterol,
            ldlCholesterol: Number(r.ldl_cholesterol) || updatedResult.ldlCholesterol,
            triglycerides: Number(r.triglycerides) || updatedResult.triglycerides,
            labTechnicianId: (r.specialist_details && r.specialist_details.internal_code) || updatedResult.labTechnicianId,
            date: r.created_at || updatedResult.date,
          };
          setResults(prev => prev.map(x => x.id === mapped.id ? mapped : x));
          return;
        } catch (e) {
          console.error('Error updating result via API:', e);
        }
      }
      setResults(prev => prev.map(r => r.id === updatedResult.id ? updatedResult : r));
    })();
  };

  const deleteResult = (id: string) => {
    // if id is numeric, attempt delete on backend
    const backendId = Number(id);
    if (!Number.isNaN(backendId)) {
      (async () => {
        try {
          await resultService.delete(String(backendId));
          setResults(prev => prev.filter(r => r.id !== id));
          return;
        } catch (e) {
          console.error('Error deleting result via API:', e);
        }
        setResults(prev => prev.filter(r => r.id !== id));
      })();
      return;
    }
    setResults(prev => prev.filter(r => r.id !== id));
  };

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