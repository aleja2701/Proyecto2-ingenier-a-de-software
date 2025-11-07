import React, { useState } from 'react';
import { LipidProfile, Patient, LabTechnician } from '../types';
import { Page } from '../App';
import { DownloadIcon, EditIcon, PlusIcon, SearchIcon, TrashIcon } from '../components/Icons';
import Modal from '../components/Modal';

interface ResultsProps {
  results: LipidProfile[];
  patients: Patient[];
  labTechnicians: LabTechnician[];
  addResult: (result: Omit<LipidProfile, 'id' | 'date'>) => void;
  updateResult: (result: LipidProfile) => void;
  deleteResult: (id: string) => void;
  setPage: (page: Page) => void;
}

const emptyResult: Omit<LipidProfile, 'id' | 'date'> = {
    patientEntryCode: '',
    totalCholesterol: 0,
    hdlCholesterol: 0,
    ldlCholesterol: 0,
    triglycerides: 0,
    labTechnicianId: ''
};

const Results: React.FC<ResultsProps> = ({ results, patients, labTechnicians, addResult, updateResult, deleteResult, setPage }) => {
  const [activeTab, setActiveTab] = useState<'entry' | 'consult'>('entry');
  const [formState, setFormState] = useState<Omit<LipidProfile, 'id' | 'date'>>(emptyResult);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: name.includes('Cholesterol') || name.includes('triglycerides') ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.patientEntryCode || !formState.labTechnicianId) {
      alert('Debe seleccionar un paciente y un profesional.');
      return;
    }

    if (isEditing) {
      const resultToUpdate = results.find(r => r.id === isEditing);
      if(resultToUpdate) {
        updateResult({ ...formState, id: isEditing, date: resultToUpdate.date });
      }
    } else {
      addResult(formState);
      alert('Resultado registrado con éxito.');
    }
    handleClear();
  };
  
  const handleEdit = (result: LipidProfile) => {
    setIsEditing(result.id);
    setFormState({
        patientEntryCode: result.patientEntryCode,
        totalCholesterol: result.totalCholesterol,
        hdlCholesterol: result.hdlCholesterol,
        ldlCholesterol: result.ldlCholesterol,
        triglycerides: result.triglycerides,
        labTechnicianId: result.labTechnicianId
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este resultado?')) {
      deleteResult(id);
      handleClear();
    }
  };

  const handleClear = () => {
    setFormState(emptyResult);
    setIsEditing(null);
  };
  
  const handleViewMore = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.includes(searchTerm)
  );

  const getPatientName = (entryCode: string) => {
    const patient = patients.find(p => p.entryCode === entryCode);
    return patient ? `${patient.name} ${patient.lastName}` : 'N/A';
  }
  const getLabTechName = (id: string) => labTechnicians.find(l => l.id === id)?.name || 'N/A';

  const patientResults = results.filter(r => r.patientEntryCode === selectedPatient?.entryCode);

  const TabButton = ({ tab, label }: { tab: 'entry' | 'consult', label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === tab ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-transparent text-slate-500 hover:bg-slate-100'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Resultados de Perfil Lipídico</h1>
        <button onClick={() => setPage(Page.DASHBOARD)} className="text-blue-600 hover:underline">Volver al inicio</button>
      </div>

      <div className="border-b border-slate-200">
        <TabButton tab="entry" label="Ingresar Resultados" />
        <TabButton tab="consult" label="Consultar Resultados" />
      </div>

      {activeTab === 'entry' && (
        <div className="pt-6">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold text-slate-700 mb-4">{isEditing ? 'Actualizar Resultado' : 'Nuevo Resultado'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select name="patientEntryCode" value={formState.patientEntryCode} onChange={handleInputChange} className="p-2 border rounded border-slate-300" required>
                      <option value="">Seleccione Paciente</option>
                      {patients.map(p => <option key={p.entryCode} value={p.entryCode}>{p.entryCode} - {p.name} {p.lastName}</option>)}
                  </select>
                  <input type="number" name="totalCholesterol" value={formState.totalCholesterol} onChange={handleInputChange} placeholder="Colesterol Total" className="p-2 border rounded border-slate-300" />
                  <input type="number" name="hdlCholesterol" value={formState.hdlCholesterol} onChange={handleInputChange} placeholder="Colesterol HDL" className="p-2 border rounded border-slate-300" />
                  <input type="number" name="ldlCholesterol" value={formState.ldlCholesterol} onChange={handleInputChange} placeholder="Colesterol LDL" className="p-2 border rounded border-slate-300" />
                  <input type="number" name="triglycerides" value={formState.triglycerides} onChange={handleInputChange} placeholder="Triglicéridos" className="p-2 border rounded border-slate-300" />
                  <select name="labTechnicianId" value={formState.labTechnicianId} onChange={handleInputChange} className="p-2 border rounded border-slate-300" required>
                      <option value="">Seleccione Profesional</option>
                      {labTechnicians.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                  <div className="md:col-span-3 flex justify-end space-x-2">
                    <button type="button" onClick={handleClear} className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 transition-colors">Limpiar</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">{isEditing ? 'Actualizar' : 'Guardar'}</button>
                  </div>
                </form>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-slate-700 mb-4">Resultados Registrados</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="p-3">Código Ingreso</th>
                                <th className="p-3">Paciente</th>
                                <th className="p-3">Profesional</th>
                                <th className="p-3">Fecha</th>
                                <th className="p-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(result => (
                                <tr key={result.id} className="border-b hover:bg-slate-50">
                                    <td className="p-3 font-mono">{result.patientEntryCode}</td>
                                    <td className="p-3">{getPatientName(result.patientEntryCode)}</td>
                                    <td className="p-3">{getLabTechName(result.labTechnicianId)}</td>
                                    <td className="p-3">{new Date(result.date).toLocaleDateString()}</td>
                                    <td className="p-3">
                                      <div className="flex space-x-2">
                                        <button onClick={() => handleEdit(result)} className="p-1 text-blue-600 hover:text-blue-800"><EditIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDelete(result.id)} className="p-1 text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5"/></button>
                                      </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'consult' && (
        <div className="pt-6 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-700">Consulta de Resultados</h2>
                <div className="relative">
                    <input type="text" placeholder="Buscar paciente..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="p-2 border rounded border-slate-300 pl-8" />
                    <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="p-3">Documento</th>
                            <th className="p-3">Código Ingreso</th>
                            <th className="p-3">Nombre Completo</th>
                            <th className="p-3">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map(patient => (
                            <tr key={patient.id} className="border-b hover:bg-slate-50">
                                <td className="p-3">{patient.id}</td>
                                <td className="p-3 font-mono">{patient.entryCode}</td>
                                <td className="p-3">{patient.name} {patient.lastName}</td>
                                <td className="p-3">
                                    <button onClick={() => handleViewMore(patient)} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors">Ver más</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Resultados de ${selectedPatient?.name} ${selectedPatient?.lastName}`}>
        {selectedPatient && (
          <div>
            {patientResults.length > 0 ? patientResults.map((result, index) => (
              <div key={result.id} className={`p-4 rounded-lg bg-slate-50 ${index < patientResults.length - 1 ? 'mb-4' : ''}`}>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-slate-600">Análisis del {new Date(result.date).toLocaleString()}</h3>
                    <span className="text-sm text-slate-500">Profesional: {getLabTechName(result.labTechnicianId)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                      <p><strong>Colesterol Total:</strong> {result.totalCholesterol} mg/dL</p>
                      <p><strong>Colesterol HDL:</strong> {result.hdlCholesterol} mg/dL</p>
                      <p><strong>Colesterol LDL:</strong> {result.ldlCholesterol} mg/dL</p>
                      <p><strong>Triglicéridos:</strong> {result.triglycerides} mg/dL</p>
                  </div>
              </div>
            )) : <p>No hay resultados registrados para este paciente.</p>}
            <div className="mt-6 flex justify-end">
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                <DownloadIcon className="w-5 h-5 mr-2"/>
                Descargar PDF
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Results;