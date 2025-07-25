import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import Blank from '../../component/blank/blank';
import { Common } from '../../services/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FlexiGridFilterDataModel, FlexiGridModule } from 'flexi-grid';
import { HttpClient, httpResource } from '@angular/common/http';
import { FlexiToastService } from 'flexi-toast';
import { CategoryModel } from '@shared/models/category.model';
import { ProductModel } from '@shared/models/product.model';

@Component({
  imports: [Blank, FlexiGridModule, RouterLink],
  templateUrl: './products.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Products {
  readonly result = httpResource<ProductModel[]>(() => 'api/products');
  readonly _common = inject(Common);
  readonly data = computed(() => this.result.value() ?? []);
  readonly loading = computed(() =>
    this.result.error() ? false : this.result.isLoading()
  );

  readonly categoryResult = httpResource<CategoryModel[]>(() => 'api/category');

  readonly categoryFilter = computed<FlexiGridFilterDataModel[]>(() => {
    const categories = this.categoryResult.value() ?? [];
    const filters = categories.map<FlexiGridFilterDataModel>((val) => ({
      name: val.name,
      value: val.name,
    }));
    return filters;
  });
  readonly #toast = inject(FlexiToastService);
  readonly #http = inject(HttpClient);
  delete(id: string) {
    this.#toast.showSwal(
      'Select the product',
      'Do you want to delete the item? ' + id,
      'Delete',
      () => {
        this.#http.delete('api/products/' + id).subscribe((res) => {
          this.result.reload();
        });
      },
      'Cancel'
    );
  }
}
