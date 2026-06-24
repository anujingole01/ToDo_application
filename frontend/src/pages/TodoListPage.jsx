import React, { useState, useEffect } from 'react';

/**
 * TodoListPage Component
 * Displays the main dashboard where users can search, add, edit, delete, 
 * and toggle the completion status of their todos.
 * 
 * @param {Function} onNavigate - Function to navigate to the single todo detail page.
 */
function TodoListPage({ onNavigate }) {
  // State variables for managing todos and loading/error states
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State variables for the "Add New Todo" form
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // State variable for the search input
  const [searchTerm, setSearchTerm] = useState('');

  // State variables for handling "Edit Mode" inline
  const [editingId, setEditingId] = useState(null); // Stores ID of the todo being edited
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Backend base API URL
  const API_URL = 'http://localhost:5000/todos';

  // Fetch all todos from the backend when the page loads
  useEffect(() => {
    fetchTodos();
  }, []);

  /**
   * Fetches the complete list of todos from the backend API.
   */
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch todos from the server');
      }
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server. Please make sure it is running.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles creating a new todo item.
   */
  const handleAddTodo = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submit
    
    if (!newTitle.trim()) {
      alert('Please enter a title for your todo!');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create todo');
      }

      const createdTodo = await response.json();
      
      // Update our local state by adding the new todo to the list
      setTodos((prevTodos) => [...prevTodos, createdTodo]);
      
      // Reset form input fields
      setNewTitle('');
      setNewDescription('');
    } catch (err) {
      console.error(err);
      alert('Error creating todo: ' + err.message);
    }
  };

  /**
   * Toggles the completed status of a todo.
   */
  const handleToggleComplete = async (todo) => {
    try {
      const response = await fetch(`${API_URL}/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !todo.completed, // Toggle status
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo status');
      }

      const updatedTodo = await response.json();

      // Update the local state array with the updated todo
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === todo.id ? updatedTodo : t))
      );
    } catch (err) {
      console.error(err);
      alert('Error updating status: ' + err.message);
    }
  };

  /**
   * Enters edit mode for a specific todo card.
   * Pre-populates the edit inputs with the current values.
   */
  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  /**
   * Cancels edit mode and clears edit state.
   */
  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  /**
   * Saves the edited todo details to the backend.
   */
  const handleSaveEdit = async (id) => {
    if (!editTitle.trim()) {
      alert('Todo title cannot be empty!');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save todo updates');
      }

      const updatedTodo = await response.json();

      // Update local state and exit edit mode
      setTodos((prevTodos) =>
        prevTodos.map((t) => (t.id === id ? updatedTodo : t))
      );
      cancelEditing();
    } catch (err) {
      console.error(err);
      alert('Error updating todo: ' + err.message);
    }
  };

  /**
   * Deletes a todo item from the backend and state.
   */
  const handleDeleteTodo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      // Filter out the deleted todo from our state list
      setTodos((prevTodos) => prevTodos.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting todo: ' + err.message);
    }
  };

  // Filter todos based on the user's search term (case-insensitive check)
  const filteredTodos = todos.filter((todo) => {
    const term = searchTerm.toLowerCase();
    return (
      todo.title.toLowerCase().includes(term) ||
      todo.description.toLowerCase().includes(term)
    );
  });

  return (
    <div className="todo-container">
      <header className="todo-header">
        <h1>Todo App</h1>
        <p className="subtitle">Keep track of your daily tasks</p>
      </header>

      {/* Add New Todo Form */}
      <section className="form-section card">
        <h2>Create New Task</h2>
        <form onSubmit={handleAddTodo}>
          <div className="input-group">
            <input
              type="text"
              placeholder="What needs to be done? (Title)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="styled-input"
              required
            />
          </div>
          <div className="input-group">
            <textarea
              placeholder="Add some details... (Optional Description)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="styled-input styled-textarea"
              rows="3"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create Todo
          </button>
        </form>
      </section>

      {/* Search and Filters Section */}
      <section className="search-section">
        <input
          type="text"
          placeholder="Search todos by title or details..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="styled-input search-input"
        />
      </section>

      {/* Todos List Section */}
      <section className="list-section">
        <div className="list-header">
          <h2>Your Tasks ({filteredTodos.length})</h2>
          <button className="btn btn-refresh" onClick={fetchTodos} title="Refresh Todos">
            🔄
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-spinner">Fetching your tasks...</div>
        ) : filteredTodos.length === 0 ? (
          <div className="empty-state card">
            {searchTerm ? 'No todos match your search.' : 'No tasks left! Create a new task above.'}
          </div>
        ) : (
          <div className="todo-grid">
            {filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`todo-card card ${todo.completed ? 'completed' : ''}`}
              >
                {editingId === todo.id ? (
                  /* Edit Mode Render */
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="styled-input edit-title-input"
                      required
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="styled-input edit-desc-input"
                      rows="2"
                    />
                    <div className="edit-actions">
                      <button
                        onClick={() => handleSaveEdit(todo.id)}
                        className="btn btn-save"
                      >
                        Save
                      </button>
                      <button onClick={cancelEditing} className="btn btn-cancel">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard View Render */
                  <div className="todo-content-wrapper">
                    <div className="todo-main">
                      {/* Checkbox wrapper */}
                      <button
                        className={`checkbox-btn ${todo.completed ? 'checked' : ''}`}
                        onClick={() => handleToggleComplete(todo)}
                        title={todo.completed ? 'Mark as Pending' : 'Mark as Completed'}
                        aria-label="Toggle Complete"
                      >
                        {todo.completed ? '✓' : ''}
                      </button>

                      <div className="todo-text">
                        <h3 className="todo-title">{todo.title}</h3>
                        {todo.description && (
                          <p className="todo-description">{todo.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="todo-footer">
                      {/* Button to navigate to Page 2 (Single Todo page) */}
                      <button
                        className="btn btn-link"
                        onClick={() => onNavigate(todo.id)}
                        title="View Details"
                      >
                        View Details ↗
                      </button>

                      <div className="card-actions">
                        <button
                          onClick={() => startEditing(todo)}
                          className="btn btn-edit"
                          title="Edit Task"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTodo(todo.id)}
                          className="btn btn-delete"
                          title="Delete Task"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TodoListPage;
