import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Alerta {
  id: string;
  tipo: 'area_segura' | 'batimentos' | 'oxigenacao' | 'queda';
  severidade: 'baixa' | 'media' | 'alta' | 'critica';
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

@Component({
  selector: 'app-avisos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Avisos e Alertas</h1>
        <p class="text-gray-600">Monitoramento de emergências e notificações do sistema</p>
      </div>

      <!-- Estatísticas de Alertas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-red-600">{{ alertasCriticos() }}</div>
              <div class="text-sm text-red-500">Críticos</div>
            </div>
            <div class="p-3 bg-red-500 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-orange-600">{{ alertasAltos() }}</div>
              <div class="text-sm text-orange-500">Altos</div>
            </div>
            <div class="p-3 bg-orange-500 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a6.048 6.048 0 01-1.5 0m1.5-2.383a6.048 6.048 0 00-1.5 0m0 0V9.75m0 0a6.01 6.01 0 00-1.5.189m1.5-.189a6.01 6.01 0 011.5-.189" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-yellow-600">{{ alertasMedios() }}</div>
              <div class="text-sm text-yellow-500">Médios</div>
            </div>
            <div class="p-3 bg-yellow-500 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-2xl font-bold text-blue-600">{{ alertasNaoLidos() }}</div>
              <div class="text-sm text-blue-500">Não Lidos</div>
            </div>
            <div class="p-3 bg-blue-500 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros e Ações -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex flex-wrap gap-4">
            <select [(ngModel)]="filtroTipo" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos os tipos</option>
              <option value="area_segura">Área Segura</option>
              <option value="batimentos">Batimentos</option>
              <option value="oxigenacao">Oxigenação</option>
              <option value="queda">Queda</option>
            </select>
            
            <select [(ngModel)]="filtroSeveridade" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todas as severidades</option>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>

            <select [(ngModel)]="filtroStatus" class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Todos os status</option>
              <option value="nao_lido">Não Lidos</option>
              <option value="lido">Lidos</option>
            </select>
          </div>

          <div class="flex gap-2">
            <button (click)="marcarTodosComoLidos()" 
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Marcar todos como lidos
            </button>
            <button (click)="limparAvisos()" 
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
              Limpar avisos
            </button>
          </div>
        </div>
      </div>

      <!-- Lista de Alertas -->
      <div class="space-y-4">
        <div *ngFor="let alerta of alertasFiltrados()" 
             class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
             [ngClass]="{
               'border-red-200 bg-red-50': alerta.severidade === 'critica',
               'border-orange-200 bg-orange-50': alerta.severidade === 'alta',
               'border-yellow-200 bg-yellow-50': alerta.severidade === 'media',
               'border-blue-200 bg-blue-50': alerta.severidade === 'baixa'
             }">
          
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-4 flex-1">
                <!-- Ícone do tipo de alerta -->
                <div class="flex-shrink-0">
                  <div class="p-3 rounded-lg" [ngClass]="getTipoIcone(alerta.tipo).bgColor">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" 
                         class="w-6 h-6" [ngClass]="getTipoIcone(alerta.tipo).textColor">
                      <path stroke-linecap="round" stroke-linejoin="round" [attr.d]="getTipoIcone(alerta.tipo).path" />
                    </svg>
                  </div>
                </div>

                <!-- Conteúdo do alerta -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2 mb-2">
                    <h3 class="text-lg font-semibold text-gray-900">{{ alerta.titulo }}</h3>
                    <span class="px-2 py-1 text-xs font-medium rounded-full" [ngClass]="getSeveridadeBadge(alerta.severidade)">
                      {{ getSeveridadeText(alerta.severidade) }}
                    </span>
                    <span *ngIf="!alerta.lido" class="w-2 h-2 bg-red-500 rounded-full"></span>
                  </div>
                  
                  <p class="text-gray-600 mb-3">{{ alerta.descricao }}</p>
                  
                  <!-- Dados específicos do alerta -->
                  <div *ngIf="alerta.dados" class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div *ngIf="alerta.dados.batimentos" class="bg-white rounded-lg p-3 border border-gray-200">
                      <div class="text-sm text-gray-500">Batimentos Cardíacos</div>
                      <div class="text-lg font-semibold text-red-600">{{ alerta.dados.batimentos }} BPM</div>
                    </div>
                    
                    <div *ngIf="alerta.dados.oxigenacao" class="bg-white rounded-lg p-3 border border-gray-200">
                      <div class="text-sm text-gray-500">Oxigenação</div>
                      <div class="text-lg font-semibold text-blue-600">{{ alerta.dados.oxigenacao }}%</div>
                    </div>
                    
                    <div *ngIf="alerta.dados.areaSegura" class="bg-white rounded-lg p-3 border border-gray-200">
                      <div class="text-sm text-gray-500">Área Segura</div>
                      <div class="text-lg font-semibold text-green-600">{{ alerta.dados.areaSegura }}</div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-500">
                      {{ formatDateTime(alerta.timestamp) }}
                    </div>
                    
                    <div class="flex space-x-2">
                      <button *ngIf="!alerta.lido" 
                              (click)="marcarComoLido(alerta.id)"
                              class="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                        Marcar como lido
                      </button>
                      <button (click)="removerAlerta(alerta.id)"
                              class="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vazio -->
        <div *ngIf="alertasFiltrados().length === 0" class="text-center py-12">
          <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-gray-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum aviso encontrado</h3>
          <p class="text-gray-500">Não há alertas que correspondam aos filtros selecionados.</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AvisosComponent {
  // Filtros
  filtroTipo = '';
  filtroSeveridade = '';
  filtroStatus = '';

  // Dados simulados de alertas
  readonly alertas = signal<Alerta[]>([
    {
      id: '1',
      tipo: 'area_segura',
      severidade: 'critica',
      titulo: 'Paciente saiu da área segura',
      descricao: 'O paciente se afastou mais de 100 metros da área segura "Casa" às 14:30.',
      timestamp: new Date(Date.now() - 30 * 60000),
      lido: false,
      dados: {
        areaSegura: 'Casa',
        localizacao: { lat: -23.5505, lng: -46.6333 }
      }
    },
    {
      id: '2',
      tipo: 'batimentos',
      severidade: 'alta',
      titulo: 'Batimentos cardíacos elevados',
      descricao: 'Os batimentos cardíacos do paciente estão acima do normal (120 BPM).',
      timestamp: new Date(Date.now() - 45 * 60000),
      lido: false,
      dados: {
        batimentos: 120
      }
    },
    {
      id: '3',
      tipo: 'oxigenacao',
      severidade: 'media',
      titulo: 'Oxigenação do sangue baixa',
      descricao: 'A oxigenação do sangue está abaixo de 95% (94%).',
      timestamp: new Date(Date.now() - 60 * 60000),
      lido: true,
      dados: {
        oxigenacao: 94
      }
    },
    {
      id: '4',
      tipo: 'queda',
      severidade: 'critica',
      titulo: 'Queda detectada',
      descricao: 'Sistema detectou possível queda do paciente. Verificação imediata necessária.',
      timestamp: new Date(Date.now() - 90 * 60000),
      lido: false,
      dados: {
        localizacao: { lat: -23.5505, lng: -46.6333 }
      }
    },
    {
      id: '5',
      tipo: 'area_segura',
      severidade: 'baixa',
      titulo: 'Paciente retornou à área segura',
      descricao: 'O paciente retornou à área segura "Casa" às 15:15.',
      timestamp: new Date(Date.now() - 120 * 60000),
      lido: true,
      dados: {
        areaSegura: 'Casa',
        localizacao: { lat: -23.5505, lng: -46.6333 }
      }
    }
  ]);

  // Computed properties para estatísticas
  readonly alertasCriticos = computed(() => 
    this.alertas().filter(a => a.severidade === 'critica').length
  );

  readonly alertasAltos = computed(() => 
    this.alertas().filter(a => a.severidade === 'alta').length
  );

  readonly alertasMedios = computed(() => 
    this.alertas().filter(a => a.severidade === 'media').length
  );

  readonly alertasNaoLidos = computed(() => 
    this.alertas().filter(a => !a.lido).length
  );

  // Filtros aplicados
  readonly alertasFiltrados = computed(() => {
    return this.alertas().filter(alerta => {
      const tipoMatch = !this.filtroTipo || alerta.tipo === this.filtroTipo;
      const severidadeMatch = !this.filtroSeveridade || alerta.severidade === this.filtroSeveridade;
      const statusMatch = !this.filtroStatus || 
        (this.filtroStatus === 'lido' && alerta.lido) ||
        (this.filtroStatus === 'nao_lido' && !alerta.lido);
      
      return tipoMatch && severidadeMatch && statusMatch;
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  });

  constructor() {
    // Simular novos alertas periodicamente
    setInterval(() => {
      this.simularNovoAlerta();
    }, 30000); // A cada 30 segundos
  }

  private simularNovoAlerta(): void {
    const tipos = ['area_segura', 'batimentos', 'oxigenacao', 'queda'] as const;
    const severidades = ['baixa', 'media', 'alta', 'critica'] as const;
    
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const severidade = severidades[Math.floor(Math.random() * severidades.length)];
    
    const novoAlerta: Alerta = {
      id: Date.now().toString(),
      tipo,
      severidade,
      titulo: this.gerarTituloAlerta(tipo),
      descricao: this.gerarDescricaoAlerta(tipo),
      timestamp: new Date(),
      lido: false,
      dados: this.gerarDadosAlerta(tipo)
    };

    this.alertas.update(alertas => [novoAlerta, ...alertas]);
  }

  private gerarTituloAlerta(tipo: string): string {
    const titulos = {
      'area_segura': 'Paciente saiu da área segura',
      'batimentos': 'Alteração nos batimentos cardíacos',
      'oxigenacao': 'Alteração na oxigenação do sangue',
      'queda': 'Queda detectada'
    };
    return titulos[tipo as keyof typeof titulos] || 'Alerta do sistema';
  }

  private gerarDescricaoAlerta(tipo: string): string {
    const descricoes = {
      'area_segura': 'O paciente se afastou da área segura configurada.',
      'batimentos': 'Os batimentos cardíacos apresentaram alteração significativa.',
      'oxigenacao': 'A oxigenação do sangue apresentou alteração significativa.',
      'queda': 'Sistema detectou possível queda do paciente.'
    };
    return descricoes[tipo as keyof typeof descricoes] || 'Alerta do sistema de monitoramento.';
  }

  private gerarDadosAlerta(tipo: string): any {
    switch (tipo) {
      case 'area_segura':
        return { areaSegura: 'Casa', localizacao: { lat: -23.5505, lng: -46.6333 } };
      case 'batimentos':
        return { batimentos: Math.floor(Math.random() * 40) + 60 };
      case 'oxigenacao':
        return { oxigenacao: Math.floor(Math.random() * 10) + 90 };
      case 'queda':
        return { localizacao: { lat: -23.5505, lng: -46.6333 } };
      default:
        return {};
    }
  }

  getTipoIcone(tipo: string): { path: string; bgColor: string; textColor: string } {
    const icones = {
      'area_segura': {
        path: 'M12 21a9 9 0 100-18 9 9 0 000 18zm0 0l3-3m-3 3l-3-3m3 3V9',
        bgColor: 'bg-green-100',
        textColor: 'text-green-600'
      },
      'batimentos': {
        path: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z',
        bgColor: 'bg-red-100',
        textColor: 'text-red-600'
      },
      'oxigenacao': {
        path: 'M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97c-.017-.22-.032-.441-.047-.662A19.098 19.098 0 0012 3c-2.392 0-4.545.896-6.18 2.308A48.493 48.493 0 00.75 4.97v.01M.75 4.97c0 1.505.6 2.935 1.68 4.01M.75 4.97c0-1.505.6-2.935 1.68-4.01m0 0c1.11-1.11 2.505-1.68 4.01-1.68m0 0c1.505 0 2.9.57 4.01 1.68m0 0c1.11 1.11 1.68 2.505 1.68 4.01m0 0c0 1.505-.57 2.9-1.68 4.01m0 0c-1.11 1.11-2.505 1.68-4.01 1.68m0 0c-1.505 0-2.9-.57-4.01-1.68',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-600'
      },
      'queda': {
        path: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
        bgColor: 'bg-red-100',
        textColor: 'text-red-600'
      }
    };
    return icones[tipo as keyof typeof icones] || icones['batimentos'];
  }

  getSeveridadeBadge(severidade: string): string {
    const badges = {
      'critica': 'bg-red-100 text-red-800',
      'alta': 'bg-orange-100 text-orange-800',
      'media': 'bg-yellow-100 text-yellow-800',
      'baixa': 'bg-blue-100 text-blue-800'
    };
    return badges[severidade as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  }

  getSeveridadeText(severidade: string): string {
    const textos = {
      'critica': 'Crítica',
      'alta': 'Alta',
      'media': 'Média',
      'baixa': 'Baixa'
    };
    return textos[severidade as keyof typeof textos] || 'Desconhecida';
  }

  formatDateTime(date: Date): string {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  marcarComoLido(id: string): void {
    this.alertas.update(alertas => 
      alertas.map(alerta => 
        alerta.id === id ? { ...alerta, lido: true } : alerta
      )
    );
  }

  marcarTodosComoLidos(): void {
    this.alertas.update(alertas => 
      alertas.map(alerta => ({ ...alerta, lido: true }))
    );
  }

  removerAlerta(id: string): void {
    this.alertas.update(alertas => 
      alertas.filter(alerta => alerta.id !== id)
    );
  }

  limparAvisos(): void {
    this.alertas.set([]);
  }
}
