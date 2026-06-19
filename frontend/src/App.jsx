import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import './index.css';

const API_URL = 'http://localhost:5000/api/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // All, Active, Inactive

  // Fetch tasks from the backend whenever the search query changes
  useEffect(() => {
    fetchTasks();
  }, [searchQuery]);

  const fetchTasks = async () => {
    try {
      const url = searchQuery ? `${API_URL}?search=${encodeURIComponent(searchQuery)}` : API_URL;
      const response = await fetch(url);
      const data = await response.json();
      setTasks(data);
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

  const handleDeleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
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
          />
          
          <TaskList 
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
          />
        </section>
      </main>
    </div>
  );
}

export default App;