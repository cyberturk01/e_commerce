import { Injectable, signal } from '@angular/core';
import { BreadcrumbModel } from '../pages/layouts/breadcrumb/breadcrumb';
import { CategoryModel } from '../pages/category/category';
import { ProductModel } from '../pages/products/products';
import { UserModel } from '../pages/users/users';

@Injectable({
  providedIn: 'root',
})
export class Common {
  readonly data = signal<BreadcrumbModel[]>([]);
  readonly user = signal<UserModel | undefined>(undefined);
  readonly dataOnNameChange = signal<CategoryModel | ProductModel | undefined>(
    undefined
  );

  set(data: BreadcrumbModel[]) {
    const val: BreadcrumbModel = {
      title: 'Home',
      icon: 'home',
      url: '/',
    };
    this.data.set([val, ...data]);
  }

  onNameChange(value: string) {
    const formatted = value
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

    this.dataOnNameChange.set({
      ...this.data(),
      name: formatted,
    });
  }

  resetNameChange() {
    this.dataOnNameChange.set(undefined);
  }
}
