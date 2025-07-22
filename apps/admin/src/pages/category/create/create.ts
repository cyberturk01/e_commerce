import { HttpClient } from '@angular/common/http';
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
import { ActivatedRoute, Router } from '@angular/router';
import Blank from 'apps/admin/src/component/blank/blank';
import { FlexiToastService } from 'flexi-toast';
import { lastValueFrom } from 'rxjs';
import { CategoryModel, initialCategory } from '../category';
import { FormsModule, NgForm } from '@angular/forms';
import { FlexiGridModule } from 'flexi-grid';
import { NgxMaskDirective } from 'ngx-mask';
import { Common } from 'apps/admin/src/services/common';

@Component({
  imports: [Blank, FlexiGridModule, FormsModule],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Create {
  [x: string]: any;
  readonly #http = inject(HttpClient);
  readonly #router = inject(Router);
  readonly #toast = inject(FlexiToastService);
  readonly result = resource({
    params: () => this.id(),
    loader: async () => {
      var res = await lastValueFrom(
        this.#http.get<CategoryModel>(
          'http://localhost:3000/category/' + this.id()
        )
      );
      return res;
    },
  });
  readonly activate = inject(ActivatedRoute);

  constructor() {
    this.activate.params.subscribe((res) => {
      if (res['id']) {
        this.id.set(res['id']);
      }
    });
  }
  readonly id = signal<string | undefined>(undefined);
  readonly cardTitle = computed(() =>
    this.id() ? 'Edit Category' : 'Add Category'
  );
  readonly cardIcon = computed(() => (this.id() ? 'edit' : 'add'));
  readonly btnName = computed(() => (this.id() ? 'Update' : 'Save'));
  readonly data = computed(() => this.result.value() ?? { ...initialCategory });

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
    console.log('ID:' + this.id());
    if (!form.valid) {
      return;
    }
    console.log(form.value);
    if (!this.id()) {
      this.#http
        .post('http://localhost:3000/category', this.data())
        .subscribe(() => {
          this.#router.navigateByUrl('/category');
          this.#toast.showToast(
            'Successful',
            'Category successfully added',
            'success'
          );
        });
    } else {
      this.#http
        .put('http://localhost:3000/category/' + this.id(), this.data())
        .subscribe(() => {
          this.#router.navigateByUrl('/category');
          this.#toast.showToast(
            'Successful',
            'Category successfully editted',
            'info'
          );
        });
    }
  }
}
