import { AttendeeRecord } from '../types';
import {
  getActiveRepository,
  setActiveRepositoryMode,
  getInitialStorageMode,
  StorageMode,
  localRepo,
} from './storageAdapter';

export type { StorageMode };
export { setActiveRepositoryMode, getInitialStorageMode, localRepo };

export async function createAttendee(
  data: Omit<AttendeeRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<AttendeeRecord> {
  const repo = getActiveRepository();
  return repo.create(data);
}

export async function updateAttendee(
  id: string,
  updates: Partial<Omit<AttendeeRecord, 'id' | 'createdAt'>>
): Promise<void> {
  const repo = getActiveRepository();
  return repo.update(id, updates);
}

export async function deleteAttendee(id: string): Promise<void> {
  const repo = getActiveRepository();
  return repo.delete(id);
}

export function subscribeToAttendees(
  onUpdate: (attendees: AttendeeRecord[]) => void,
  onError?: (error: Error) => void
) {
  const repo = getActiveRepository();
  return repo.subscribe(onUpdate, onError);
}
