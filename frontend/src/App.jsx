import React, { useState, useEffect } from 'react';
import TodoListPage from './pages/TodoListPage';
import TodoDetailPage from './pages/TodoDetailPage';
import './App.css';

/**
 * App Component
 * Acts as the main controller/router of our React application.
 * It reads the URL query parameters to determine which "page" to display:
 *   - If URL has `?id=XYZ`, it displays the Single Todo page (TodoDetailPage).
 *   - Otherwise, it displays the main Todo List dashboard (TodoListPage).
 */
function App() {
  // Initialize state based on the initial query parameters in the URL
  const [currentTodoId, setCurrentTodoId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  });

  // Listen to browser Back/Forward navigation events to sync the page view
  useEffect(() => {
    const handleLocationChange = () => {
      const params = new URLSearchParams(window.location.search);
      setCurrentTodoId(params.get('id'));
    };

    // Add popstate listener for back/forward browser button clicks
    window.addEventListener('popstate', handleLocationChange);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  /**
   * Navigates to a page by modifying the URL search parameters using pushState.
   * This changes the URL without reloading the browser.
   * 
   * @param {string|null} id - The todo ID to navigate to, or null to go to the list.
   */
  const handleNavigate = (id) => {
    if (id) {
      // Navigate to Single Todo page (adds ?id=... to URL)
      window.history.pushState(null, '', `?id=${id}`);
      setCurrentTodoId(id);
    } else {
      // Return to Todo List page (clears query parameters from URL)
      window.history.pushState(null, '', window.location.pathname);
      setCurrentTodoId(null);
    }
  };

  return (
    <div className="app-wrapper">
      <main className="main-content">
        {currentTodoId ? (
          // Page 2: Single Todo details page
          <TodoDetailPage 
            todoId={currentTodoId} 
            onNavigate={handleNavigate} 
          />
        ) : (
          // Page 1: Todo List dashboard
          <TodoListPage 
            onNavigate={handleNavigate} 
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Todo App</p>
      </footer>
    </div>
  );
}

export default App;
