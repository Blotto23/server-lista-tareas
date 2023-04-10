const express = require('express');
const app = express();

const PORT = 8000;

app.get('/tasks', (req, res) => {
    const tasks = [
        { id: 1, description: 'Make Breakfast', completed: false },
        { id: 2, description: 'Buy some meat', completed: true },
        { id: 3, description: 'Send E-mails', completed: false },
    ];

    res.json(tasks);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});