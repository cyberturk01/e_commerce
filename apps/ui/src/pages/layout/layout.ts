import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import Home from '../home/home';
import { httpResource } from '@angular/common/http';
import { CategoryModel } from '@shared/models/category.model';
import { Common } from '../../services/common';

@Component({
  imports: [RouterOutlet, RouterLink],
  templateUrl: './layout.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Layout {
  readonly result = httpResource<CategoryModel[]>(() => 'api/category');
  readonly data = computed(() => this.result.value() ?? []);
  readonly user = computed(() => this.#common.user());
  readonly basketCount = computed(() => this.#common.basketCount());
  readonly #router = inject(Router);
  readonly #common = inject(Common);

  logout() {
    localStorage.clear();
    this.#common.user.set(undefined);
    this.#common.basketCount.set(0);
    this.#router.navigateByUrl('/auth/login');
  }
}
