import React, { useState, useEffect } from 'react';

/**
 * TodoDetailPage Component (Page 2)
 * Fetches and displays details for a single todo based on the todoId prop.
 * 
 * @param {string} todoId - The ID of the todo to display.
 * @param {Function} onNavigate - Function to navigate back to the todo list page.
 */
function TodoDetailPage({ todoId, onNavigate }) {
  // State variables for storing the fetched todo, loading, and error states
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend base API URL
  const API_URL = 'http://localhost:5000/todos';

  // Fetch the todo details whenever the todoId changes
  useEffect(() => {
    if (todoId) {
      fetchTodoDetails();
    }
  }, [todoId]);

  /**
   * Fetches detailed information for a specific todo from the backend API.
   */
  const fetchTodoDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/${todoId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Todo item not found. It may have been deleted.');
        }
        throw new Error('Failed to fetch todo details from the server');
      }

      const data = await response.json();
      setTodo(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Helper function to format ISO date strings into a user-friendly format.
   */
  const formatDate = (isoString) => {
    if (!isoString) return 'Unknown';
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="todo-container detail-page-container">
      {/* Back Button */}
      <div className="navigation-bar">
        <button className="btn btn-secondary" onClick={() => onNavigate(null)}>
          ← Back to List
        </button>
      </div>

      <header className="todo-header">
        <h1>Task Details</h1>
        <p className="subtitle">Detailed view of task #{todoId ? todoId.substring(0, 8) : ''}</p>
      </header>

      {/* Main Details Card */}
      {loading ? (
        <div className="loading-spinner">Loading task details...</div>
      ) : error ? (
        <div className="card error-card">
          <div className="error-message">⚠️ Error: {error}</div>
          <button className="btn btn-primary" onClick={() => onNavigate(null)}>
            Return to List
          </button>
        </div>
      ) : todo ? (
        <section className="detail-card card">
          <div className="detail-status-badge-wrapper">
            <span className={`status-badge ${todo.completed ? 'completed' : 'pending'}`}>
              {todo.completed ? 'Completed' : 'Pending'}
            </span>
          </div>

          <h2 className="detail-title">{todo.title}</h2>
          
          <div className="detail-section">
            <h3>Description</h3>
            <p className="detail-description">
              {todo.description || <em className="no-description">No description provided for this task.</em>}
            </p>
          </div>

          <hr className="divider" />

          <div className="detail-meta">
            <div className="meta-item">
              <strong>Created On:</strong>
              <span>{formatDate(todo.createdAt)}</span>
            </div>
            <div className="meta-item">
              <strong>Unique ID:</strong>
              <code className="uuid-code">{todo.id}</code>
            </div>
          </div>
        </section>
      ) : (
        <div className="card empty-state">
          <p>No details available.</p>
        </div>
      )}
    </div>
  );
}

export default TodoDetailPage;
