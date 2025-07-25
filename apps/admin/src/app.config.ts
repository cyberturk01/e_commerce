import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNgxMask } from 'ngx-mask';
import { endpointInterceptor } from './interceptors/endpoint-interceptor';
import { errorInterceptor } from './interceptors/error-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(appRoutes),
    provideHttpClient(
      withInterceptors([endpointInterceptor, errorInterceptor])
    ),
    provideNgxMask(),
  ],
};
