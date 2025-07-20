import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import Blank from '../../component/blank/blank';
import { Common } from '../../services/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FlexiGridModule } from 'flexi-grid';
export interface ProductModel {
  id?: string;
  name: string;
  imageUrl: string;
  price: number;
  stock: number;
  categoryId: string;
  categoryName: string;
}
@Component({
  imports: [Blank, FlexiGridModule],
  templateUrl: './products.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Products {
  readonly _common = inject(Common);
  readonly data = signal<ProductModel[]>([
    {
      imageUrl:
        'https://images.macrumors.com/article-new/2025/02/iphone-17-pro-asherdipps.jpg',
      name: 'Iphone 17',
      price: 1200,
      stock: 23,
      categoryId: '',
      categoryName: 'Phone',
    },
  ]);
}
