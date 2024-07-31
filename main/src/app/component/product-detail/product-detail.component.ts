import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from 'src/models/product';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product!:Product;
  id: string;
  constructor(private route:ActivatedRoute,private productService:ProductService) {
    this.id=route.snapshot.params['id'];
   }

  ngOnInit() {
    this.productService.get(this.id).subscribe(data=>{
      this.product = data as Product;
    })
  }

}
