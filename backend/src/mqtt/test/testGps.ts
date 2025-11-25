import mqtt from 'mqtt';

const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
    console.log('Conectado ao broker!');

    // Publica no tópico
    client.publish('usuario/gps', JSON.stringify({
        usuarioId: 2,
        latitude: -22.9707,
        longitude: -43.1823
    }));

    // Se inscreve no tópico
    client.subscribe('usuario/gps');
});

client.on('message', (topic, message) => {
    console.log(`Recebido no tópico ${topic}: ${message.toString()}`);
});
