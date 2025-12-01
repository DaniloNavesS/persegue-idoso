import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

// Interface interna do componente (Frontend)
export interface Alerta {
  id: string;
  tipo: 'area_segura' | 'queda';
  titulo: string;
  descricao: string;
  timestamp: Date;
  lido: boolean;
  dados?: {
    localizacao?: { lat: number; lng: number };
    batimentos?: number;
    oxigenacao?: number;
    areaSegura?: string;
  };
}

// Interface que espelha o retorno da API (Backend)
interface AlertaApi {
  AlertaId: number;
  tipoAlerta: string;
  timestamp: string;
}

@Component({
  selector: 'app-avisos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="mb-6 flex justify-between items-center">
        <h2 class="text-2xl font-bold text-gray-900">Histórico de Alertas</h2>
        <button (click)="fetchAlertas()" class="text-sm text-blue-600 hover:text-blue-800">
          Atualizar
        </button>
      </div>

      <div class="space-y-4">
        <div *ngFor="let alerta of alertas()" 
             class="bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md"
             [ngClass]="{
               'border-l-4': true,
               'opacity-75': alerta.lido
             }">
          
          <div class="p-4">
            <div class="flex items-start gap-4">
              <!-- Ícone -->
              <div class="flex-shrink-0 mt-1">
                <div class="p-2 rounded-lg" [ngClass]="getTipoIcone(alerta.tipo).bgColor">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
                       class="w-6 h-6" [ngClass]="getTipoIcone(alerta.tipo).textColor">
                    <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="getTipoIcone(alerta.tipo).path" />
                  </svg>
                </div>
              </div>

              <!-- Texto -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <div class="flex items-center gap-2">
                    <h3 class="text-base font-semibold text-gray-900">{{ alerta.titulo }}</h3>
                  </div>
                  <span class="text-sm text-gray-500 whitespace-nowrap">
                    {{ formatDateTime(alerta.timestamp) }}
                  </span>
                </div>
                
                <p class="text-gray-600 text-sm mb-3">{{ alerta.descricao }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading / Vazio -->
        <div *ngIf="alertas().length === 0" class="text-center py-8 text-gray-500">
          <span *ngIf="loading">Carregando alertas...</span>
          <span *ngIf="!loading">Nenhum alerta registrado.</span>
        </div>
      </div>
    </div>
  `
})
export class AvisosComponent implements OnInit {
  private http = inject(HttpClient);
  
  // Estado
  readonly alertas = signal<Alerta[]>([]);
  loading = false;

  ngOnInit() {
    this.fetchAlertas();
  }

  fetchAlertas() {
    this.loading = true;
    
    // Caminho da API
    this.http.get<AlertaApi[]>('http://localhost:3000/api/alerta/listar')
      .subscribe({
        next: (data) => {
          // Transformação dos dados da API para o modelo do Frontend
          const alertasMapeados: Alerta[] = data.map(item => {
            const tipoNormalizado = this.mapearTipo(item.tipoAlerta);
            
            return {
              id: item.AlertaId.toString(),
              tipo: tipoNormalizado,
              titulo: item.tipoAlerta, // Usa o texto vindo do banco como título
              descricao: this.gerarDescricao(tipoNormalizado),
              timestamp: new Date(item.timestamp),
              lido: false, // Default, pois a API não retornou esse dado
              dados: {} // Default vazio
            };
          });

          // Ordena do mais recente para o mais antigo
          alertasMapeados.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

          this.alertas.set(alertasMapeados);
          this.loading = false;
        },
        error: (err) => {
          console.error('Erro ao buscar alertas:', err);
          this.loading = false;
        }
      });
  }

  // Helper para converter a string do banco ("Área Segura") para a chave do ícone ("area_segura")
  private mapearTipo(tipoApi: string): 'area_segura' | 'queda' {
    const tipoLower = tipoApi.toLowerCase();
    
    if (tipoLower.includes('área segura') || tipoLower.includes('area segura')) {
      return 'area_segura';
    }
    if (tipoLower.includes('queda')) {
      return 'queda';
    }
    // Fallback padrão caso venha algo desconhecido
    return 'area_segura';
  }

  // Helper para gerar descrição baseada no tipo (já que a API simples não retorna descrição)
  private gerarDescricao(tipo: string): string {
    if (tipo === 'queda') {
      return 'O sistema detectou um impacto brusco. Verifique o paciente.';
    }
    if (tipo === 'area_segura') {
      return 'O paciente ultrapassou os limites e saiu da área segura definida  .';
    }
    return 'Notificação do sistema.';
  }

  getTipoIcone(tipo: string) {
    const icones = {
      'area_segura': {
        path: 'M12 21a9 9 0 100-18 9 9 0 000 18zm0 0l3-3m-3 3l-3-3m3 3V9',
        bgColor: 'bg-green-100',
        textColor: 'text-green-600'
      },
      'queda': {
        path: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
        bgColor: 'bg-red-100',
        textColor: 'text-red-600'
      }
    };
    // Fallback seguro caso o tipo não exista no mapa
    return icones[tipo as keyof typeof icones] || icones['area_segura'];
  }

  formatDateTime(date: Date): string {
    return date.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  }
}