- Todo App

This is simple full-stack todo application. It has a React frontend and a Node.js + Express backend. The todos are stored in a simple JSON file on the backend

- Project Structure

 frontend - React app (Vite)
 backend - Node.js + Express server
 README.md - Setup and run instructions
 FEATURES.md - List of features

- How to Run

Please install Node.js.

1. Start the Backend

Open a terminal, go to the backend folder, install the packages, and start the server:

Use this commands to run:

cd backend
npm install
npm start

The backend server will run on localhost.

2. Start the Frontend
Open a second terminal, go to the frontend folder, install the packages, and start the dev server:

Use this command to run:

cd frontend
npm install
npm run dev

The frontend will run on another localhost.

- How Routing Works

I do not use any external routing libraries to keep thing easy to understand and simple

Instead:
-If you open frontend localhost you see the main list.
-If you click view Details, it adds ?id=YOUR_TODO_ID to the link, and React shows the detail page.
-Going back will remove the ID from the link and go back to list.
