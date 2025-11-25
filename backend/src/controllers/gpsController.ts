import { Request, Response } from 'express';
import * as gpsAreaService from '../services/gpsService';

interface Coordenada {
    latitude: number;
    longitude: number;
}


export async function adicionarAreaSeguraController(req: Request, res: Response) {
    try {
        const { pontos, nome } = req.body;

        if (!pontos || !Array.isArray(pontos) || pontos.length < 3) {
            return res.status(400).json({ message: 'Dados de pontos inválidos.' });
        }

        const novaArea = await gpsAreaService.adicionarAreaSegura(pontos, nome);

        res.status(201).json({
            message: 'Área segura adicionada com sucesso!',
            data: novaArea
        });

    } catch (error) {
        res.status(500)
        //.json({ message: 'Erro interno no servidor.', error: error.message });
    }
}

export async function verificarAreaSeguraController(req: Request, res: Response) {
    try {
        const { latitude, longitude } = req.body;

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: 'Coordenadas inválidas.' });
        }

        const pontoAtual: Coordenada = { latitude, longitude };
        const dentro = await gpsAreaService.verificarSeDentroAreaSegura(pontoAtual);

        res.status(200).json({
            message: dentro ? 'Ponto dentro da área segura.' : 'Ponto fora da área segura.',
            dentro
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
    }
}

// Controller para atualizar a área ativa
export async function atualizarAreaAtivaController(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'ID da área é obrigatório.' });
        }

        const areaAtualizada = await gpsAreaService.atualizarAreaAtiva(Number(id));

        res.status(200).json({
            message: 'Área ativa atualizada com sucesso!',
            data: areaAtualizada
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
    }
}

// Controller para deletar uma área
export async function deletarAreaController(req: Request, res: Response) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'ID da área é obrigatório.' });
        }

        const resultado = await gpsAreaService.deletarArea(Number(id));

        res.status(200).json({
            message: resultado.mensagem
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Erro interno no servidor.', error: error.message });
    }
}

export async function listarAreasController(req: Request, res: Response) {
    try {
        const areas = await gpsAreaService.listarAreas();

        if (!areas || areas.length === 0) {
            return res.status(404).json({ message: "Nenhuma área encontrada." });
        }

        res.status(200).json(areas);
    } catch (error: any) {
        res.status(500).json({ message: "Erro interno no servidor.", error: error.message });
    }
}

export async function posicaoAtualUsuarioController(req: Request, res: Response) {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ message: "ID do usuário é obrigatório." });
      }
  
      const posicao = await gpsAreaService.posicaoAtualUsuario(Number(id));
  
      if (!posicao) {
        return res.status(404).json({ message: "Posição do usuário não encontrada." });
      }
  
      res.status(200).json(posicao);
    } catch (error: any) {
      res.status(500).json({ 
        message: "Erro interno no servidor.", 
        error: error.message 
      });
    }
  }

