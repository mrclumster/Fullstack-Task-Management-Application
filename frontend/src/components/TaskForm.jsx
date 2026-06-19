import React, { useState } from 'react';

const TaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if the title is blank
    if (!title.trim()) {
      setError('Task Title cannot be blank!');
      return;
    }
    
    // Clear error and submit
    setError('');
    onAddTask({ title, description });
    setTitle('');
    setDescription('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      {/* Display the error message if there is one */}
      {error && <div className="error-message">{error}</div>}
      
      <input 
        type="text" 
        placeholder="Task Title (required)" 
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          // Instantly clear the error once they start typing
          if (error) setError('');
        }}
        className={`input-field ${error ? 'input-error' : ''}`}
      />
      <textarea 
        placeholder="Task Description" 
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input-field textarea"
        rows="2"
      />
      <button type="submit" className="primary-btn">Add Task</button>
    </form>
  );
};

export default TaskForm;