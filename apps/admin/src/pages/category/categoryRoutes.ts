import { Routes } from '@angular/router';

const categoryRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./category'),
  },
  {
    path: 'create',
    loadComponent: () => import('./create/create'),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./create/create'),
  },
];
export default categoryRoutes;
