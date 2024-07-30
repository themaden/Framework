const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const SECRET_KEY = 'your_secret_key';
let users = JSON.parse(fs.readFileSync('users.json', 'utf-8')); // Load users from a JSON file

let todos = [];

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access Denied');
    
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send('Invalid Token');
        req.user = user;
        next();
    });
};

// User Registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    users.push({ username, password: hashedPassword });
    fs.writeFileSync('users.json', JSON.stringify(users)); // Save users to JSON file
    res.status(201).send('User registered successfully');
});

// User Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).send('Invalid username or password');
    }

    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Get Todos for logged in user
app.get('/todos', authenticateToken, (req, res) => {
    const userTodos = todos.filter(todo => todo.username === req.user.username);
    res.json(userTodos);
});
app.post('/register', (req, res) => {
     const { username, password } = req.body;
     const hashedPassword = bcrypt.hashSync(password, 8);
 
     users.push({ username, password: hashedPassword });
     fs.writeFileSync('users.json', JSON.stringify(users)); // Save users to JSON file
     res.status(201).send('User registered successfully');
 });
// Get Todos for logged in user
app.get('/todos', authenticateToken, (req, res) => {
     const userTodos = todos.filter(todo => todo.username === req.user.username);
     res.json(userTodos);
 });
 
 // Add Todo
 app.post('/todos', authenticateToken, (req, res) => {
     const todo = { ...req.body, username: req.user.username };
     todos.push(todo);
     res.status(201).json(todo);
 });
 // Middleware to authenticate token

 // Update Todo
 app.put('/todos/:id', authenticateToken, (req, res) => {
     const { id } = req.params;
     const index = todos.findIndex(todo => todo.id === id && todo.username === req.user.username);
 
     if (index !== -1) {
         todos[index] = { ...todos[index], ...req.body };
         res.json(todos[index]);
     } else {
         res.status(404).send('Todo not found');
     }
 });
 


 app.post('/login', (req, res) => {
     const { username, password } = req.body;
     const user = users.find(user => user.username === username);
 
     if (!user || !bcrypt.compareSync(password, user.password)) {
         return res.status(401).send('Invalid username or password');
     }
 
     const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
     res.json({ token });
 });
 

// Add Todo
app.post('/todos', authenticateToken, (req, res) => {
    const todo = { ...req.body, username: req.user.username };
    todos.push(todo);
    res.status(201).json(todo);
});

// Update Todo
app.put('/todos/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const index = todos.findIndex(todo => todo.id === id && todo.username === req.user.username);
    
    if (index !== -1) {
        todos[index] = { ...todos[index], ...req.body };
        res.json(todos[index]);
    } else {
        res.status(404).send('Todo not found');
    }
});

app.listen(3001, () => {
    console.log('Server is running on http://localhost:3001');
});
