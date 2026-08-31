import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';

import { Product } from '../../products/models/product.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root',
})
export class CartStateService {
  private readonly storageKey = 'cart';
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>(
    this.readStoredItems(),
  );

  readonly items$ = this.itemsSubject.asObservable();
  readonly itemCount$ = this.items$.pipe(
    map((items) => items.reduce((count, item) => count + item.quantity, 0)),
    distinctUntilChanged(),
  );
  readonly total$ = this.items$.pipe(
    map((items) =>
      items.reduce((total, item) => total + item.item.price * item.quantity, 0),
    ),
    distinctUntilChanged(),
  );

  get snapshot(): CartItem[] {
    return this.itemsSubject.value.map((entry) => ({ ...entry }));
  }

  addItem(product: Product, quantity = 1): boolean {
    const safeQuantity = this.normalizeQuantity(quantity);
    const items = this.snapshot;
    const existing = items.find((entry) => entry.item.id === product.id);

    if (existing) {
      existing.quantity += safeQuantity;
    } else {
      items.push({ item: product, quantity: safeQuantity });
    }

    this.setItems(items);
    return Boolean(existing);
  }

  increment(productId: number): void {
    const item = this.snapshot.find((entry) => entry.item.id === productId);
    if (item) {
      this.setQuantity(productId, item.quantity + 1);
    }
  }

  decrement(productId: number): void {
    const item = this.snapshot.find((entry) => entry.item.id === productId);
    if (item) {
      this.setQuantity(productId, item.quantity - 1);
    }
  }

  setQuantity(productId: number, quantity: number): void {
    const safeQuantity = this.normalizeQuantity(quantity);
    const items = this.snapshot.map((entry) =>
      entry.item.id === productId
        ? { ...entry, quantity: safeQuantity }
        : entry,
    );
    this.setItems(items);
  }

  removeItem(productId: number): void {
    this.setItems(this.snapshot.filter((entry) => entry.item.id !== productId));
  }

  clear(): void {
    this.setItems([]);
  }

  private setItems(items: CartItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    this.itemsSubject.next(items);
  }

  private readStoredItems(): CartItem[] {
    try {
      const stored = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      if (!Array.isArray(stored)) {
        return [];
      }

      return stored
        .filter((entry) => entry?.item?.id != null)
        .map((entry) => ({
          item: entry.item,
          quantity: this.normalizeQuantity(entry.quantity),
        }));
    } catch {
      return [];
    }
  }

  private normalizeQuantity(quantity: number): number {
    return Math.max(1, Math.floor(Number(quantity) || 1));
  }
}
