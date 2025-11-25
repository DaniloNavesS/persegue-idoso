import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GpsService } from '../gps';

interface SafeAreaDto {
  id: string;
  nome: string;
  ativa: boolean;
}

@Component({
  selector: 'app-listar-areas-seguras',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-4">
      <div class="flex items-center justify-between mb-4">
        <div class="text-sm font-medium">Listar áreas seguras</div>
        <a routerLink="/gps/visualizacao" class="px-3 py-1.5 text-xs rounded bg-black text-white hover:bg-black/80 transition">
          + Adicionar área
        </a>
      </div>
      <div class="space-y-2">
        <div *ngFor="let area of areas()" class="flex items-center justify-between rounded border border-black/10 p-3 bg-white shadow-sm">
          <div class="flex items-center gap-3">
            <input type="radio" name="ativa" [checked]="area.ativa" (change)="ativar(area)" />
            <span class="text-sm">{{ area.nome }}</span>
            @if (area.ativa) {
              <span class="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-black text-white">Ativa</span>
            }
          </div>
          <button class="text-xs px-2 py-1 rounded border border-black/20 hover:bg-black/5" (click)="apagar(area)">Apagar</button>
        </div>
      </div>
    </div>
  `,
})
export class ListarAreasSegurasComponent implements OnInit {
  readonly areas = signal<SafeAreaDto[]>([]);
  readonly carregando = signal(false);

  constructor(private gps: GpsService) {}

  ngOnInit(): void {
    this.carregar();
  }

  async carregar(): Promise<void> {
    this.carregando.set(true);
    try {
      const resposta = await this.gps.listarAreas().toPromise();
      const lista = (resposta ?? []).map(item => ({
        id: String(item.id),
        nome: item.nome,
        ativa: !!item.ativo
      } satisfies SafeAreaDto));
      this.areas.set(lista);
    } finally {
      this.carregando.set(false);
    }
  }

  async ativar(area: SafeAreaDto): Promise<void> {
    await this.gps.ativarArea(area.id).toPromise();
    this.areas.update(arr => arr.map(a => ({ ...a, ativa: a.id === area.id })));
  }

  async apagar(area: SafeAreaDto): Promise<void> {
    await this.gps.apagarArea(area.id).toPromise();
    this.areas.update(arr => arr.filter(a => a.id !== area.id));
  }
}


