import { Route } from '@angular/router';
import { authGuard } from './pages/guards/auth-guard';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login'),
  },
  {
    path: '',
    loadComponent: () => import('./pages/layouts/layouts'),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home'),
      },
      {
        path: 'products',
        loadChildren: () => import('./pages/products/routes'),
      },
      {
        path: 'category',
        loadChildren: () => import('./pages/category/categoryRoutes'),
      },
      {
        path: 'users',
        loadChildren: () => import('./pages/users/routes'),
      },
    ],
  },
];
