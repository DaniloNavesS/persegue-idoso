import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID, signal, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GpsService } from '../gps';

@Component({
  selector: 'app-localizacao-atual',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './localizacao-atual.html',
  styleUrl: './localizacao-atual.css'
})
export class LocalizacaoAtualComponent implements OnInit, AfterViewInit, OnDestroy {
  private map!: any;
  private L!: any;
  private locationMarker: any;
  private trackingInterval: any;

  readonly currentLocation = signal<{ lat: number; lng: number } | null>(null);
  readonly isTracking = signal(false);

  private usuarioId = 123; // ID fixo (pode vir via input ou rota)

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private gpsService: GpsService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startTracking();
    }
  }

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.L = await import('leaflet');
      this.initMap(this.L);
    }
  }

  ngOnDestroy(): void {
    this.stopTracking();
  }

  private initMap(L: any) {
    const baseMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    this.map = L.map('map-realtime', {
      center: [-15.905575916705892, -48.067376693952035],
      zoom: 15
    });

    L.tileLayer(baseMapUrl, {
      attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.locationMarker = L.marker([0, 0], {
      icon: L.divIcon({
        className: 'custom-marker',
        html: '<div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>',
        iconSize: [16, 16]
      })
    });
  }

  startTracking(): void {
    this.isTracking.set(true);

    // Busca inicial
    this.fetchAndUpdateLocation();

    // Atualiza a cada 5 segundos
    this.trackingInterval = setInterval(() => {
      this.fetchAndUpdateLocation();
    }, 5000);
  }

  stopTracking(): void {
    this.isTracking.set(false);
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }
  }

  toggleTracking(): void {
    if (this.isTracking()) {
      this.stopTracking();
    } else {
      this.startTracking();
    }
  }

  private async fetchAndUpdateLocation() {
    try {
      const posicao = await this.gpsService.getPosicao(this.usuarioId);
      this.updateLocation(posicao.latitude, posicao.longitude);
    } catch (error) {
      console.error('Erro ao buscar posição:', error);
    }
  }

  private updateLocation(lat: number, lng: number): void {
    this.currentLocation.set({ lat, lng });

    if (this.locationMarker && this.map) {
      const latlng = this.L.latLng(lat, lng);
      this.locationMarker.setLatLng(latlng);

      if (!this.map.hasLayer(this.locationMarker)) {
        this.locationMarker.addTo(this.map);
      }
    }
  }

  centerOnLocation(): void {
    if (this.currentLocation() && this.map) {
      this.map.setView([this.currentLocation()!.lat, this.currentLocation()!.lng], 16);
    }
  }
}
