import { enviarAlertaDeAreaSegura, enviarAlertaQueda } from "../../bot";
import { Alerta } from "../../models/alertaModel";

export async function handleQuedaMessage() {
    try {

        enviarAlertaQueda();

        await Alerta.create({
                    tipoAlerta: "Queda grave",
                    timestamp: new Date()
                    });

        console.log("Salvo alerta!");

    } catch (error) {
        console.error('Erro no detector de queda', error);
    }
}

