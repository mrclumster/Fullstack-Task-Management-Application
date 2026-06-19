# Fullstack Task Management Application

This is a fullstack task management application built for the Mayan Solutions Inc. practical exam.

---

## 📋 Objective
Build a Fullstack Task Management Application that allows users to create, manage, and search tasks. The goal of this assessment is to evaluate understanding of Fullstack Development including Frontend development, Backend development, Database design and data persistence.

**Core Features Required:**
1. Add Task
2. Mark task as complete/incomplete
3. Edit task details (Task Title, Description)
4. Delete Task
5. Search Task by name
6. Filter Functionality (All, Active, Inactive)
   - *Filters should work together with search.*

---

## 🛠️ Technology Stack & Dependencies

### Frontend
- **Framework:** React (bootstrapped with Vite for ultra-fast performance)
- **Styling:** Premium Vanilla CSS (Fully responsive, clean UI built from scratch to demonstrate separation of concerns)
- **Dependencies:** `react`, `react-dom`

### Backend
- **Framework:** Node.js with Express
- **Database:** SQLite3 (Zero-configuration local database for easy testing)
- **Dependencies:** `express` (routing), `cors` (Cross-Origin Resource Sharing), `sqlite3` (database driver)

---

## ✨ Implemented Features
- **Add Task:** Create new tasks with a title and description.
- **Edit Task:** Seamless inline editing to update task details perfectly in place.
- **Complete/Incomplete:** Toggle task status with custom-built UI checkboxes.
- **Delete Task:** Remove a task completely.
- **Search:** Search tasks by name in real-time.
- **Filter:** Filter tasks by status (`All`, `Active`, `Inactive`).
- *Note: As requested in the criteria, Search and Filter work concurrently!*

---

## 🚀 Setup & Run Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher) installed on your machine.

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   node server.js
   ```
   *The server will start on `http://localhost:5000`. The SQLite database file (`tasks.db`) and tables will automatically generate on the first run.*

### 2. Frontend Setup
1. Open a **new** terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```
4. The terminal will provide a local URL (usually `http://localhost:5173`). Ctrl+Click or open this URL in your browser to use the application!
