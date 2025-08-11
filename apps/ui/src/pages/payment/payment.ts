import { httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Common } from '../../services/common';
import { BasketModel } from '@shared/models/basket.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './payment.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Payment {
  readonly result = httpResource<BasketModel[]>(
    () => 'api/baskets?userId=' + this.#common.user()?.id
  );
  readonly data = computed(() => this.result.value() ?? []);
  readonly #common = inject(Common);
  readonly total = computed(() => {
    let val = 0;
    this.data().forEach((res) => (val += res.price * res.quantity));
    return val;
  });
  readonly tax = computed(() => (this.total() * 18) / 100);
}
