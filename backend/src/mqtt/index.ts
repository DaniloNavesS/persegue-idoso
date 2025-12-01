// src/mqtt/index.ts
import aedes from 'aedes';
import { createServer } from 'net';
import { handleGpsMessage } from './handlers/gpsHandler';
import { handleQuedaMessage } from './handlers/quedaHandler';

export function startBroker(mqttPort: number) {
    const broker = new aedes();
    const server = createServer(broker.handle);

    server.listen(mqttPort, () => {
        console.log(`MQTT Broker rodando na porta ${mqttPort}`);
    });

    broker.on('publish', async (packet, client) => {
        if (!client) return;

        console.log(`Mensagem recebida do cliente ${client.id}:`);
        console.log(`Tópico: ${packet.topic}`);
        console.log(`Payload: ${packet.payload.toString()}`);

        // Redireciona para funções específicas por tópico
        // Informações para o GPS
        if (packet.topic === 'usuario/gps') {
            await handleGpsMessage(packet, client);
        }
        // Informações para Queda
        if(packet.topic === '/usuario/queda') {
            await handleQuedaMessage();
        }

    });

    return broker;
}
