// src/server.ts
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';;
// Servidor MQTT
import { startBroker } from './mqtt';

// Rotas importadas
import gpsAreaRoutes from './routes/gpsRoutes';

const app = express();
const httpPort = 3000; // Express - Servidor web
const mqttPort = 1883 // MQTT - Embarcado

app.use(cors());
app.use(bodyParser.json());

// Rota de teste
app.get('/', (req, res) => {
    res.send('Servidor Node.js com TypeScript rodando!');
});

// Rotas API
app.use('/api/gps_area_segura', gpsAreaRoutes);
// Inicia o servidor
app.listen(httpPort, () => {
    console.log(`Servidor rodando em http://localhost:${httpPort}`);
});

// Inicia o broker MQTT
startBroker(1883)

export default app;