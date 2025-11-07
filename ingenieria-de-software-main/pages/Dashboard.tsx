import React from 'react';
import { Page } from '../App';
import { ChevronRightIcon, DashboardIcon, LabIcon, PatientIcon, ResultsIcon } from '../components/Icons';

interface DashboardProps {
  setPage: (page: Page) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setPage }) => {
  const cards = [
    {
      page: Page.PATIENTS,
      title: 'Ingresar Paciente',
      description: 'Registrar y gestionar la información de los pacientes.',
      icon: <PatientIcon className="w-8 h-8 text-blue-500" />
    },
    {
      page: Page.RESULTS,
      title: 'Ingresar/Consultar Resultados',
      description: 'Añadir y consultar los resultados del perfil lipídico.',
      icon: <ResultsIcon className="w-8 h-8 text-blue-500" />
    },
    {
      page: Page.LAB_TECHS,
      title: 'Gestión de Laboratorio',
      description: 'Administrar el personal y recursos del laboratorio.',
      icon: <LabIcon className="w-8 h-8 text-blue-500" />
    }
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Página Principal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <button
            key={index}
            onClick={() => setPage(card.page)}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 text-left flex items-center group"
          >
            <div className="bg-blue-100 p-4 rounded-full mr-6">
              {card.icon}
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-semibold text-slate-700">{card.title}</h2>
              <p className="text-slate-500 mt-1">{card.description}</p>
            </div>
            <ChevronRightIcon className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;