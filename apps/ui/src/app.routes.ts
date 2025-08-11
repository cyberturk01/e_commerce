import { Route } from '@angular/router';
import { authGuard } from './guard/auth-guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/layout/layout'),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home'),
      },
      {
        path: 'baskets',
        loadComponent: () => import('./pages/baskets/baskets'),
        canActivate: [authGuard],
      },
      {
        path: 'payment',
        loadComponent: () => import('./pages/payment/payment'),
        canActivate: [authGuard],
      },
      {
        path: 'products/:categoryUrl',
        loadComponent: () => import('./pages/home/home'),
      },
      {
        path: 'auth',
        loadChildren: () => import('./pages/auth/routes'),
      },
    ],
  },
];
