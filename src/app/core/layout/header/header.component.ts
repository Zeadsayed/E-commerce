import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../../features/auth/data-access/auth.service';
import { CartStateService } from '../../../features/cart/data-access/cart-state.service';
import { ProductsService } from '../../../features/products/data-access/products.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  searchTerm: string = '';
  readonly isAuthenticated$: Observable<boolean>;
  readonly cartCount$: Observable<number>;

  constructor(
    private service: ProductsService,
    private cartState: CartStateService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.cartCount$ = this.cartState.itemCount$;
  }

  search(event: any) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.service.search.next(this.searchTerm);
    if (!this.router.url.startsWith('/products')) {
      this.router.navigate(['/products']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/products']);
  }
}
