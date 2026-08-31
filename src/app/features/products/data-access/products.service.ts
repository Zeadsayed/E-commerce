import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  search=new BehaviorSubject<string>("");

  constructor(private http:HttpClient) { }

  getAllProducts() {
    return this.http.get<Product[]>(environment.baseApi +'products')
  }

  getAllCategories() {
    return this.http.get<string[]>(environment.baseApi +'products/categories')
  }

  getProductsByCategory(keyword:string) {
    return this.http.get<Product[]>(environment.baseApi +'products/category/'+keyword)
  }

  getProductById(id:any) {
    return this.http.get<Product>(environment.baseApi +'products/'+id)
  }

}
