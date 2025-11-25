import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface HealthData {
  timestamp: Date;
  heartRate: number;
  oxygenSaturation: number;
}

@Component({
  selector: 'app-informacoes-paciente',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Informações do Paciente</h1>
        <p class="text-gray-600">Monitoramento em tempo real dos sinais vitais</p>
      </div>

      <!-- Status Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Batimentos Cardíacos -->
        <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-red-500 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-red-600">{{ currentHeartRate() }}</div>
              <div class="text-sm text-red-500">BPM</div>
            </div>
          </div>
          <div class="text-sm text-gray-600 mb-2">Batimentos Cardíacos</div>
          <div class="flex items-center text-xs" [ngClass]="getHeartRateStatus().color">
            <div class="w-2 h-2 rounded-full mr-2" [ngClass]="getHeartRateStatus().dotColor"></div>
            {{ getHeartRateStatus().text }}
          </div>
        </div>

        <!-- Oxigenação -->
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-blue-500 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97c-.017-.22-.032-.441-.047-.662A19.098 19.098 0 0012 3c-2.392 0-4.545.896-6.18 2.308A48.493 48.493 0 00.75 4.97v.01M.75 4.97c0 1.505.6 2.935 1.68 4.01M.75 4.97c0-1.505.6-2.935 1.68-4.01m0 0c1.11-1.11 2.505-1.68 4.01-1.68m0 0c1.505 0 2.9.57 4.01 1.68m0 0c1.11 1.11 1.68 2.505 1.68 4.01m0 0c0 1.505-.57 2.9-1.68 4.01m0 0c-1.11 1.11-2.505 1.68-4.01 1.68m0 0c-1.505 0-2.9-.57-4.01-1.68" />
              </svg>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-blue-600">{{ currentOxygenSaturation() }}</div>
              <div class="text-sm text-blue-500">%</div>
            </div>
          </div>
          <div class="text-sm text-gray-600 mb-2">Oxigenação do Sangue</div>
          <div class="flex items-center text-xs" [ngClass]="getOxygenStatus().color">
            <div class="w-2 h-2 rounded-full mr-2" [ngClass]="getOxygenStatus().dotColor"></div>
            {{ getOxygenStatus().text }}
          </div>
        </div>

        <!-- Status Geral -->
        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-green-500 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-green-600">Estável</div>
              <div class="text-xs text-green-500">Status</div>
            </div>
          </div>
          <div class="text-sm text-gray-600 mb-2">Condição Geral</div>
          <div class="flex items-center text-xs text-green-600">
            <div class="w-2 h-2 rounded-full mr-2 bg-green-500"></div>
            Todos os sinais normais
          </div>
        </div>

        <!-- Última Atualização -->
        <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-gray-500 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold text-gray-600">{{ lastUpdate() }}</div>
              <div class="text-xs text-gray-500">min atrás</div>
            </div>
          </div>
          <div class="text-sm text-gray-600 mb-2">Última Atualização</div>
          <div class="flex items-center text-xs text-gray-500">
            <div class="w-2 h-2 rounded-full mr-2 bg-gray-400"></div>
            Dados em tempo real
          </div>
        </div>
      </div>

      <!-- Gráficos e Histórico -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Gráfico de Batimentos -->
        <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Batimentos Cardíacos</h3>
            <div class="flex space-x-2">
              <button class="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-full">1H</button>
              <button class="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">6H</button>
              <button class="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">24H</button>
            </div>
          </div>
          <div class="h-48 flex items-end justify-between space-x-1">
            <div *ngFor="let data of heartRateHistory()" 
                 class="bg-red-400 rounded-t" 
                 [style.height.%]="(data / 200) * 100"
                 [style.width.%]="100 / heartRateHistory().length">
            </div>
          </div>
          <div class="mt-4 flex justify-between text-xs text-gray-500">
            <span>60 BPM</span>
            <span>100 BPM</span>
            <span>200 BPM</span>
          </div>
        </div>

        <!-- Gráfico de Oxigenação -->
        <div class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Oxigenação do Sangue</h3>
            <div class="flex space-x-2">
              <button class="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">1H</button>
              <button class="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">6H</button>
              <button class="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">24H</button>
            </div>
          </div>
          <div class="h-48 flex items-end justify-between space-x-1">
            <div *ngFor="let data of oxygenHistory()" 
                 class="bg-blue-400 rounded-t" 
                 [style.height.%]="(data / 100) * 100"
                 [style.width.%]="100 / oxygenHistory().length">
            </div>
          </div>
          <div class="mt-4 flex justify-between text-xs text-gray-500">
            <span>90%</span>
            <span>95%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <!-- Histórico Detalhado -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">Histórico Detalhado</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batimentos</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Oxigenação</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let record of healthHistory()" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ formatTime(record.timestamp) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span class="px-2 py-1 text-xs rounded-full" 
                        [ngClass]="getHeartRateStatus(record.heartRate).bgColor">
                    {{ record.heartRate }} BPM
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span class="px-2 py-1 text-xs rounded-full" 
                        [ngClass]="getOxygenStatus(record.oxygenSaturation).bgColor">
                    {{ record.oxygenSaturation }}%
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Normal
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class InformacoesPacienteComponent {
  // Dados simulados para demonstração
  readonly currentHeartRate = signal(72);
  readonly currentOxygenSaturation = signal(98);
  readonly lastUpdate = signal(2);

  readonly heartRateHistory = signal([72, 75, 68, 70, 73, 71, 69, 74, 76, 72, 70, 75, 73, 71, 68, 72, 74, 70, 73, 75]);
  readonly oxygenHistory = signal([98, 97, 99, 98, 97, 98, 99, 97, 98, 99, 98, 97, 98, 99, 98, 97, 98, 99, 98, 97]);

  readonly healthHistory = signal<HealthData[]>([
    { timestamp: new Date(Date.now() - 10 * 60000), heartRate: 72, oxygenSaturation: 98 },
    { timestamp: new Date(Date.now() - 9 * 60000), heartRate: 75, oxygenSaturation: 97 },
    { timestamp: new Date(Date.now() - 8 * 60000), heartRate: 68, oxygenSaturation: 99 },
    { timestamp: new Date(Date.now() - 7 * 60000), heartRate: 70, oxygenSaturation: 98 },
    { timestamp: new Date(Date.now() - 6 * 60000), heartRate: 73, oxygenSaturation: 97 },
    { timestamp: new Date(Date.now() - 5 * 60000), heartRate: 71, oxygenSaturation: 98 },
    { timestamp: new Date(Date.now() - 4 * 60000), heartRate: 69, oxygenSaturation: 99 },
    { timestamp: new Date(Date.now() - 3 * 60000), heartRate: 74, oxygenSaturation: 97 },
    { timestamp: new Date(Date.now() - 2 * 60000), heartRate: 76, oxygenSaturation: 98 },
    { timestamp: new Date(Date.now() - 1 * 60000), heartRate: 72, oxygenSaturation: 99 }
  ]);

  constructor() {
    // Simular atualizações em tempo real
    setInterval(() => {
      this.updateHealthData();
    }, 5000);
  }

  private updateHealthData(): void {
    // Simular variações nos dados
    const newHeartRate = Math.floor(Math.random() * 20) + 60; // 60-80 BPM
    const newOxygenSaturation = Math.floor(Math.random() * 4) + 96; // 96-99%
    
    this.currentHeartRate.set(newHeartRate);
    this.currentOxygenSaturation.set(newOxygenSaturation);
    this.lastUpdate.set(0);

    // Atualizar histórico
    const newRecord: HealthData = {
      timestamp: new Date(),
      heartRate: newHeartRate,
      oxygenSaturation: newOxygenSaturation
    };

    this.healthHistory.update(history => [newRecord, ...history.slice(0, 19)]);
    this.heartRateHistory.update(history => [newHeartRate, ...history.slice(0, 19)]);
    this.oxygenHistory.update(history => [newOxygenSaturation, ...history.slice(0, 19)]);

    // Atualizar contador de tempo
    setInterval(() => {
      this.lastUpdate.update(current => current + 1);
    }, 60000);
  }

  getHeartRateStatus(rate: number = this.currentHeartRate()): { text: string; color: string; dotColor: string; bgColor: string } {
    if (rate < 60) {
      return { text: 'Baixo', color: 'text-red-600', dotColor: 'bg-red-500', bgColor: 'bg-red-100 text-red-800' };
    } else if (rate > 100) {
      return { text: 'Alto', color: 'text-red-600', dotColor: 'bg-red-500', bgColor: 'bg-red-100 text-red-800' };
    } else {
      return { text: 'Normal', color: 'text-green-600', dotColor: 'bg-green-500', bgColor: 'bg-green-100 text-green-800' };
    }
  }

  getOxygenStatus(saturation: number = this.currentOxygenSaturation()): { text: string; color: string; dotColor: string; bgColor: string } {
    if (saturation < 95) {
      return { text: 'Baixo', color: 'text-red-600', dotColor: 'bg-red-500', bgColor: 'bg-red-100 text-red-800' };
    } else if (saturation < 97) {
      return { text: 'Atenção', color: 'text-yellow-600', dotColor: 'bg-yellow-500', bgColor: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { text: 'Normal', color: 'text-green-600', dotColor: 'bg-green-500', bgColor: 'bg-green-100 text-green-800' };
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}
