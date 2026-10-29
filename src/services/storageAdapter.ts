import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { AttendeeRecord, OperationType } from '../types';

export type StorageMode = 'cloud' | 'local';

export interface IAttendeeRepository {
  mode: StorageMode;
  getAll(): Promise<AttendeeRecord[]>;
  create(data: Omit<AttendeeRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<AttendeeRecord>;
  update(id: string, updates: Partial<Omit<AttendeeRecord, 'id' | 'createdAt'>>): Promise<void>;
  delete(id: string): Promise<void>;
  subscribe(onUpdate: (attendees: AttendeeRecord[]) => void, onError?: (err: Error) => void): Unsubscribe;
}

const SEED_ATTENDEES: Omit<AttendeeRecord, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    fullName: 'Ing. Julián Camilo Vargas',
    email: 'julian.vargas@uptc.edu.co',
    role: 'Desarrollador / Ingeniero',
    organization: 'UPTC - Grupo SInC',
    attendanceType: 'presencial',
    primaryTrack: 'Ambos (Java + IA)',
    ticketNumber: 'JAI-BOY-2026-1042',
    status: 'confirmado',
    notes: 'Interesado en participar en el mini-hackathon de LangChain4j.',
  },
  {
    fullName: 'Laura Marcela Pinzón',
    email: 'laura.pinzon@tunja-tech.org',
    role: 'Estudiante UPTC',
    organization: 'Escuela de Ingeniería de Sistemas UPTC',
    attendanceType: 'presencial',
    primaryTrack: 'Core Java & Loom',
    ticketNumber: 'JAI-BOY-2026-1088',
    status: 'checkin',
    notes: 'Acreditación presencial verificada en Paraninfo San Jerónimo.',
  },
  {
    fullName: 'David Esteban Roa',
    email: 'david.roa@boyacadevs.org',
    role: 'Líder Tech / Empresa',
    organization: 'Boyacá Devs / Sogamoso Lab',
    attendanceType: 'presencial',
    primaryTrack: 'IA Generativa & LangChain4j',
    ticketNumber: 'JAI-BOY-2026-1120',
    status: 'confirmado',
    notes: 'Coordinador del track de innovación abierta.',
  },
  {
    fullName: 'Dra. María Elena Castañeda',
    email: 'maria.castaneda@uptc.edu.co',
    role: 'Docente / Investigador',
    organization: 'Facultad de Ingeniería UPTC',
    attendanceType: 'presencial',
    primaryTrack: 'Ambos (Java + IA)',
    ticketNumber: 'JAI-BOY-2026-1155',
    status: 'confirmado',
    notes: 'Docente titular en Sistemas Distribuidos.',
  },
];

/* -------------------------------------------------------------
 * 1. IMPLEMENTACIÓN CLOUD: Firebase Firestore
 * ------------------------------------------------------------- */
export class FirestoreAttendeeRepository implements IAttendeeRepository {
  public mode: StorageMode = 'cloud';
  private collectionName = 'attendees';

  async getAll(): Promise<AttendeeRecord[]> {
    try {
      const q = query(collection(db, this.collectionName), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list: AttendeeRecord[] = [];
      snapshot.forEach((snap) => {
        list.push({ id: snap.id, ...(snap.data() as Omit<AttendeeRecord, 'id'>) });
      });
      return list;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, this.collectionName);
    }
  }

  async create(data: Omit<AttendeeRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<AttendeeRecord> {
    try {
      const docId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date().toISOString();
      const newRecord: AttendeeRecord = {
        ...data,
        id: docId,
        userId: auth.currentUser?.uid || undefined,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = doc(db, this.collectionName, docId);
      await setDoc(docRef, newRecord);
      return newRecord;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, this.collectionName);
    }
  }

  async update(id: string, updates: Partial<Omit<AttendeeRecord, 'id' | 'createdAt'>>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${this.collectionName}/${id}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${this.collectionName}/${id}`);
    }
  }

  subscribe(onUpdate: (attendees: AttendeeRecord[]) => void, onError?: (err: Error) => void): Unsubscribe {
    const q = query(collection(db, this.collectionName), orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      async (snapshot) => {
        if (snapshot.empty) {
          try {
            await this.seedInitial();
            return;
          } catch (e) {
            console.warn('Seeding skipped:', e);
          }
        }
        const list: AttendeeRecord[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...(docSnap.data() as Omit<AttendeeRecord, 'id'>) });
        });
        onUpdate(list);
      },
      (error) => {
        if (onError) onError(error);
        else handleFirestoreError(error, OperationType.LIST, this.collectionName);
      }
    );
  }

  private async seedInitial(): Promise<void> {
    for (const item of SEED_ATTENDEES) {
      const docId = `att_seed_${item.ticketNumber.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`;
      const now = new Date().toISOString();
      const docRef = doc(db, this.collectionName, docId);
      await setDoc(docRef, {
        ...item,
        id: docId,
        createdAt: now,
        updatedAt: now,
      });
    }
  }
}

/* -------------------------------------------------------------
 * 2. IMPLEMENTACIÓN LOCAL: LocalStorage & In-Memory Sandbox
 * Ideal para pruebas locales independientes sin conexión ni claves
 * ------------------------------------------------------------- */
export class LocalAttendeeRepository implements IAttendeeRepository {
  public mode: StorageMode = 'local';
  private storageKey = 'java_ai_day_boyaca_attendees_local';
  private listeners: Set<(attendees: AttendeeRecord[]) => void> = new Set();

  constructor() {
    this.ensureInitialData();
  }

  private getItems(): AttendeeRecord[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('LocalStorage unavailable, using in-memory');
    }
    return this.generateSeedItems();
  }

  private saveItems(items: AttendeeRecord[]) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (e) {
      console.warn('Cannot write to localStorage');
    }
    this.notify(items);
  }

  private generateSeedItems(): AttendeeRecord[] {
    const now = new Date().toISOString();
    return SEED_ATTENDEES.map((item, idx) => ({
      ...item,
      id: `local_att_${idx + 1}`,
      createdAt: now,
      updatedAt: now,
    }));
  }

  private ensureInitialData() {
    try {
      if (!localStorage.getItem(this.storageKey)) {
        this.saveItems(this.generateSeedItems());
      }
    } catch {
      // ignore
    }
  }

  private notify(items: AttendeeRecord[]) {
    this.listeners.forEach((listener) => listener(items));
  }

  async getAll(): Promise<AttendeeRecord[]> {
    return this.getItems();
  }

  async create(data: Omit<AttendeeRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<AttendeeRecord> {
    const items = this.getItems();
    const docId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const newRecord: AttendeeRecord = {
      ...data,
      id: docId,
      createdAt: now,
      updatedAt: now,
    };

    items.unshift(newRecord);
    this.saveItems(items);
    return newRecord;
  }

  async update(id: string, updates: Partial<Omit<AttendeeRecord, 'id' | 'createdAt'>>): Promise<void> {
    const items = this.getItems();
    const idx = items.findIndex((it) => it.id === id);
    if (idx !== -1) {
      items[idx] = {
        ...items[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.saveItems(items);
    }
  }

  async delete(id: string): Promise<void> {
    const items = this.getItems().filter((it) => it.id !== id);
    this.saveItems(items);
  }

  subscribe(onUpdate: (attendees: AttendeeRecord[]) => void): Unsubscribe {
    this.listeners.add(onUpdate);
    onUpdate(this.getItems());

    // Window storage listener for multi-tab sync
    const handleStorage = (event: StorageEvent) => {
      if (event.key === this.storageKey) {
        onUpdate(this.getItems());
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      this.listeners.delete(onUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }

  resetToDefault() {
    const defaults = this.generateSeedItems();
    this.saveItems(defaults);
  }
}

// Singletons
export const firestoreRepo = new FirestoreAttendeeRepository();
export const localRepo = new LocalAttendeeRepository();

// Configurable Active Repository
let currentMode: StorageMode = 'cloud';

export function getActiveRepository(): IAttendeeRepository {
  return currentMode === 'cloud' ? firestoreRepo : localRepo;
}

export function setActiveRepositoryMode(mode: StorageMode) {
  currentMode = mode;
  try {
    localStorage.setItem('java_ai_day_preferred_storage', mode);
  } catch {
    // ignore
  }
}

export function getInitialStorageMode(): StorageMode {
  try {
    const saved = localStorage.getItem('java_ai_day_preferred_storage');
    if (saved === 'local' || saved === 'cloud') {
      currentMode = saved;
      return saved;
    }
  } catch {
    // ignore
  }
  return 'cloud';
}
