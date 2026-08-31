import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  @Input() data!: Product;

  @Output() item = new EventEmitter<{ item: Product; quantity: number }>();

  add(): void {
    this.item.emit({ item: this.data, quantity: 1 });
  }
}
