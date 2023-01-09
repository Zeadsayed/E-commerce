import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  search=new BehaviorSubject<string>("");

  constructor(private http:HttpClient) { }

  getAllProducts() {
    return this.http.get(environment.baseApi +'products')
  }

  getAllCategories() {
    return this.http.get(environment.baseApi +'products/categories')
  }

  getProductsByCategory(keyword:string) {
    return this.http.get(environment.baseApi +'products/category/'+keyword)
  }

  getProductById(id:any) {
    return this.http.get(environment.baseApi +'products/'+id)
  }

}
