'use client';

import { useEffect, useState } from 'react';
import { Note, saveNote, getAllNotes, syncNoteToServer } from '@/lib/idb';

export default function NotesPage() {
  
  // `content` holds the current value of the textarea
  // `notes` holds all notes fetched from IndexedDB
  
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);

  
  // Runs once when the component mounts
   
  useEffect(() => {
    // Load all existing notes from IndexedDB
    loadNotes();

    // If the app starts while online, attempt to sync pending notes
    if (navigator.onLine) {
      syncPendingNotes();
    }

    // Listen for the browser "online" event.
    // This fires when the user regains internet connectivity.
     
    window.addEventListener('online', syncPendingNotes);

    
    // Cleanup listener when the component unmounts 
    return () => {
      window.removeEventListener('online', syncPendingNotes);
    };
  }, []);

  
  // Fetch all notes from IndexedDB and update React state
   
  async function loadNotes() {
    const storedNotes = await getAllNotes();
    setNotes(storedNotes);
  }

  
  // Handles saving a new note
  // This works both offline and online
   
  async function handleSave() {
    
    // Create a new note object
    // - `id`: unique identifier (used as IndexedDB key)
    // - `synced`: false means this note has not been sent to the server yet
     
    const note: Note = {
      id: crypto.randomUUID(),
      content,
      updatedAt: Date.now(),
      synced: false,
    };

    
    // Save the note locally in IndexedDB
    // This always succeeds, even when offline
     
    await saveNote(note);

    // Clear the input field
    setContent('');

    // Refresh UI from IndexedDB
    loadNotes();

    
    // Try syncing the note to the server immediately
    // If offline, this will fail and be retried later
     
    try {
      await syncNoteToServer(note);

      // Mark note as synced once server confirms
      note.synced = true;
      await saveNote(note);

      // Refresh UI again to reflect synced status
      loadNotes();
    } catch {
      // Expected behavior when offline
      console.log('Saved offline');
    }
  }

  
  // Sync all notes that are still marked as `synced: false`
  // This is triggered when the app comes back online
   
  async function syncPendingNotes() {
    const allNotes = await getAllNotes();

    // Filter notes that haven't been synced yet
    for (const note of allNotes.filter((n) => !n.synced)) {
      try {
        await syncNoteToServer(note);

        // Update sync status after successful upload
        note.synced = true;
        await saveNote(note);
      } catch {
        // Ignore failures (e.g., network drops again)
      }
    }

    // Reload notes to reflect updated sync status
    loadNotes();
  }

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h1>Offline Notes (IndexedDB Demo)</h1>

      {/* Note input */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a note..."
        rows={4}
        style={{ width: '100%', marginBottom: 12 }}
      />

      <button onClick={handleSave}>Save Note</button>

      {/* Online / Offline status */}
      <p>
        Status: <strong>{navigator.onLine ? 'Online' : 'Offline'}</strong>
      </p>

      <br />

      {/* List all notes from IndexedDB */}
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            {note.content} — {note.synced ? '✅ Synced' : '⏳ Pending'}
          </li>
        ))}
      </ul>
    </main>
  );
}
