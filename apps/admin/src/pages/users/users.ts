import { HttpClient, httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import Blank from '../../component/blank/blank';
import { FlexiGridModule } from 'flexi-grid';
import { RouterLink } from '@angular/router';
import { FlexiToastService } from 'flexi-toast';
import { FormsModule } from '@angular/forms';

export interface UserModel {
  id?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userName: string;
  email: string;
  password: string;
  isAdmin: boolean;
}

export const initialUser: UserModel = {
  firstName: '',
  lastName: '',
  userName: '',
  email: '',
  password: '',
  isAdmin: false,
  fullName: '',
};
@Component({
  imports: [Blank, FlexiGridModule, RouterLink, FormsModule],
  templateUrl: './users.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Users {
  readonly result = httpResource<UserModel[]>(() => 'api/users');
  readonly data = computed(() => this.result.value() ?? []);
  readonly loading = computed(() => this.result.isLoading());

  readonly #toast = inject(FlexiToastService);
  readonly #http = inject(HttpClient);

  delete(id: string) {
    this.#toast.showSwal(
      'Select the user',
      'Do you want to delete the user? ' + id,
      'Delete',
      () => {
        this.#http.delete('api/users/' + id).subscribe(() => {
          this.result.reload();
        });
      },
      'Cancel'
    );
  }
}
