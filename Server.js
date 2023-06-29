const express = require('express');
const db = require("./db.js");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

const users = [
    { id: 1, username: 'user', password: 'pwuser' },
    { id: 2, username: 'admin', password: 'pwadmin' }
];

// Ruta /login con el método POST para autenticación
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Crear un JWT con el ID del usuario
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
});

// Middleware para validar el token JWT en la ruta protegida
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }

        req.user = user;
        next();
    });
};

// Ruta protegida que requiere autenticación
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Acceso concedido a la ruta protegida' });
});

// Array para almacenar las tareas
let tasks = [];

// Endpoint para crear una nueva tarea
app.post('/tasks', (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Se requiere un título y una descripción' });
    }

    const newTask = {
        id: tasks.length + 1,
        title,
        description,
        completed: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

// Endpoint para actualizar una tarea
app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, description, completed } = req.body;

    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed || task.completed;

    res.json(task);
});

// Endpoint para eliminar una tarea
app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);

    tasks = tasks.filter(t => t.id !== taskId);

    res.json({ message: 'Tarea eliminada correctamente' });
});

// Endpoint para listar todas las tareas
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Endpoint para listar tareas completas
app.get('/tasks/completed', (req, res) => {
    const completedTasks = tasks.filter(t => t.completed);

    res.json(completedTasks);
});

// Endpoint para listar tareas incompletas
app.get('/tasks/incomplete', (req, res) => {
    const incompleteTasks = tasks.filter(t => !t.completed);

    res.json(incompleteTasks);
});

// Endpoint para obtener una tarea específica
app.get('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);

    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json(task);
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
});
