import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GpsService } from '../gps';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-visualizacao-gps',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visualizacao-gps.html',
  styleUrl: './visualizacao-gps.css'
})
export class VisualizacaoGps implements OnInit, AfterViewInit {

  private map!: any; // Leaflet map instance
  private L!: any;   // Leaflet namespace (dynamic import)

  // Estado de desenho da área segura
  readonly selectedPoints = signal<{ lat: number; lng: number }[]>([]);
  readonly areaName = signal<string>('');
  private drawnMarkers: any[] = [];
  private previewLine: any | null = null;
  private safePolygon: any | null = null;
  readonly saving = signal(false);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private gpsService: GpsService
  ) { }

  ngOnInit(): void {

  }

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.L = await import('leaflet');
      this.initMap(this.L);
    }
  }

  private initMap(L: any) {
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    this.map = L.map('map', {
      center: [-15.905575916705892, -48.067376693952035],
      zoom: 15
    });
  
    L.tileLayer(baseMapURl, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  
    // Habilita seleção de pontos ao clicar no mapa
    this.map.on('click', (e: any) => this.handleMapClick(e));
  }
  
  private handleMapClick(e: any): void {
    if (!this.map || !this.L) { return; }
    if (this.selectedPoints().length >= 4) { return; }

    const latlng = e.latlng as { lat: number; lng: number };
    this.selectedPoints.update(points => [...points, { lat: latlng.lat, lng: latlng.lng }]);

    const marker = this.L.marker(latlng, { keyboard: false, interactive: false });
    marker.addTo(this.map);
    this.drawnMarkers.push(marker);

    this.updatePreview();
  }

  private updatePreview(): void {
    // Limpa pré-visualizações anteriores
    if (this.previewLine) {
      this.map.removeLayer(this.previewLine);
      this.previewLine = null;
    }
    if (this.safePolygon) {
      this.map.removeLayer(this.safePolygon);
      this.safePolygon = null;
    }

    if (this.selectedPoints().length >= 2 && this.selectedPoints().length < 4) {
      const latlngs = this.selectedPoints().map(p => [p.lat, p.lng]);
      this.previewLine = this.L.polyline(latlngs, { color: '#000', weight: 2, opacity: 0.7 });
      this.previewLine.addTo(this.map);
    }

    if (this.selectedPoints().length === 4) {
      const latlngs = this.selectedPoints().map(p => [p.lat, p.lng]);
      this.safePolygon = this.L.polygon(latlngs, {
        color: '#000',
        weight: 2,
        opacity: 0.9,
        fillColor: '#000',
        fillOpacity: 0.08,
      });
      this.safePolygon.addTo(this.map);
    }
  }

  undoLastPoint(): void {
    if (this.selectedPoints().length === 0) { return; }
    this.selectedPoints.update(points => points.slice(0, -1));
    const lastMarker = this.drawnMarkers.pop();
    if (lastMarker) { this.map.removeLayer(lastMarker); }
    this.updatePreview();
  }

  clearPoints(): void {
    this.selectedPoints.set([]);
    this.drawnMarkers.forEach(m => this.map.removeLayer(m));
    this.drawnMarkers = [];
    if (this.previewLine) { this.map.removeLayer(this.previewLine); this.previewLine = null; }
    if (this.safePolygon) { this.map.removeLayer(this.safePolygon); this.safePolygon = null; }
  }

  async saveArea(): Promise<void> {
    if (this.selectedPoints().length !== 4 || this.saving()) { return; }
    const name = this.areaName().trim();
    if (!name) {
      alert('Informe um nome para a área segura.');
      return;
    }
    this.saving.set(true);
    try {
      await firstValueFrom(this.gpsService.saveSafeArea({ nome: name, pontos: this.selectedPoints() }))
      // Opcional: feedback simples
      alert('Área segura salva com sucesso.');
      this.areaName.set('');
      this.clearPoints();
    } catch (err) {
      console.error(err);
      alert('Falha ao salvar a área segura.');
    } finally {
      this.saving.set(false);
    }
  }
}