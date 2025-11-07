
import React, { useState, useEffect } from 'react';
import { Patient } from '../types';
import { Page } from '../App';
import { EditIcon, PlusIcon, SearchIcon, TrashIcon } from '../components/Icons';

interface PatientsProps {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'entryCode'>) => void;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;
  setPage: (page: Page) => void;
}

// Include optional backendId in the local form state so edits can preserve it
const emptyPatient: Omit<Patient, 'entryCode'> & { backendId?: number } = { id: '', name: '', lastName: '', address: '', phone: '' };

const Patients: React.FC<PatientsProps> = ({ patients, addPatient, updatePatient, deletePatient, setPage }) => {
  const [formState, setFormState] = useState<Omit<Patient, 'entryCode'> & { backendId?: number }>(emptyPatient);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.id || !formState.name || !formState.lastName) {
      alert('Documento, Nombre y Apellidos son obligatorios.');
      return;
    }

    if (isEditing) {
      const patientToUpdate = patients.find(p => p.id === isEditing);
      if(patientToUpdate) {
        // include backendId so the App layer can call the backend PUT when available
        updatePatient({ ...formState, id: isEditing, entryCode: patientToUpdate.entryCode, backendId: patientToUpdate.backendId } as Patient);
      }
    } else {
      if (patients.some(p => p.id === formState.id)) {
        alert('El documento ya existe.');
        return;
      }
      addPatient(formState);
    }
    handleClear();
  };

  const handleEdit = (patient: Patient) => {
    setIsEditing(patient.id);
    setFormState({
        id: patient.id,
        name: patient.name,
        lastName: patient.lastName,
        address: patient.address,
        phone: patient.phone,
        // preserve backendId for update
        backendId: patient.backendId
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este paciente?')) {
      deletePatient(id);
      handleClear();
    }
  };

  const handleClear = () => {
    setFormState(emptyPatient);
    setIsEditing(null);
  };
  
  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.includes(searchTerm)
  );

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Ingreso de Paciente</h1>
        <button onClick={() => setPage(Page.DASHBOARD)} className="text-blue-600 hover:underline">Volver al inicio</button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-slate-700 mb-4">{isEditing ? 'Actualizar Paciente' : 'Nuevo Paciente'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="id" value={formState.id} onChange={handleInputChange} placeholder="Documento" className="p-2 border rounded border-slate-300" required disabled={!!isEditing} />
          <input type="text" name="name" value={formState.name} onChange={handleInputChange} placeholder="Nombre" className="p-2 border rounded border-slate-300" required />
          <input type="text" name="lastName" value={formState.lastName} onChange={handleInputChange} placeholder="Apellidos" className="p-2 border rounded border-slate-300" required />
          <input type="text" name="address" value={formState.address} onChange={handleInputChange} placeholder="Dirección" className="p-2 border rounded border-slate-300" />
          <input type="text" name="phone" value={formState.phone} onChange={handleInputChange} placeholder="Teléfono" className="p-2 border rounded border-slate-300" />
          <div className="md:col-span-2 flex justify-end space-x-2">
            <button type="button" onClick={handleClear} className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 transition-colors">Limpiar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">{isEditing ? 'Actualizar' : 'Guardar'}</button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
         <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-700">Pacientes Registrados</h2>
            <div className="relative">
                <input type="text" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="p-2 border rounded border-slate-300 pl-8" />
                <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
         </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3">Documento</th>
                <th className="p-3">Nombre Completo</th>
                <th className="p-3">Código de Ingreso</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(patient => (
                <tr key={patient.id} className="border-b hover:bg-slate-50">
                  <td className="p-3">{patient.id}</td>
                  <td className="p-3">{patient.name} {patient.lastName}</td>
                  <td className="p-3 font-mono">{patient.entryCode}</td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                        <button onClick={() => handleEdit(patient)} className="p-1 text-blue-600 hover:text-blue-800"><EditIcon className="w-5 h-5"/></button>
                        <button onClick={() => handleDelete(patient.id)} className="p-1 text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Patients;
