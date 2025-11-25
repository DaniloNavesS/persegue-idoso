import { GpsAreaSegura } from '../models/gpsModel';
import { GpsUsuario } from '../models/gpsUsuarioModel'
import { point, polygon } from '@turf/helpers';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';

interface Coordenada {
    latitude: number;
    longitude: number;
}

/**
 * Verifica se uma coordenada está dentro da área segura ativa usando Turf.js
 * @param pontoAtual Coordenada recebida do front (latitude, longitude)
 * @returns true se estiver dentro, false caso contrário
 */
export async function verificarSeDentroAreaSegura(pontoAtual: Coordenada): Promise<boolean> {
    try {
        // Busca a área ativa
        const areaAtiva = await GpsAreaSegura.findOne({ where: { ativo: true } });

        if (!areaAtiva) {
            throw new Error('Nenhuma área segura ativa encontrada.');
        }

        const pontos = areaAtiva.pontos;

        if (!pontos || pontos.length < 3) {
            throw new Error('Área segura inválida. É necessário pelo menos 3 pontos.');
        }

        // Converte pontos para [lng, lat]
        const coords = pontos.map(p => [p.longitude, p.latitude]);

        // Fecha o polígono repetindo o primeiro ponto no final se necessário
        const first = coords[0];
        const last = coords[coords.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
            coords.push(first);
        }

        // Cria GeoJSON do polígono e do ponto
        const poligonoGeoJSON = polygon([coords]);
        const pontoGeoJSON = point([pontoAtual.longitude, pontoAtual.latitude]);

        // Verifica se o ponto está dentro do polígono
        const dentro = booleanPointInPolygon(pontoGeoJSON, poligonoGeoJSON);

        return dentro;
    } catch (error) {
        console.error('Erro ao verificar área segura:', error);
        throw new Error('Falha ao verificar se ponto está dentro da área segura.');
    }
}

export async function adicionarAreaSegura(pontos: any[], nome: string) {
    try {
        // Desativa todas as áreas seguras ativas
        await GpsAreaSegura.update({ ativo: false }, { where: { ativo: true } });

        const novaArea = await GpsAreaSegura.create({
            nome: nome,
            pontos: pontos,
            ativo: true
        });

        return novaArea;
    } catch (error) {
        console.error('Erro ao adicionar área segura:', error);
        throw new Error('Falha ao adicionar a área segura.');
    }
}

export async function listarAreas() {
    try {
        const areas = await GpsAreaSegura.findAll({
            attributes: ["id", "nome", "pontos", "ativo"], // seleciona colunas (opcional)
            order: [["id", "ASC"]] // ordenação opcional
        });
        return areas;
    } catch (error: any) {
        console.error("Erro ao listar áreas seguras:", error);
        throw new Error("Falha ao listar áreas seguras.");
    }
}

// Atualizar área ativa (desativa todas e ativa a área passada por parâmetro)
export async function atualizarAreaAtiva(id: number) {
    try {
        // Desativa todas as áreas seguras
        await GpsAreaSegura.update({ ativo: false }, { where: { ativo: true } });

        // Busca a área pelo id
        const area = await GpsAreaSegura.findByPk(id);

        if (!area) {
            throw new Error('Área não encontrada.');
        }

        // Ativa a área informada
        await area.update({ ativo: true });

        return area;
    } catch (error) {
        console.error('Erro ao atualizar área ativa:', error);
        throw new Error('Falha ao atualizar a área ativa.');
    }
}

export async function deletarArea(id: number) {
    try {
        const area = await GpsAreaSegura.findByPk(id);

        if (!area) {
            throw new Error('Área não encontrada.');
        }

        await area.destroy();

        return { mensagem: 'Área deletada com sucesso.' };
    } catch (error) {
        console.error('Erro ao deletar área:', error);
        throw new Error('Falha ao deletar a área.');
    }
}


export async function posicaoAtualUsuario(usuarioId: number) {
    try {
      const posicao = await GpsUsuario.findOne({
        where: { usuarioId },
        order: [['timestamp', 'DESC']],
      });
  
      if (!posicao) {
        throw new Error('Posição do usuário não encontrada.');
      }
  
      return {
        usuarioId: posicao.usuarioId,
        latitude: posicao.latitude,
        longitude: posicao.longitude,
        timestamp: posicao.timestamp,
      };
    } catch (error) {
      console.error('Erro ao buscar posição do usuário:', error);
      throw new Error('Falha ao buscar a posição do usuário.');
    }
  }



