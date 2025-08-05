import { httpResource } from '@angular/common/http';
import { ProductModel } from '@shared/models/product.model';
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
import { ActivatedRoute } from '@angular/router';
import { count } from 'rxjs';

@Component({
  imports: [CurrencyPipe, InfiniteScrollDirective],
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

  readonly #activated = inject(ActivatedRoute);

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
}
