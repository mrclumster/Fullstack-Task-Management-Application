import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import Pagination from './components/Pagination';
import './index.css';

const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // All, Active, Inactive
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, totalTasks: 0, currentPage: 1, limit: 5 });
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [deleteTimeoutId, setDeleteTimeoutId] = useState(null);
  const [sortBy, setSortBy] = useState('newest'); // 'newest' or 'oldest'
  const [dateFilter, setDateFilter] = useState('All'); // 'All', 'Today', 'Week'

  // Fetch tasks from the backend whenever the search query changes
  useEffect(() => {
    fetchTasks();
  }, [searchQuery, filterStatus, currentPage, sortBy, dateFilter]);
  // Reset current page to 1 whenever search query, filter status, sort order, or date filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, sortBy, dateFilter]);

  // Cleanup the timer on unmount
  useEffect(() => {
    return () => {
      if (deleteTimeoutId) clearTimeout(deleteTimeoutId);
    };
  }, [deleteTimeoutId]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 5,
        status: filterStatus,
        sortBy: sortBy,
        dateFilter: dateFilter

      });
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      const response = await fetch(`${API_URL}?${params.toString()}`);
      const data = await response.json();

      const fetchedTasks = data.tasks || [];
      // Filter out the pending delete task if there is one
      if (pendingDeleteId) {
        setTasks(fetchedTasks.filter(t => t.id !== pendingDeleteId));
      } else {
        setTasks(fetchedTasks);
      }

      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleAddTask = async (newTask) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      const createdTask = await response.json();
      setTasks([createdTask, ...tasks]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = { ...task, isCompleted: !task.isCompleted };
      await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      });
      setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleEditTask = async (id, updatedDetails) => {
    try {
      const taskToUpdate = tasks.find(t => t.id === id);
      const updatedTask = { ...taskToUpdate, ...updatedDetails };
      
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      });
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const commitDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Error deleting task permanently:', error);
    }
  };


  const handleDeleteTask = async (id) => {
    try {
      // 1. If another delete was pending, commit it immediately
      if (pendingDeleteId) {
        clearTimeout(deleteTimeoutId);
        await commitDelete(pendingDeleteId);
      }
      const taskToDelete = tasks.find(t => t.id === id);
      const taskTitle = taskToDelete ? taskToDelete.title : 'Task';
      // 2. Hide from UI immediately
      setTasks(tasks.filter(t => t.id !== id));
      setPendingDeleteId(id);
      setToastMessage(`Deleted "${taskTitle}"`);
      setShowToast(true);
      // 3. Start 5-second countdown to permanently delete
      const timeoutId = setTimeout(async () => {
        await commitDelete(id);
        setShowToast(false);
        setPendingDeleteId(null);
      }, 5000);
      setDeleteTimeoutId(timeoutId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleUndoDelete = () => {
    // Cancel the delete countdown
    if (deleteTimeoutId) {
      clearTimeout(deleteTimeoutId);
      setDeleteTimeoutId(null);
    }
    setPendingDeleteId(null);
    setShowToast(false);
    
    // Refresh task list from SQLite (since the delete API was never called)
    fetchTasks();
  };


  // Filter tasks locally based on 'All', 'Active' (not completed), 'Inactive' (completed)
  const filteredTasks = tasks.filter(task => {
    if (filterStatus === 'Active') return !task.isCompleted;
    if (filterStatus === 'Inactive') return task.isCompleted;
    return true; // 'All'
  });

  return (
    <div className="app-container">
      <header className="header">
        <h1>Task Manager</h1>
        <p>Organize your work beautifully</p>
      </header>

      <main className="main-content">
        <section className="top-section">
          <TaskForm onAddTask={handleAddTask} />
        </section>

        <section className="list-section">
          <FilterBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />
          
          <TaskList 
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
          />
          <Pagination 
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
          />
        </section>
      </main>
      {showToast && (
        <div className="toast-notification">
          <span>{toastMessage}</span>
          <button onClick={handleUndoDelete} className="undo-btn">
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

export default App;