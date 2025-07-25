import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  resource,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlexiToastService } from 'flexi-toast';
import { lastValueFrom } from 'rxjs';
import { initialUser, UserModel } from '@shared/models/user.model';
import { FormsModule, NgForm } from '@angular/forms';
import { Common } from 'apps/admin/src/services/common';
import Blank from 'apps/admin/src/component/blank/blank';
import { BreadcrumbModel } from '../../layouts/breadcrumb/breadcrumb';

@Component({
  imports: [Blank, FormsModule],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Create {
  readonly id = signal<string | undefined>(undefined);
  readonly #http = inject(HttpClient);
  readonly #router = inject(Router);
  readonly #toast = inject(FlexiToastService);
  readonly result = resource({
    params: () => this.id(),
    loader: async () => {
      var res = await lastValueFrom(
        this.#http.get<UserModel>('api/users/' + this.id())
      );
      this.breadcrumb.update((prev) => [
        ...prev,
        { title: res.fullName, url: '/users/edit/' + this.id, icon: 'edit' },
      ]);
      return res;
    },
  });
  readonly data = linkedSignal(() => this.result.value() ?? { ...initialUser });
  readonly title = computed(() => (this.id() ? 'Edit User' : 'Add User'));
  readonly cardIcon = computed(() => (this.id() ? 'edit' : 'add'));
  readonly btnName = computed(() => (this.id() ? 'Update' : 'Save'));

  readonly breadcrumb = signal<BreadcrumbModel[]>([
    { title: 'Users', url: '/users', icon: 'group' },
  ]);

  readonly #activate = inject(ActivatedRoute);
  readonly #common = inject(Common);

  constructor() {
    this.#activate.params.subscribe((res) => {
      if (res['id']) {
        this.id.set(res['id']);
      } else {
        this.breadcrumb.update((prev) => [
          ...prev,
          { title: 'Add User', url: '/users/create', icon: 'add' },
        ]);
      }
    });
  }
  onInputChange(value: string) {
    this.#common.onNameChange(value);
  }

  save(form: NgForm) {
    const data2 = this.#common.dataOnNameChange();
    if (data2) {
      console.log('Saved:', data2);
      this.#common.resetNameChange();
    }
    if (!form.valid) {
      return;
    }
    console.log(form.value);
    this.data.update((prev) => ({
      ...prev,
      fullName: prev.firstName + ' ' + prev.lastName,
    }));
    if (!this.id()) {
      this.#http.post('api/users', this.data()).subscribe(() => {
        this.#router.navigateByUrl('/users');
        this.#toast.showToast(
          'Successful',
          'User successfully added',
          'success'
        );
      });
    } else {
      this.#http.put('api/users/' + this.id(), this.data()).subscribe(() => {
        this.#router.navigateByUrl('/users');
        this.#toast.showToast(
          'Successful',
          'User successfully editted',
          'info'
        );
      });
    }
  }
}
