import { httpResource } from '@angular/common/http';
import { ProductModel } from '@shared/models/product.model';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Pipe,
  ViewEncapsulation,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe],
  templateUrl: './home.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {
  readonly result = httpResource<ProductModel[]>(() => 'api/products');
  readonly data = computed(() => this.result.value() ?? []);
  readonly loading = computed(() => this.result.isLoading());
}
