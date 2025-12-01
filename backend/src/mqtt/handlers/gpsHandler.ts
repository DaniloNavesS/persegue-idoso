import { enviarAlertaDeAreaSegura } from "../../bot";
import { GpsUsuario } from "../../models/gpsUsuarioModel";
import { Alerta } from "../../models/alertaModel";
import { verificarSeDentroAreaSegura } from "../../services/gpsService";

interface Coordenada {
    latitude: number;
    longitude: number;
}

export async function handleGpsMessage(packet: any, client: any) {
    try {
        const payload = JSON.parse(packet.payload.toString());
        const { usuarioId, latitude, longitude } = payload;

        // Atualiza ou cria registro do GPS
        await GpsUsuario.upsert({
            usuarioId,
            latitude,
            longitude,
            timestamp: new Date()
        });

        console.log(`Localização do usuário ${usuarioId} salva com sucesso!`);

        const pontoAtual: Coordenada = { latitude, longitude };
        const dentroArea = await verificarSeDentroAreaSegura(pontoAtual);

        if (dentroArea) {
            console.log(`Usuário ${usuarioId} está dentro da área segura.`);
        } else {
            console.log(`Usuário ${usuarioId} saiu da área segura!`);
            enviarAlertaDeAreaSegura();
            // Precisa de refatoração um dia meus amigos, função repetida no sistema para cada tipo diferente de alerta
            await Alerta.create({
            tipoAlerta: "Área Segura",
            timestamp: new Date()
            });

        }

    } catch (error) {
        console.error('Erro ao salvar localização ou verificar área segura:', error);
    }
}

