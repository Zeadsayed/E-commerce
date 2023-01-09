import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/products/services/products.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  cartProducts:any[] = [];

  total:number = 0;

  searchTerm:string=''

  constructor(private service:ProductsService) { }

  ngOnInit(): void {

    this.getCartProducts()

  }

  getCartProducts() {

    if("cart" in localStorage) {
      this.cartProducts = JSON.parse(localStorage.getItem("cart")!)
      this.total=this.cartProducts.length
    }
  }

  search(event:any){
    this.searchTerm = (event.target as HTMLInputElement).value;
    console.log(this.searchTerm);
    this.service.search.next(this.searchTerm);
  }

}
