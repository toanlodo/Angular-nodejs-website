import { ProductService } from '../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {

  products!: Product[];
  constructor(private productService: ProductService, private router:Router) { }

  ngOnInit() {
    return this.productService.getAll().subscribe(data =>{
      this.products = data as Product[];
    })
  }

  deleteProduct(id:string){
    var result = confirm("bạn có muốn xóa?");
    if(result){
      this.productService.delete(id).subscribe(data=>{
        console.log(data);
        this.router.navigate(['/product-list'])
          .then(()=>{
            window.location.reload()
          })
      })
    }
  }
}
