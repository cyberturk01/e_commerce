import { HttpClient, HttpRequest, httpResource } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  resource,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Blank from 'apps/admin/src/component/blank/blank';
import { FlexiGridModule } from 'flexi-grid';
import { FlexiToastService } from 'flexi-toast';
import { NgxMaskDirective } from 'ngx-mask';
import { lastValueFrom } from 'rxjs';
import { initialProduct, ProductModel } from '../products';
import { Common } from 'apps/admin/src/services/common';
import { FlexiSelectModule } from 'flexi-select';
import { CategoryModel } from '../../category/category';

@Component({
  imports: [
    Blank,
    FlexiGridModule,
    FormsModule,
    NgxMaskDirective,
    FlexiSelectModule,
  ],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Create {
  readonly #http = inject(HttpClient);
  readonly #router = inject(Router);
  readonly #toast = inject(FlexiToastService);
  readonly result = resource({
    params: () => this.id(),
    loader: async () => {
      var res = await lastValueFrom(
        this.#http.get<ProductModel>('api/products/' + this.id())
      );
      return res;
    },
  });
  readonly data = linkedSignal(
    () => this.result.value() ?? { ...initialProduct }
  );
  readonly cardTitle = computed(() => (this.id() ? 'Edit Item' : 'Add Item'));
  readonly cardIcon = computed(() => (this.id() ? 'edit' : 'add'));
  readonly btnName = computed(() => (this.id() ? 'Update' : 'Save'));
  readonly id = signal<string | undefined>(undefined);
  readonly activate = inject(ActivatedRoute);

  readonly categoryResult = httpResource<CategoryModel[]>(() => 'api/category');
  readonly categories = computed(() => this.categoryResult.value() ?? []);
  readonly categoryLoading = computed(() => this.categoryResult.isLoading());

  constructor() {
    this.activate.params.subscribe((res) => {
      if (res['id']) {
        this.id.set(res['id']);
      }
    });
  }
  readonly _common = inject(Common);

  onInputChange(value: string) {
    this._common.onNameChange(value);
  }

  save(form: NgForm) {
    const data = this._common.dataOnNameChange();
    if (data) {
      console.log('Saved:', data);
      this._common.resetNameChange();
    }
    if (!form.valid) {
      return;
    }
    console.log(form.value);
    if (!this.id()) {
      this.#http.post('api/products', this.data()).subscribe(() => {
        this.#router.navigateByUrl('/products');
        this.#toast.showToast(
          'Successful',
          'Product successfully added',
          'success'
        );
      });
    } else {
      this.#http.put('api/products/' + this.id(), this.data()).subscribe(() => {
        this.#router.navigateByUrl('/products');
        this.#toast.showToast(
          'Successful',
          'Product successfully editted',
          'info'
        );
      });
    }
  }
  setCategoryName() {
    const id = this.data().categoryId;
    const category = this.categories().find((s) => (s.id = id));
    this.data.update((prev) => ({
      ...prev,
      categoryName: category?.name ?? '',
    }));
  }
}
