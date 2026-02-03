# 📴 Offline-First Notes App (IndexedDB + Next.js)

A simple demo application that shows how to build an **offline-first web app** using **IndexedDB**, **React**, **TypeScript**, and **Next.js**.

The app allows users to write notes even when the internet is unavailable. Notes are saved locally using IndexedDB and automatically synced when the network connection is restored.

This repository is intended for **learning and demonstration purposes**.

---

## ✨ What This App Demonstrates

- Saving user data **locally first**
- Using **IndexedDB** as browser-based persistent storage
- Handling **offline and online network states**
- Automatically syncing pending data when the internet returns
- Building resilient UI without losing user input

---

## 🛠 Tech Stack

- **Next.js** (App Router)
- **React**
- **TypeScript**
- **IndexedDB** (browser native)
- No backend required (network sync is simulated)

---

## 📁 Project Structure
```
src/
├─ app/
│ ├─ page.tsx # Main UI (Notes editor)
│ └─ layout.tsx
│
├─ lib/
│ └─ idb.ts # IndexedDB logic + fake sync API


- `page.tsx` handles UI and user interactions
- `idb.ts` handles all IndexedDB and sync-related logic
```
---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```
git clone <your-repo-url>
cd offline-notes-demo
```

2️⃣ Install Dependencies
```npm install```

3️⃣ Run the App
```npm run dev```

Open your browser at:
```http://localhost:3000```

🧪 How to Test Offline Functionality

✅ Normal Online Flow
1. Write a note
2. Click Save
3. The note appears with status Synced

📴 Offline Mode Test (Important)
1. Open Chrome DevTools
2. Go to Network tab
3. Change No throttling → Offline
4. Write a new note and click Save

Expected result:

```
App status shows Offline
Note appears immediately
Note status shows Pending

Refresh the page
→ The note is still there (stored in IndexedDB)
```

🔁 Sync When Back Online
Switch Network mode back to Online
Refresh the page or wait a moment

Expected result:
App status changes to Online
Pending note automatically updates to Synced

🔍 Inspecting IndexedDB Data
You can view stored notes directly in the browser:

- Open DevTools
- Go to Application
- Select IndexedDB
- Open offline-notes-db → notes

You’ll see all saved notes, including their sync status.

About the “Fake API”
This project uses a simulated backend function to demonstrate syncing behavior.

IndexedDB usage is real
Data persistence is real
Only the network request is mocked to keep the demo simple
In a real application, this would be replaced with actual API calls (fetch, REST, GraphQL, etc.).

📌 Use Cases This Pattern Applies To
Chat message drafts
Notes or document editors
Autosave forms
Offline dashboards
Progressive Web Apps (PWAs)


📄 License
This project is provided for educational purposes.
Feel free to use, modify, and extend it.
