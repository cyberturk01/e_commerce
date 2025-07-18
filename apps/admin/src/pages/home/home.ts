import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import Blank from '../../component/blank/blank';
import { Common } from '../../services/common';
import Breadcrumb, { BreadcrumbModel } from '../layouts/breadcrumb/breadcrumb';

@Component({
  selector: 'app-home',
  imports: [Blank],
  templateUrl: './home.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {
  // readonly _common = inject(Common);
  // readonly breadcrumbs = signal<BreadcrumbModel[]>([
  //   { title: 'Home as', icon: 'home', url: '/' },
  // ]);
}
