import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartStateService } from '../../../cart/data-access/cart-state.service';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../data-access/products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: string[] = [];
  loading = false;
  selectedCategory = 'all';
  notice = '';

  private sourceProducts: Product[] = [];
  private searchTerm = '';
  private searchSubscription?: Subscription;

  constructor(
    private service: ProductsService,
    private cartState: CartStateService,
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
    this.searchSubscription = this.service.search.subscribe((value) => {
      this.searchTerm = value.trim().toLowerCase();
      this.applySearch();
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  getProducts() {
    this.loading = true;
    this.service.getAllProducts().subscribe(
      (res) => {
        this.sourceProducts = res;
        this.applySearch();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        alert(error);
      },
    );
  }

  getCategories() {
    this.service.getAllCategories().subscribe(
      (res) => {
        this.categories = res;
      },
      (error) => {
        alert(error);
      },
    );
  }

  filterCategory(event: any) {
    this.selectedCategory = (event.target as HTMLSelectElement).value;
    this.selectedCategory === 'all'
      ? this.getProducts()
      : this.getProductsCategory(this.selectedCategory);
  }

  getProductsCategory(keyword: string) {
    this.loading = true;
    this.service.getProductsByCategory(keyword).subscribe((res) => {
      this.loading = false;
      this.sourceProducts = res;
      this.applySearch();
    });
  }

  addToCart(event: { item: Product; quantity: number }) {
    const quantityIncreased = this.cartState.addItem(
      event.item,
      event.quantity,
    );
    this.showNotice(
      quantityIncreased
        ? 'Cart quantity updated.'
        : 'Added to your cart.',
    );
  }

  private applySearch(): void {
    this.products = this.searchTerm
      ? this.sourceProducts.filter((product) =>
          `${product.title} ${product.category} ${product.description}`
            .toLowerCase()
            .includes(this.searchTerm),
        )
      : [...this.sourceProducts];
  }

  private showNotice(message: string): void {
    this.notice = message;
    window.setTimeout(() => (this.notice = ''), 2400);
  }
}
