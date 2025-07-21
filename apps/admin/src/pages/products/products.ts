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
import { NgxMaskDirective, NgxMaskPipe, NgxMaskService } from 'ngx-mask';
import { NgxMaskApplierService } from 'node_modules/ngx-mask/lib/ngx-mask-applier.service';
export interface ProductModel {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  stock: number;
  categoryId: string;
  categoryName: string;
}
export const initialProduct: ProductModel = {
  id: '',
  name: '',
  imageUrl: '',
  price: 0,
  stock: 0,
  categoryId: '',
  categoryName: '',
};
@Component({
  imports: [Blank, FlexiGridModule, RouterLink],
  templateUrl: './products.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Products {
  readonly result = httpResource<ProductModel[]>(
    () => 'http://localhost:3000/products'
  );
  readonly _common = inject(Common);
  readonly data = computed(() => this.result.value() ?? []);
  readonly loading = computed(() => this.result.isLoading());

  readonly categoryFilter = signal<FlexiGridFilterDataModel[]>([
    {
      name: 'Phone',
      value: 'phone',
    },
  ]);
  readonly #toast = inject(FlexiToastService);
  readonly #http = inject(HttpClient);
  delete(id: string) {
    this.#toast.showSwal(
      'Select the product',
      'Do you want to delete the item? ' + id,
      'Delete',
      () => {
        this.#http
          .delete('http://localhost:3000/products/' + id)
          .subscribe((res) => {
            this.result.reload();
          });
      },
      'Cancel'
    );
  }
}
