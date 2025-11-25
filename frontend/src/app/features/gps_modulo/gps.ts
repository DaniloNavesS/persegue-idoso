import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GpsService {

  private readonly API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getDadosGps(): Observable<any> {
    // Exemplo de chamada para uma API
    return this.http.get('https://api.exemplo.com/gps');
  }

  saveSafeArea(payload: { nome: string; pontos: { lat: number; lng: number }[] }): Observable<any> {
    const body = {
      nome: payload.nome,
      pontos: payload.pontos.map(p => ({ latitude: p.lat, longitude: p.lng }))
    };
    return this.http.post(`${this.API_URL}/gps_area_segura/adicionar`, body);
  }

  listarAreas(): Observable<{
    id: number;
    nome: string;
    pontos: { latitude: number; longitude: number }[];
    ativo: boolean;
  }[]> {
    return this.http.get<{
      id: number;
      nome: string;
      pontos: { latitude: number; longitude: number }[];
      ativo: boolean;
    }[]>(`${this.API_URL}/gps_area_segura/listar`);
  }

  ativarArea(id: string): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/gps_area_segura/ativar/${id}`, {});
  }

  apagarArea(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/gps_area_segura/deletar/${id}`);
  }

  async getPosicao(usuarioId: number): Promise<{ latitude: number; longitude: number; timestamp: string }> {
    return await firstValueFrom(
      this.http.get<{ latitude: number; longitude: number; timestamp: string }>(
        `${this.API_URL}/gps_area_segura/posicao/${usuarioId}`
      )
    )
  }
}