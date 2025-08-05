import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { initialUser, UserModel } from '@shared/models/user.model';
import { FlexiToastService } from 'flexi-toast';

@Component({
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Register {
  readonly data = signal<UserModel>(initialUser);
  readonly #http = inject(HttpClient);
  readonly toast = inject(FlexiToastService);
  readonly #router = inject(Router);
  signUp(form: NgForm) {
    if (!form.valid) {
      return;
    } else {
      this.data.update((prev) => ({
        ...prev,
        fullName: prev.firstName + ' ' + prev.lastName,
      }));
      this.#http.post('api/users', this.data()).subscribe(() => {
        this.toast.showToast('Successful', 'You are Successfully Registered');
        this.#router.navigateByUrl('/auth/login');
      });
    }
  }
}
