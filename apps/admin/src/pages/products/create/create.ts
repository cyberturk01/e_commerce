import { HttpClient, HttpRequest } from '@angular/common/http';
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

@Component({
  imports: [Blank, FlexiGridModule, FormsModule, NgxMaskDirective],
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
        this.#http.get<ProductModel>(
          'http://localhost:3000/products/' + this.id()
        )
      );
      return res;
    },
  });
  readonly data = linkedSignal(() => this.result.value() ?? initialProduct);
  readonly cardTitle = computed(() => (this.id() ? 'Edit Item' : 'Add Item'));
  readonly cardIcon = computed(() => (this.id() ? 'edit' : 'add'));
  readonly btnName = computed(() => (this.id() ? 'Update' : 'Save'));
  readonly id = signal<string | undefined>(undefined);
  readonly activate = inject(ActivatedRoute);

  constructor() {
    this.activate.params.subscribe((res) => {
      if (res['id']) {
        this.id.set(res['id']);
      }
    });
  }

  save(form: NgForm) {
    if (!form.valid) {
      return;
    }
    console.log(form.value);
    if (!this.id) {
      this.#http
        .post('http://localhost:3000/products', this.data())
        .subscribe(() => {
          this.#router.navigateByUrl('/products');
          this.#toast.showToast(
            'Successful',
            'Product successfully added',
            'success'
          );
        });
    } else {
      this.#http
        .put('http://localhost:3000/products/' + this.id(), this.data())
        .subscribe(() => {
          this.#router.navigateByUrl('/products');
          this.#toast.showToast(
            'Successful',
            'Product successfully editted',
            'info'
          );
        });
    }
  }
}
