
export interface Patient {
  id: string; // Documento
  entryCode: string;
  name: string;
  lastName: string;
  address: string;
  phone: string;
  // backendId: optional numeric id returned by the Django API
  backendId?: number;
}

export enum ProfessionalTitle {
  BACTERIOLOGIST = 'Bacteriólogo/a',
  MICROBIOLOGIST = 'Microbiólogo/a',
  BIOLOGIST = 'Biólogo/a',
}

export interface LabTechnician {
  id: string; // Código interno
  name: string;
  title: ProfessionalTitle;
  phone: string;
  // Optional backend numeric id when synced with the Django API
  backendId?: number;
}

export interface LipidProfile {
  id: string;
  patientEntryCode: string;
  totalCholesterol: number;
  hdlCholesterol: number;
  ldlCholesterol: number;
  triglycerides: number;
  labTechnicianId: string;
  date: string;
}
