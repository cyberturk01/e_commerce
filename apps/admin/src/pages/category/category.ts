import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import Blank from '../../component/blank/blank';
import { Common } from '../../services/common';
import { FlexiGridModule } from 'flexi-grid';
import { RouterLink } from '@angular/router';
import { HttpClient, httpResource } from '@angular/common/http';
import { FlexiToastService } from 'flexi-toast';

export interface CategoryModel {
  id?: string;
  name: string;
}
export const initialCategory: CategoryModel = {
  name: '',
};
@Component({
  imports: [Blank, FlexiGridModule, RouterLink],
  templateUrl: './category.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Category {
  readonly result = httpResource<CategoryModel[]>(
    () => 'http://localhost:3000/category'
  );
  readonly _common = inject(Common);
  readonly data = computed(() => this.result.value() ?? []);
  readonly loading = computed(() => this.result.isLoading());
  readonly #toast = inject(FlexiToastService);
  readonly #http = inject(HttpClient);

  delete(id: string) {
    this.#toast.showSwal(
      'Select the product',
      'Do you want to delete the item? ' + id,
      'Delete',
      () => {
        this.#http
          .delete('http://localhost:3000/category/' + id)
          .subscribe((res) => {
            this.result.reload();
          });
      },
      'Cancel'
    );
  }
}
