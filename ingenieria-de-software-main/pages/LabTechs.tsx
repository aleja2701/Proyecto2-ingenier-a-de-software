import React, { useState } from 'react';
import { LabTechnician, ProfessionalTitle } from '../types';
import { Page } from '../App';
import { EditIcon, SearchIcon, TrashIcon } from '../components/Icons';

interface LabTechsProps {
  labTechnicians: LabTechnician[];
  addLabTechnician: (labTechnician: LabTechnician) => void;
  updateLabTechnician: (labTechnician: LabTechnician) => void;
  deleteLabTechnician: (id: string) => void;
  setPage: (page: Page) => void;
}

const emptyLabTech: LabTechnician = { id: '', name: '', title: ProfessionalTitle.BACTERIOLOGIST, phone: '' };

const LabTechs: React.FC<LabTechsProps> = ({ labTechnicians, addLabTechnician, updateLabTechnician, deleteLabTechnician, setPage }) => {
  const [formState, setFormState] = useState<LabTechnician>(emptyLabTech);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.id || !formState.name) {
      alert('Código interno y Nombre completo son obligatorios.');
      return;
    }

    if (isEditing) {
      updateLabTechnician(formState);
    } else {
      if (labTechnicians.some(l => l.id === formState.id)) {
        alert('El código interno ya existe.');
        return;
      }
      addLabTechnician(formState);
    }
    handleClear();
  };

  const handleEdit = (labTechnician: LabTechnician) => {
    setIsEditing(labTechnician.id);
    setFormState(labTechnician);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este profesional?')) {
      deleteLabTechnician(id);
      handleClear();
    }
  };

  const handleClear = () => {
    setFormState(emptyLabTech);
    setIsEditing(null);
  };

  const filteredLabTechs = labTechnicians.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.id.includes(searchTerm)
  );
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Gestión de Laboratorio</h1>
        <button onClick={() => setPage(Page.DASHBOARD)} className="text-blue-600 hover:underline">Volver al inicio</button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-slate-700 mb-4">{isEditing ? 'Actualizar Profesional' : 'Nuevo Profesional'}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="id" value={formState.id} onChange={handleInputChange} placeholder="Código Interno" className="p-2 border rounded border-slate-300" required disabled={!!isEditing} />
          <input type="text" name="name" value={formState.name} onChange={handleInputChange} placeholder="Nombre Completo" className="p-2 border rounded border-slate-300" required />
          <select name="title" value={formState.title} onChange={handleInputChange} className="p-2 border rounded border-slate-300">
            {Object.values(ProfessionalTitle).map(title => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
          <input type="text" name="phone" value={formState.phone} onChange={handleInputChange} placeholder="Teléfono de Contacto" className="p-2 border rounded border-slate-300" />
          <div className="md:col-span-2 flex justify-end space-x-2">
            <button type="button" onClick={handleClear} className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 transition-colors">Limpiar</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">{isEditing ? 'Actualizar' : 'Guardar'}</button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-700">Profesionales Registrados</h2>
            <div className="relative">
                <input type="text" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="p-2 border rounded border-slate-300 pl-8" />
                <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3">Código Interno</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Título</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredLabTechs.map(labTech => (
                <tr key={labTech.id} className="border-b hover:bg-slate-50">
                  <td className="p-3">{labTech.id}</td>
                  <td className="p-3">{labTech.name}</td>
                  <td className="p-3">{labTech.title}</td>
                  <td className="p-3">{labTech.phone}</td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                        <button onClick={() => handleEdit(labTech)} className="p-1 text-blue-600 hover:text-blue-800"><EditIcon className="w-5 h-5"/></button>
                        <button onClick={() => handleDelete(labTech.id)} className="p-1 text-red-600 hover:text-red-800"><TrashIcon className="w-5 h-5"/></button>
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

export default LabTechs;