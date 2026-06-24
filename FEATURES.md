- Todo App Features

All features implemented in this application are here

1. Frontend (React) part

Page 1: Todo List
- Show all todos: Displays all tasks in todo
- Add new todo: A simple form to add a task with a title description and also written their optional.
- Edit todo: Edit the todo description and title.
- Delete todo: Delete a todo from the list of todo.
- Mark completed: Click a checkbox to toggle completed status
- Search todos: Type in the search bar to filter todos by title or description to see it

Page 2: Single Todo Details
- Query parameters: Reads the todo's ID from the URL (?id=...).
- Detailed view: Shows the full title, description, status of todo, and date created of todo
- Navigation: "Back to List" button to return to the main page.


2. Backend (Node.js + Express) part

- CORS enabled: it will allows the React frontend to communicate with the Express backend.
- JSON file storage: Dta is saved in a local file at backend/data/todos.json
- API endpoint:
  - GET /todos - Get all todos.
  - GET /todos/:id - Get details of a single todo by Id
  - POST /todos - Create a new todo
  - PUT /todos/:id - Update a todos details or completion status
  - DELETE /todos/:id - Delete a todo by ID 