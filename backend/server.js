const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

const DATA_FILE = path.join(__dirname, 'data', 'todos.json');
app.use(cors());
app.use(express.json());

async function readTodosFromFile() {
  try {
    const fileData = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Error reading todos file:', error.message);
    return [];
  }
}

async function writeTodosToFile(todos) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to todos file:', error.message);
  }
}

app.get('/todos', async (req, res) => {
  try {
    const todos = await readTodosFromFile();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching todos' });
  }
});

app.get('/todos/:id', async (req, res) => {
  try {
    const todos = await readTodosFromFile();
    const todoId = req.params.id;
    const todo = todos.find(t => t.id === todoId);
    
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching todo details' });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required' });
    }

    const todos = await readTodosFromFile();

    const newTodo = {
      id: crypto.randomUUID(), 
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: false,
      createdAt: new Date().toISOString()
    };

    todos.push(newTodo);
    await writeTodosToFile(todos);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating todo' });
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const todoId = req.params.id;
    const { title, description, completed } = req.body;
    
    const todos = await readTodosFromFile();

    const todoIndex = todos.findIndex(t => t.id === todoId);
    
    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const existingTodo = todos[todoIndex];

    const updatedTodo = {
      ...existingTodo,
      title: title !== undefined ? title.trim() : existingTodo.title,
      description: description !== undefined ? description.trim() : existingTodo.description,
      completed: completed !== undefined ? completed : existingTodo.completed
    };

    todos[todoIndex] = updatedTodo;
    await writeTodosToFile(todos);

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating todo' });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const todoId = req.params.id;
    const todos = await readTodosFromFile();
 
    const todoExists = todos.some(t => t.id === todoId);
    if (!todoExists) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const filteredTodos = todos.filter(t => t.id !== todoId);
    await writeTodosToFile(filteredTodos);

    res.json({ message: 'Todo deleted successfully', id: todoId });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting todo' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
