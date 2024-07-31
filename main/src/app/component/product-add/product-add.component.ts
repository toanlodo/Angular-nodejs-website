import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { Category } from 'src/models/category';
import { Product } from 'src/models/product';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {
  productForm: FormGroup;
  product:  Product;
  categories!: Category[];

  constructor(private categoryService:CategoryService, private productService: ProductService,private router:Router) {
    this.product = new Product();
    this.productForm= new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'price': new FormControl('',Validators.required),
      'category': new FormControl(null),
      'categoryId': new FormControl(null),
      'desc': new FormControl('',Validators.required),
      'image': new FormControl('',Validators.required),
    });
  }

  ngOnInit() {
    this.categoryService.getAll().subscribe(data=>{
      console.log(this.categories);
      this.categories = data as Category[];
    })
  }

  onSubmit(){
    if(this.productForm.invalid){
      alert('Vui lòng nhập hợp lệ')
      return console.log('Không hợp lệ');
    }else{
      this.productService.save(this.product).subscribe(data =>{
        console.log(data);
        this.router.navigate(['/product-list'])
      })
    }
  }
}
