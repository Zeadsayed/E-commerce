import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartStateService } from '../../../cart/data-access/cart-state.service';
import { ProductsService } from '../../data-access/products.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductsDetailsComponent implements OnInit {
  id: string | null;
  data: Product | null = null;
  loading = false;
  quantity = 1;
  added = false;

  constructor(
    private route: ActivatedRoute,
    private service: ProductsService,
    private cartState: CartStateService,
  ) {
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct(): void {
    this.loading = true;
    this.service.getProductById(this.id).subscribe({
      next: (product) => {
        this.loading = false;
        this.data = product;
      },
      error: (error) => {
        this.loading = false;
        alert(error);
      },
    });
  }

  changeQuantity(change: number): void {
    this.quantity = Math.max(1, this.quantity + change);
  }

  addToCart(): void {
    if (!this.data) {
      return;
    }

    this.cartState.addItem(this.data, this.quantity);
    this.added = true;
    this.quantity = 1;
    window.setTimeout(() => (this.added = false), 2400);
  }
}
