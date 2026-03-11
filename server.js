const express = require('express');
const app = express();
const path = require('path');
app.use(express.json());
app.use(express.static('public'));

let estado = { pendientes: "", realizadas: "" };
let nombres = []; // Para validar duplicados en el servidor

app.get('/api/estado', (req, res) => res.json(estado));

app.post('/api/agregar', (req, res) => {
    const { nombre } = req.body;
    if (!nombre || nombres.includes(nombre.toLowerCase())) return res.status(400).send();
    
    nombres.push(nombre.toLowerCase());
    res.status(201).send();
});

app.post('/api/guardar', (req, res) => {
    estado = req.body;
    res.sendStatus(200);
});

app.listen(8080, '0.0.0.0');