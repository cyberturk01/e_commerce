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
    title: 'Category',
    url: '/category',
    icon: 'category_search',
  },
  {
    title: 'Products',
    url: '/products',
    icon: 'deployed_code',
  },
  {
    title: 'Users',
    url: '/users',
    icon: 'group',
  },
];
