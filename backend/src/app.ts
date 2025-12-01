// src/server.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
require('dotenv').config();
// Bot telegram
const { enviarAlertaQueda, enviarAlertaDeAreaSegura } = require('./bot/index');
// Servidor MQTT
import { startBroker } from './mqtt';
// Rotas importadas
import gpsAreaRoutes from './routes/gpsRoutes';
import alertaRoutes from './routes/alertaRoutes'

const app = express();
const httpPort = 3000; // Express - Servidor web
const mqttPort = 1883 // MQTT - Embarcado

app.use(cors());
app.use(bodyParser.json());

// Rota de teste
app.get('/', (req, res) => {
    enviarAlertaDeAreaSegura();
    res.send('Servidor Node.js com TypeScript rodando!');
});
// Rotas API
app.use('/api/gps_area_segura', gpsAreaRoutes);
app.use('/api/alerta', alertaRoutes);

// Inicia o servidor
app.listen(httpPort, () => {
    console.log(`Servidor rodando em http://localhost:${httpPort}`);
});

// Inicia o broker MQTT
startBroker(1883)

export default app;