export interface BasketModel {
  id?: string;
  userId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}
export const initalBasket: BasketModel = {
  userId: '',
  productId: '',
  productName: '',
  price: 0,
  quantity: 1,
};
