import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../auth/data-access/auth.service';
import { CartStateService } from '../../data-access/cart-state.service';
import { CartsService } from '../../data-access/cart.service';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  readonly cartProducts$: Observable<CartItem[]>;
  readonly total$: Observable<number>;
  success = false;

  constructor(
    private service: CartsService,
    private cartState: CartStateService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.cartProducts$ = this.cartState.items$;
    this.total$ = this.cartState.total$;
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  addAmount(productId: number): void {
    this.cartState.increment(productId);
  }

  minsAmount(productId: number): void {
    this.cartState.decrement(productId);
  }

  updateQuantity(productId: number, event: Event): void {
    this.cartState.setQuantity(
      productId,
      Number((event.target as HTMLInputElement).value),
    );
  }

  deleteProduct(productId: number): void {
    this.cartState.removeItem(productId);
  }

  clearCart(): void {
    this.cartState.clear();
  }

  addCart(): void {
    const products = this.cartState.snapshot.map((item) => {
      return {
        productId: item.item.id,
        quantity: item.quantity,
      };
    });

    if (products.length === 0) {
      this.success = false;
      alert('No Products In Your Cart');
      return;
    }

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: '/cart' },
      });
      return;
    }

    const model = {
      userId: 5,
      date: new Date(),
      products: products,
    };
    this.service.createNewCart(model).subscribe(() => {
      this.clearCart();
      this.success = true;
    });
  }
}
