import { NgModule } from '@angular/core';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductsDetailsComponent } from './pages/product-details/product-details.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductsDetailsComponent,
    ProductCardComponent,
  ],
  imports: [SharedModule],
})
export class ProductsModule {}
