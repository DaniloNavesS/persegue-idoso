import { Alerta } from '../models/alertaModel';

export async function listarAlertas() {
    try {
        const areas = await Alerta.findAll({
            attributes: ["AlertaId", "tipoAlerta", "timestamp"],
            order: [["AlertaId", "ASC"]]
        });
        return areas;
    } catch (error: any) {
        console.error("Erro ao listar alertas", error);
        throw new Error("Falha ao listar alertas");
    }
}