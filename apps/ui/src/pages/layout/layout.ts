import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import Home from '../home/home';
import { httpResource } from '@angular/common/http';
import { CategoryModel } from '@shared/models/category.model';

@Component({
  imports: [RouterOutlet, RouterLink],
  templateUrl: './layout.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Layout {
  readonly result = httpResource<CategoryModel[]>(() => 'api/category');
  readonly data = computed(() => this.result.value() ?? []);
}
