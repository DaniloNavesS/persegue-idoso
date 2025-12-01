import { Request, Response } from 'express';
import * as alertaService from '../services/alertaService';

export async function listarAlertasController(req: Request, res: Response) {
    try {
        const areas = await alertaService.listarAlertas();
        res.status(200).json(areas);
    } catch (error: any) {
        res.status(500).json({ message: "Erro interno no servidor.", error: error.message });
    }
}

