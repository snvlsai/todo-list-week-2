import React, { useState, useEffect, useMemo } from 'react';
import './styles.css'; // Import the CSS file

const TodoApp = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Sample completed task', completed: true, createdAt: new Date('2024-01-01') },
    { id: 2, text: 'Sample pending task', completed: false, createdAt: new Date('2024-01-02') }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, alphabetical
  const [error, setError] = useState('');

  // Input validation
  const validateInput = (input) => {
    if (!input.trim()) {
      return 'Task cannot be empty';
    }
    if (input.length > 100) {
      return 'Task must be less than 100 characters';
    }
    if (tasks.some(task => task.text.toLowerCase() === input.trim().toLowerCase())) {
      return 'Task already exists';
    }
    return '';
  };

  // Add new task
  const addTask = () => {
    const validationError = validateInput(inputValue);
    if (validationError) {
      setError(validationError);
      return;
    }

    const newTask = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date()
    };

    setTasks([...tasks, newTask]);
    setInputValue('');
    setError('');
  };

  // Remove task
  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Toggle task completion
  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  // Clear error when input changes
  useEffect(() => {
    if (error && inputValue.trim()) {
      setError('');
    }
  }, [inputValue, error]);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;

    // Apply filter
    switch (filter) {
      case 'active':
        filtered = tasks.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = tasks.filter(task => task.completed);
        break;
      default:
        filtered = tasks;
    }

    // Apply sort
    switch (sortBy) {
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'alphabetical':
        return filtered.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
      default: // newest
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [tasks, filter, sortBy]);

  // Get task statistics
  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(task => task.completed).length,
    active: tasks.filter(task => !task.completed).length
  }), [tasks]);

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h1 className="todo-title">
          To-Do List
        </h1>
        <div className="todo-stats">
          {stats.total} total • {stats.active} active • {stats.completed} completed
        </div>
      </div>

      {/* Add Task Input */}
      <div className="input-section">
        <div className="input-row">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new task..."
            className={`task-input ${error ? 'error' : ''}`}
            maxLength={100}
          />
          <button
            onClick={addTask}
            className="add-button"
          >
            +
          </button>
        </div>
        {error && (
          <div className="error-message">
            <span>✗</span>
            {error}
          </div>
        )}
        <div className="character-count">
          {inputValue.length}/100 characters
        </div>
      </div>

      {/* Filter and Sort Controls */}
      {tasks.length > 0 && (
        <div className="controls-section">
          <div className="control-group">
            <span className="control-icon">🔍</span>
            <span className="control-label">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="control-select"
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="control-group">
            <span className="control-icon">↕️</span>
            <span className="control-label">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="control-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="task-list">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="empty-state">
            {tasks.length === 0 ? (
              <>
                <div className="empty-icon">📝</div>
                <div>No tasks yet. Add one above!</div>
              </>
            ) : (
              <>
                <div className="empty-icon">🔍</div>
                <div>No tasks match your current filter.</div>
              </>
            )}
          </div>
        ) : (
          filteredAndSortedTasks.map((task) => (
            <div
              key={task.id}
              className={`task-item ${task.completed ? 'completed' : ''}`}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`task-checkbox ${task.completed ? 'completed' : ''}`}
              >
                {task.completed && <span className="checkmark">✓</span>}
              </button>
              
              <span
                className={`task-text ${task.completed ? 'completed' : ''}`}
              >
                {task.text}
              </span>
              
              <div className="task-date">
                {task.createdAt.toLocaleDateString()}
              </div>
              
              <button
                onClick={() => removeTask(task.id)}
                className="delete-button"
                title="Delete task"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      {tasks.length > 0 && (
        <div className="quick-actions">
          <div className="action-buttons">
            <button
              onClick={() => setTasks(tasks.map(task => ({ ...task, completed: true })))}
              className="action-button complete-all"
            >
              Complete All
            </button>
            <button
              onClick={() => setTasks(tasks.filter(task => !task.completed))}
              className="action-button clear-completed"
            >
              Clear Completed
            </button>
            <button
              onClick={() => setTasks([])}
              className="action-button clear-all"
            >
              Clear All
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default TodoApp;