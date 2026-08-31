import { Product } from '../../products/models/product.model';

export interface CartItem {
  item: Product;
  quantity: number;
}
