export interface NavigationModel {
  title: string;
  url: string;
  icon: string;
}

export const navigations: NavigationModel[] = [
  {
    title: 'Home Page',
    url: '/',
    icon: 'home',
  },
  {
    title: 'Products',
    url: '/products',
    icon: 'deployed_code',
  },
  {
    title: 'Category',
    url: '/category',
    icon: 'category_search',
  },
];
