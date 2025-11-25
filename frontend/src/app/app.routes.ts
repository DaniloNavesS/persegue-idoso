import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'gps',
    loadChildren: () =>
      import('./features/gps_modulo/gps_modulo.routes').then(m => m.GPS_ROUTES),
  },
  {
    path: 'configuracoes',
    loadChildren: () =>
      import('./features/configuracoes/configuracoes.routes').then(m => m.CONFIGURACOES_ROUTES),
  },
  {
    path: 'informacoes-paciente',
    loadChildren: () =>
      import('./features/informacoes-paciente/informacoes-paciente.routes').then(m => m.INFORMACOES_PACIENTE_ROUTES),
  },
  {
    path: 'avisos',
    loadChildren: () =>
      import('./features/avisos/avisos.routes').then(m => m.AVISOS_ROUTES),
  },
  {
    path: '',
    redirectTo: 'gps',
    pathMatch: 'full'
  },
  
];
