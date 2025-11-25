import { Routes } from '@angular/router';

export const INFORMACOES_PACIENTE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./informacoes-paciente').then(m => m.InformacoesPacienteComponent)
  }
];
