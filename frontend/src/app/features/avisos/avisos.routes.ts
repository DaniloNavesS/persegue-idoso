import { Routes } from '@angular/router';

export const AVISOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./avisos').then(m => m.AvisosComponent)
  }
];
