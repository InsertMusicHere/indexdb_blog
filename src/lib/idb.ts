export interface Note {
  id: string;
  content: string;
  updatedAt: number;
  synced: boolean;
}

const DB_NAME = 'offline-notes-db';
const STORE_NAME = 'notes';
const DB_VERSION = 1;

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveNote(note: Note) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put(note);
}

export async function getAllNotes(): Promise<Note[]> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const request = tx.objectStore(STORE_NAME).getAll();

  return new Promise((resolve) => {
    request.onsuccess = () => resolve(request.result);
  });
}

// Fake API to simulate backend sync
export async function syncNoteToServer(note: Note) {
  await new Promise((r) => setTimeout(r, 1000));

  if (!navigator.onLine) {
    throw new Error('Offline');
  }

  console.log('Synced to server:', note);
  return { success: true };
}
