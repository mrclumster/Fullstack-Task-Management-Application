import React, { useState, useRef, useEffect } from 'react';

const TaskItem = ({ task, onToggleComplete, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  
  const titleInputRef = useRef(null);

  // Auto-focus the input when the user clicks edit!
  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onEdit(task.id, { title: editTitle, description: editDescription });
    setIsEditing(false);
  };

  return (
    <div className={`task-item ${task.isCompleted ? 'completed' : ''}`}>
      <div className="task-content">
        <label className="checkbox-container">
          <input 
            type="checkbox" 
            checked={task.isCompleted}
            onChange={() => onToggleComplete(task)}
            disabled={isEditing}
          />
          <span className="checkmark"></span>
        </label>
        
        <div className="task-text">
          {isEditing ? (
            <div className="edit-mode">
               <input 
                 ref={titleInputRef}
                 type="text" 
                 value={editTitle}
                 onChange={(e) => setEditTitle(e.target.value)}
                 className="seamless-input title-input"
                 placeholder="Task Title"
               />
               <textarea 
                 value={editDescription}
                 onChange={(e) => setEditDescription(e.target.value)}
                 className="seamless-input desc-input"
                 placeholder="Task Description"
                 rows="2"
               />
            </div>
          ) : (
            <>
              <h3>{task.title}</h3>
              {task.description && <p>{task.description}</p>}
              {task.createdAt && (
                <span className="task-date-badge">
                  📅 {formatDate(task.createdAt)}
                </span>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="task-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="save-btn">Save</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
            <button onClick={() => onDelete(task.id)} className="delete-btn">Delete</button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;