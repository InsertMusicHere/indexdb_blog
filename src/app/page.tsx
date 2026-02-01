'use client';

import { useEffect, useState } from 'react';
import { Note, saveNote, getAllNotes, syncNoteToServer } from '@/lib/idb';

export default function NotesPage() {
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    loadNotes();

    if (navigator.onLine) {
      syncPendingNotes();
    }

    window.addEventListener('online', syncPendingNotes);

    return () => {
      window.removeEventListener('online', syncPendingNotes);
    };
  }, []);


  async function loadNotes() {
    const storedNotes = await getAllNotes();
    setNotes(storedNotes);
  }

  async function handleSave() {
    const note: Note = {
      id: crypto.randomUUID(),
      content,
      updatedAt: Date.now(),
      synced: false,
    };

    await saveNote(note);
    setContent('');
    loadNotes();

    try {
      await syncNoteToServer(note);
      note.synced = true;
      await saveNote(note);
      loadNotes();
    } catch {
      console.log('Saved offline');
    }
  }

  async function syncPendingNotes() {
    const allNotes = await getAllNotes();

    for (const note of allNotes.filter((n) => !n.synced)) {
      try {
        await syncNoteToServer(note);
        note.synced = true;
        await saveNote(note);
      } catch {}
    }

    loadNotes();
  }

  return (
    <main style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h1>Offline Notes (IndexedDB Demo)</h1>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a note..."
        rows={4}
        style={{ width: '100%', marginBottom: 12 }}
      />

      <button onClick={handleSave}>Save Note</button>

      <p>
        Status: <strong>{navigator.onLine ? 'Online' : 'Offline'}</strong>
      </p>

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
