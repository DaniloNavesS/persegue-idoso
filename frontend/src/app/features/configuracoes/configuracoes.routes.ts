import { Routes } from '@angular/router';

export const CONFIGURACOES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./configuracoes').then(m => m.ConfiguracoesComponent)
  }
];
