import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from 'src/models/product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products!:Product[]
  constructor(private productService: ProductService) { }

  ngOnInit() {
    return this.productService.getAll().subscribe(data =>{
      this.products = (data as Product[]).slice(0,4);
    })
  }

}
