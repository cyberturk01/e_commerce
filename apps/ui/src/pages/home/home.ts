import { HttpClient, httpResource } from '@angular/common/http';
import { ProductModel } from '@shared/models/product.model';
import { BasketModel } from '@shared/models/basket.model';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Pipe,
  Signal,
  signal,
  untracked,
  ViewEncapsulation,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { count } from 'rxjs';
import { Common } from '../../services/common';
import { FlexiToastService } from 'flexi-toast';

@Component({
  imports: [CurrencyPipe, InfiniteScrollDirective, RouterLink],
  templateUrl: './home.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {
  readonly categoryUrl = signal<string | undefined>(undefined);
  readonly countOfPlaceholder = signal<number[]>([1, 2, 3]);
  readonly categoryUrlPrevios = this.computedPrevious(this.categoryUrl);
  readonly limit = signal<number>(6);
  readonly start = signal<number>(0);
  readonly result = httpResource<ProductModel[]>(() => {
    let endpoint = 'api/products?';
    if (this.categoryUrl()) {
      endpoint += `categoryUrl=${this.categoryUrl()}&`;
    }
    endpoint += '_limit=' + this.limit() + '&_start=' + this.start();
    return endpoint;
  });
  readonly data = computed(() => this.result.value() ?? []);
  readonly dataSignal = signal<ProductModel[]>([]);
  readonly loading = computed(() => this.result.isLoading());
  readonly user = computed(() => this.#common.user());
  readonly #http = inject(HttpClient);
  readonly #toast = inject(FlexiToastService);
  readonly #activated = inject(ActivatedRoute);
  readonly #common = inject(Common);

  constructor() {
    this.#activated.params.subscribe((res) => {
      if (res['categoryUrl']) {
        this.categoryUrl.set(res['categoryUrl']);
      }
    });
    effect(() => {
      if (this.categoryUrlPrevios != this.categoryUrl) {
        this.dataSignal.set([...this.data()]);
        this.start.set(0);
        this.limit.set(6);
      } else {
        this.dataSignal.update((prev) => [...prev, ...this.data()]);
      }
    });
  }

  onScroll() {
    if (this.start() >= 0) {
      return;
    }
    this.limit.update((prev) => prev + 6);
    this.start.update((prev) => prev + 6);
  }
  computedPrevious<T>(s: Signal<T>): Signal<T> {
    let current = null as T;
    let previous = untracked(() => s());

    return computed(() => {
      current = s();
      const result = previous;
      previous = current;
      return result;
    });
  }

  addBasket(data: ProductModel) {
    const basket: BasketModel = {
      userId: this.#common.user()!.id!,
      productId: data.id!,
      productName: data.name,
      price: data.price,
      quantity: 1,
      productimageUrl: data.imageUrl,
    };
    this.#http.post('api/baskets/', basket).subscribe(() => {
      this.#toast.showToast(
        'Successful',
        'Product added successfully',
        'success'
      );
      this.#common.basketCount.update((prev) => prev + 1);
    });
  }
}
