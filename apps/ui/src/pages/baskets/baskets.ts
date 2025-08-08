import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { Common } from '../../services/common';
import { HttpClient, httpResource } from '@angular/common/http';
import { BasketModel } from '@shared/models/basket.model';
import { CurrencyPipe } from '@angular/common';
import { FlexiToastService } from 'flexi-toast';

@Component({
  imports: [CurrencyPipe],
  templateUrl: './baskets.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Baskets {
  readonly #common = inject(Common);
  readonly result = httpResource<BasketModel[]>(() => {
    const endpoint = 'api/baskets?userId=' + this.#common.user()?.id;
    return endpoint;
  });
  readonly total = computed(() => {
    let val = 0;
    this.data().forEach((res) => (val += res.price * res.quantity));
    return val;
  });
  readonly tax = computed(() => (this.total() * 18) / 100);
  readonly data = computed(() => this.result.value() ?? []);
  readonly isLoading = computed(() => this.result.isLoading());
  readonly #http = inject(HttpClient);
  readonly #toast = inject(FlexiToastService);

  increment(val: BasketModel) {
    val.quantity++;
    this.#http.put('api/baskets/' + val.id, val).subscribe(() => {
      this.result.reload();
    });
  }
  decrement(val: BasketModel) {
    const count = val.quantity - 1;
    if (count <= 0) {
      this.#toast.showSwal(
        'Delete?',
        'Do you really want to remove this item?',
        'Sil',
        () => {
          this.#http.delete('api/baskets/' + val.id).subscribe(() => {
            this.result.reload();
          });
        }
      );
    } else {
      val.quantity--;
      this.#http.put('api/baskets/' + val.id, val).subscribe(() => {
        this.result.reload();
      });
    }
  }
}
