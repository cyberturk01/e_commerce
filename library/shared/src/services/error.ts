import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FlexiToastService } from 'flexi-toast';

@Injectable({
  providedIn: 'root',
})
export class Error {
  readonly #toast = inject(FlexiToastService);
  handle(err: HttpErrorResponse) {
    console.log(err);
    switch (err.status) {
      case 400:
        this.#toast.showToast('400: Error', err.message, 'error');
        break;
      case 500:
        this.#toast.showToast('500: Error', err.message, 'error');
        break;
      default:
        this.#toast.showToast('Something went wrong!', err.message, 'error');
        break;
    }
  }
}
