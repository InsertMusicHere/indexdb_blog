export interface Note {
  id: string;        // Primary key
  content: string;   // Note text
  updatedAt: number; // Timestamp (used for sorting or syncing)
  synced: boolean;   // Whether this note is synced to the server
}

// IndexedDB configuration
const DB_NAME = 'offline-notes-db';
const STORE_NAME = 'notes';
const DB_VERSION = 1;

// Opens (or creates) the IndexedDB database

// IndexedDB is versioned.
// `onupgradeneeded` runs when:
// - The DB is created for the first time
// - The version number increases

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Called when the database structure needs to be created or updated
    request.onupgradeneeded = () => {
      const db = request.result;

      // Create an object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    // Database opened successfully
    request.onsuccess = () => resolve(request.result);

    // Failed to open database
    request.onerror = () => reject(request.error);
  });
}

// Insert or update a note in IndexedDB

// `put` will:
// - Insert if the key does not exist
// - Update if the key already exists

export async function saveNote(note: Note) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put(note);
}

// Retrieve all notes from IndexedDB
export async function getAllNotes(): Promise<Note[]> {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const request = tx.objectStore(STORE_NAME).getAll();

  return new Promise((resolve) => {
    request.onsuccess = () => resolve(request.result);
  });
}

// Fake API to simulate backend sync
// This mimics:
// - Network latency
// - Online/offline failures
export async function syncNoteToServer(note: Note) {
  await new Promise((r) => setTimeout(r, 1000));

  if (!navigator.onLine) {
    throw new Error('Offline');
  }

  console.log('Synced to server:', note);
  return { success: true };
}
