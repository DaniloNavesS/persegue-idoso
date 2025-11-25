import { Routes } from '@angular/router';
import { VisualizacaoGps } from './visualizacao-gps/visualizacao-gps';

export const GPS_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'localizacao-atual' },
  { path: 'localizacao-atual', loadComponent: () => import('./localizacao-atual/localizacao-atual').then(m => m.LocalizacaoAtualComponent) },
  { path: 'visualizacao', component: VisualizacaoGps },
  {
    path: 'listar-areas-seguras',
    loadComponent: () => import('./listar-areas-seguras/listar-areas-seguras').then(m => m.ListarAreasSegurasComponent)
  },
];