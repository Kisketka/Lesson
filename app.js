const express = require('express');
const app = express();
const port = 3000;

app.get('/hello', (req, res) => {
    res.send('Привіт, світ!');
});

app.get('/json', (req, res) => {
    res.json({ message: 'Це JSON-відповідь' });
});

app.get('/user/:id', (req, res) => {
    res.send(`Користувач з ID: ${req.params.id}`);
});

app.get('/search', (req, res) => {
    const query = req.query.q;
    res.send(`Пошук за запитом: ${query}`);
});

app.listen(port, () => {
    console.log(`Сервер працює на http://localhost:${port}`);
});