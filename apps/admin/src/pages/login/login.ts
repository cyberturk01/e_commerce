import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FlexiToastService } from 'flexi-toast';
import { UserModel } from '../users/users';
import { Router } from '@angular/router';

@Component({
  imports: [FormsModule],
  templateUrl: './login.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Login {
  readonly #http = inject(HttpClient);
  readonly #toast = inject(FlexiToastService);
  readonly #roater = inject(Router);
  signIn(form: NgForm) {
    if (!form.valid) {
      return;
    } else {
      this.#http
        .get<UserModel[]>(
          'api/users?userName=' +
            form.value['userName'] +
            '&password=' +
            form.value['password']
        )
        .subscribe((res) => {
          if (res.length === 0) {
            this.#toast.showToast(
              'Error',
              'Username or Password is not exist or wrong',
              'error'
            );
            return;
          } else if (!res[0].isAdmin) {
            this.#toast.showToast('Error', 'User is not authorized', 'error');
            return;
          } else {
            console.log(res[0]);

            localStorage.setItem('response', JSON.stringify(res[0]));
            this.#toast.showToast(
              'Succesful',
              'Successfully logged in',
              'success'
            );
            this.#roater.navigateByUrl('/');
          }
        });
    }
  }
}
