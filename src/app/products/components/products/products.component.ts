import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductComponent implements OnInit {
  @Input() data!:Product

  @Output() item = new EventEmitter();
  addButton:boolean = false;
  amount:number = 0

  searchKey:string=''
  
  constructor(private service:ProductsService) { }

  ngOnInit(): void {
    this.service.search.subscribe(val=>{
      this.searchKey = val
    })
  }


  add() {
    this.item.emit({item:this.data ,quantity:this.amount })
  }

}
