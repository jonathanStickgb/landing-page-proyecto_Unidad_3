export interface Speaker {
  id: string;
  name: string;
  role: string;
  company: string;
  bio: string;
  talkTitle: string;
  talkSummary: string;
  track: 'java' | 'ai' | 'cloud' | 'all';
  trackLabel: string;
  image: string;
  codeSnippet: string;
  badges: string[];
  linkedin?: string;
  github?: string;
  twitter?: string;
  featured?: boolean;
}

export interface Alliance {
  id: string;
  name: string;
  type: 'organizador' | 'comunidad' | 'academico' | 'sponsor';
  typeLabel: string;
  shortDesc: string;
  fullDesc: string;
  location: string;
  website: string;
  iconType: 'uptc' | 'jug' | 'boyaca' | 'ai' | 'code' | 'cloud';
}

export interface AgendaItem {
  id: string;
  day: 1 | 2;
  time: string;
  title: string;
  speakerName: string;
  speakerRole: string;
  room: string;
  track: 'java' | 'ai' | 'general';
  description: string;
}

export interface AttendeeTicket {
  ticketNumber: string;
  fullName: string;
  email: string;
  role: string;
  organization: string;
  primaryTrack: string;
  registeredAt: string;
}

export type AttendeeRole =
  | 'Estudiante UPTC'
  | 'Estudiante Otra Universidad'
  | 'Desarrollador / Ingeniero'
  | 'Docente / Investigador'
  | 'Líder Tech / Empresa';

export type AttendeeStatus = 'confirmado' | 'pendiente' | 'checkin' | 'cancelado';
export type AttendanceType = 'presencial' | 'streaming';
export type PrimaryTrack = 'Ambos (Java + IA)' | 'Core Java & Loom' | 'IA Generativa & LangChain4j';

export interface AttendeeRecord {
  id: string;
  fullName: string;
  email: string;
  role: AttendeeRole;
  organization: string;
  attendanceType: AttendanceType;
  primaryTrack: PrimaryTrack;
  ticketNumber: string;
  status: AttendeeStatus;
  notes?: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}
