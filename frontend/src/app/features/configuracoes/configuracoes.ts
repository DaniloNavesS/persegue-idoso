import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ContatoEmergencia {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  tipo: 'familia' | 'medico' | 'cuidador' | 'emergencia';
  ativo: boolean;
  alertas: {
    areaSegura: boolean;
    batimentos: boolean;
    oxigenacao: boolean;
    queda: boolean;
  };
}

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
        <p class="text-gray-600">Gerencie as configurações do sistema</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Configurações Gerais -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div class="flex items-center mb-4">
            <div class="p-2 bg-blue-100 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-blue-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m0 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m0-12h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125H7.5m0-12h-.375c-.621 0-1.125.504-1.125 1.125v9.75c0 .621.504 1.125 1.125 1.125H7.5" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Configurações Gerais</h3>
          </div>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Notificações</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked>
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Modo Escuro</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Configurações de GPS -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div class="flex items-center mb-4">
            <div class="p-2 bg-green-100 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-green-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0l3-3m-3 3l-3-3m3 3V9" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">GPS</h3>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Precisão GPS</label>
              <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Alta (1-3 metros)</option>
                <option>Média (3-10 metros)</option>
                <option>Baixa (10+ metros)</option>
              </select>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Rastreamento em Background</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked>
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Configurações de Monitoramento -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div class="flex items-center mb-4">
            <div class="p-2 bg-red-100 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-red-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Monitoramento de Saúde</h3>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Intervalo de Monitoramento</label>
              <select class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>1 minuto</option>
                <option>5 minutos</option>
                <option>10 minutos</option>
                <option>30 minutos</option>
              </select>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Alertas de Emergência</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked>
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Configurações de Privacidade -->
        <div class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div class="flex items-center mb-4">
            <div class="p-2 bg-purple-100 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-purple-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Privacidade</h3>
          </div>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Compartilhar Dados de Localização</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer">
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Armazenamento Local</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" class="sr-only peer" checked>
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Seção de Contatos de Emergência -->
      <div class="mt-8">
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div class="p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="p-3 bg-red-100 rounded-lg mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-red-600">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h.75a.75.75 0 00.75-.75v-4.5a.75.75 0 00-.75-.75h-.75a8.25 8.25 0 01-8.25-8.25v-.75a.75.75 0 00-.75-.75H2.25a.75.75 0 00-.75.75v4.5a.75.75 0 00.75.75h.75z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">Contatos de Emergência</h2>
                  <p class="text-gray-600">Configure quem receberá os alertas do sistema</p>
                </div>
              </div>
              <button (click)="adicionarContato()" 
                      class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Adicionar Contato
              </button>
            </div>
          </div>

          <!-- Lista de Contatos -->
          <div class="p-6">
            <div class="space-y-4">
              <div *ngFor="let contato of contatosEmergencia()" 
                   class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                   [ngClass]="{ 'opacity-50': !contato.ativo }">
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <div class="flex-shrink-0">
                      <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-gray-600">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center space-x-2 mb-1">
                        <h3 class="text-lg font-semibold text-gray-900">{{ contato.nome }}</h3>
                        <span class="px-2 py-1 text-xs font-medium rounded-full" [ngClass]="getTipoContatoColor(contato.tipo)">
                          {{ getTipoContatoText(contato.tipo) }}
                        </span>
                        <span *ngIf="!contato.ativo" class="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                          Inativo
                        </span>
                      </div>
                      
                      <div class="text-sm text-gray-600 space-y-1">
                        <div class="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h.75a.75.75 0 00.75-.75v-4.5a.75.75 0 00-.75-.75h-.75a8.25 8.25 0 01-8.25-8.25v-.75a.75.75 0 00-.75-.75H2.25a.75.75 0 00-.75.75v4.5a.75.75 0 00.75.75h.75z" />
                          </svg>
                          {{ contato.telefone }}
                        </div>
                        <div class="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                          </svg>
                          {{ contato.email }}
                        </div>
                      </div>
                      
                      <!-- Alertas configurados -->
                      <div class="mt-3">
                        <div class="text-xs text-gray-500 mb-2">Alertas configurados:</div>
                        <div class="flex flex-wrap gap-2">
                          <span *ngIf="contato.alertas.areaSegura" class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            Área Segura
                          </span>
                          <span *ngIf="contato.alertas.batimentos" class="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            Batimentos
                          </span>
                          <span *ngIf="contato.alertas.oxigenacao" class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Oxigenação
                          </span>
                          <span *ngIf="contato.alertas.queda" class="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                            Queda
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <button (click)="toggleContatoAtivo(contato.id)" 
                            class="px-3 py-1 text-xs rounded-lg"
                            [ngClass]="contato.ativo ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'">
                      {{ contato.ativo ? 'Ativo' : 'Inativo' }}
                    </button>
                    <button (click)="editarContato(contato)" 
                            class="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                      Editar
                    </button>
                    <button (click)="removerContato(contato.id)" 
                            class="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                      Remover
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Estado vazio -->
              <div *ngIf="contatosEmergencia().length === 0" class="text-center py-8">
                <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-400">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h.75a.75.75 0 00.75-.75v-4.5a.75.75 0 00-.75-.75h-.75a8.25 8.25 0 01-8.25-8.25v-.75a.75.75 0 00-.75-.75H2.25a.75.75 0 00-.75.75v4.5a.75.75 0 00.75.75h.75z" />
                  </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum contato de emergência</h3>
                <p class="text-gray-500 mb-4">Adicione contatos para receber alertas do sistema.</p>
                <button (click)="adicionarContato()" 
                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Adicionar Primeiro Contato
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div class="mt-8 flex justify-end space-x-4">
        <button class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Cancelar
        </button>
        <button class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Salvar Configurações
        </button>
      </div>

      <!-- Modal de Formulário de Contato -->
      @if (mostrarFormularioContato()) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ editandoContato() ? 'Editar Contato' : 'Adicionar Contato' }}
                </h3>
                <button (click)="cancelarFormulario()" 
                        class="text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form (ngSubmit)="salvarContato()" class="p-6 space-y-4">
              <!-- Nome -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                <input type="text" 
                       [(ngModel)]="novoContato.nome" 
                       name="nome"
                       required
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                       placeholder="Nome completo">
              </div>

              <!-- Telefone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                <input type="tel" 
                       [(ngModel)]="novoContato.telefone" 
                       name="telefone"
                       required
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                       placeholder="(11) 99999-9999">
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input type="email" 
                       [(ngModel)]="novoContato.email" 
                       name="email"
                       required
                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                       placeholder="email@exemplo.com">
              </div>

              <!-- Tipo de Contato -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Contato *</label>
                <select [(ngModel)]="novoContato.tipo" 
                        name="tipo"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
                  <option value="familia">Família</option>
                  <option value="medico">Médico</option>
                  <option value="cuidador">Cuidador</option>
                  <option value="emergencia">Emergência</option>
                </select>
              </div>

              <!-- Status Ativo -->
              <div class="flex items-center">
                <input type="checkbox" 
                       [(ngModel)]="novoContato.ativo" 
                       name="ativo"
                       id="ativo"
                       class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded">
                <label for="ativo" class="ml-2 block text-sm text-gray-700">
                  Contato ativo (receberá alertas)
                </label>
              </div>

              <!-- Configurações de Alertas -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">Tipos de Alertas a Receber</label>
                <div class="space-y-3">
                  <div class="flex items-center">
                    <input type="checkbox" 
                           [(ngModel)]="novoContato.alertas.areaSegura" 
                           name="areaSegura"
                           id="areaSegura"
                           class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded">
                    <label for="areaSegura" class="ml-2 block text-sm text-gray-700">
                      Área Segura
                    </label>
                  </div>
                  
                  <div class="flex items-center">
                    <input type="checkbox" 
                           [(ngModel)]="novoContato.alertas.batimentos" 
                           name="batimentos"
                           id="batimentos"
                           class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded">
                    <label for="batimentos" class="ml-2 block text-sm text-gray-700">
                      Batimentos Cardíacos
                    </label>
                  </div>
                  
                  <div class="flex items-center">
                    <input type="checkbox" 
                           [(ngModel)]="novoContato.alertas.oxigenacao" 
                           name="oxigenacao"
                           id="oxigenacao"
                           class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                    <label for="oxigenacao" class="ml-2 block text-sm text-gray-700">
                      Oxigenação do Sangue
                    </label>
                  </div>
                  
                  <div class="flex items-center">
                    <input type="checkbox" 
                           [(ngModel)]="novoContato.alertas.queda" 
                           name="queda"
                           id="queda"
                           class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded">
                    <label for="queda" class="ml-2 block text-sm text-gray-700">
                      Detecção de Queda
                    </label>
                  </div>
                </div>
              </div>

              <!-- Botões do Modal -->
              <div class="flex justify-end space-x-3 pt-4">
                <button type="button" 
                        (click)="cancelarFormulario()"
                        class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500">
                  Cancelar
                </button>
                <button type="submit" 
                        class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                  {{ editandoContato() ? 'Salvar Alterações' : 'Adicionar Contato' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class ConfiguracoesComponent {
  // Estados do formulário
  readonly mostrarFormularioContato = signal(false);
  readonly editandoContato = signal<ContatoEmergencia | null>(null);
  
  // Dados do formulário
  novoContato = {
    nome: '',
    telefone: '',
    email: '',
    tipo: 'familia' as 'familia' | 'medico' | 'cuidador' | 'emergencia',
    ativo: true,
    alertas: {
      areaSegura: true,
      batimentos: true,
      oxigenacao: true,
      queda: true
    }
  };

  // Lista de contatos de emergência
  readonly contatosEmergencia = signal<ContatoEmergencia[]>([
    {
      id: '1',
      nome: 'Maria Silva',
      telefone: '(11) 99999-9999',
      email: 'maria.silva@email.com',
      tipo: 'familia',
      ativo: true,
      alertas: {
        areaSegura: true,
        batimentos: true,
        oxigenacao: false,
        queda: true
      }
    },
    {
      id: '2',
      nome: 'Dr. João Santos',
      telefone: '(11) 3333-4444',
      email: 'joao.santos@clinica.com',
      tipo: 'medico',
      ativo: true,
      alertas: {
        areaSegura: false,
        batimentos: true,
        oxigenacao: true,
        queda: true
      }
    },
    {
      id: '3',
      nome: 'Ana Costa',
      telefone: '(11) 8888-7777',
      email: 'ana.costa@cuidador.com',
      tipo: 'cuidador',
      ativo: true,
      alertas: {
        areaSegura: true,
        batimentos: false,
        oxigenacao: true,
        queda: true
      }
    }
  ]);

  constructor() {}

  // Métodos para gerenciar contatos
  adicionarContato(): void {
    this.editandoContato.set(null);
    this.novoContato = {
      nome: '',
      telefone: '',
      email: '',
      tipo: 'familia',
      ativo: true,
      alertas: {
        areaSegura: true,
        batimentos: true,
        oxigenacao: true,
        queda: true
      }
    };
    this.mostrarFormularioContato.set(true);
  }

  editarContato(contato: ContatoEmergencia): void {
    this.editandoContato.set(contato);
    this.novoContato = { ...contato };
    this.mostrarFormularioContato.set(true);
  }

  salvarContato(): void {
    if (this.editandoContato()) {
      // Editando contato existente
      this.contatosEmergencia.update(contatos =>
        contatos.map(contato =>
          contato.id === this.editandoContato()!.id
            ? { ...this.novoContato, id: contato.id }
            : contato
        )
      );
    } else {
      // Adicionando novo contato
      const novoContato: ContatoEmergencia = {
        ...this.novoContato,
        id: Date.now().toString()
      };
      this.contatosEmergencia.update(contatos => [novoContato, ...contatos]);
    }
    
    this.cancelarFormulario();
  }

  removerContato(id: string): void {
    this.contatosEmergencia.update(contatos =>
      contatos.filter(contato => contato.id !== id)
    );
  }

  cancelarFormulario(): void {
    this.mostrarFormularioContato.set(false);
    this.editandoContato.set(null);
  }

  toggleContatoAtivo(id: string): void {
    this.contatosEmergencia.update(contatos =>
      contatos.map(contato =>
        contato.id === id ? { ...contato, ativo: !contato.ativo } : contato
      )
    );
  }

  getTipoContatoText(tipo: string): string {
    const tipos = {
      'familia': 'Família',
      'medico': 'Médico',
      'cuidador': 'Cuidador',
      'emergencia': 'Emergência'
    };
    return tipos[tipo as keyof typeof tipos] || 'Desconhecido';
  }

  getTipoContatoColor(tipo: string): string {
    const cores = {
      'familia': 'bg-blue-100 text-blue-800',
      'medico': 'bg-green-100 text-green-800',
      'cuidador': 'bg-purple-100 text-purple-800',
      'emergencia': 'bg-red-100 text-red-800'
    };
    return cores[tipo as keyof typeof cores] || 'bg-gray-100 text-gray-800';
  }
}
