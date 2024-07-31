import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/models/product';
import { CategoryService } from '../../services/category.service';
import { Category } from 'src/models/category';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  productForm: FormGroup;
  product!: Product;
  id:string;
  categories!:Category[];

  constructor(private httpClient:HttpClient,private categoryService:CategoryService,private route:ActivatedRoute,private productService: ProductService,private router:Router) {
    this.id=route.snapshot.params['id'];
    console.log(`id is ${this.id}`);

    this.productForm= new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'price': new FormControl('',Validators.required),
      'category': new FormControl(null),
      'desc': new FormControl('',Validators.required),
      'image': new FormControl('',Validators.required),
    });
   }

  ngOnInit() {
    this.productService.get(this.id).subscribe(data=>{
      this.product = data as Product;
    })
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
      this.productService.update(this.id,this.product).subscribe(data =>{
        console.log(data);
        this.router.navigate(['/product-list'])
      })
    }
  }
}
