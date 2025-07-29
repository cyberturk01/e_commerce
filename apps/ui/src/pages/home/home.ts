import { httpResource } from '@angular/common/http';
import { ProductModel } from '@shared/models/product.model';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Pipe,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [CurrencyPipe, InfiniteScrollDirective],
  templateUrl: './home.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {
  readonly categoryKey = signal<string | undefined>(undefined);
  readonly limit = signal<number>(6);
  readonly start = signal<number>(0);
  readonly result = httpResource<ProductModel[]>(
    () => 'api/products?_limit=' + this.limit() + '&_start=' + this.start()
  );
  readonly data = computed(() => this.result.value() ?? []);
  readonly dataSignal = signal<ProductModel[]>([]);
  readonly loading = computed(() => this.result.isLoading());

  readonly #activated = inject(ActivatedRoute);

  constructor() {
    this.#activated.params.subscribe((res) => {
      if (res['categoryKey']) {
        this.categoryKey.set(res['categoryKey']);
      }
    });
    effect(() => {
      this.dataSignal.update((prev) => [...prev, ...this.data()]);
    });
  }

  onScroll() {
    this.limit.update((prev) => prev + 6);
    this.start.update((prev) => prev + 6);
  }
}
