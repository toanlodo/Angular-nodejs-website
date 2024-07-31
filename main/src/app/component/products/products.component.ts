import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { Category } from 'src/models/category';
import { Product } from 'src/models/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products!:Product[];
  categories!:Category[];
  dropdownOpen = false;
  sortLabel = 'Sắp xếp theo';

  private subscription!:Subscription;
  constructor(private productService: ProductService,private route: ActivatedRoute,private categoryService:CategoryService) { }

  ngOnInit() {
    this.subscription = this.route.queryParams.subscribe(params => {
      const keyword = params['keyword'];
      const categoryId = params['categoryId'];
      if (keyword) {
        this.productService.getProductByKeyword(keyword).subscribe((data: any) => {
          this.products = data as Product[];
        });
      } else if (categoryId) {
        this.productService.getProductByCategoryId(categoryId).subscribe((data:any)=>{
          this.products = data as Product[]
        })
      } else {
        this.productService.getAll().subscribe((data: any) => {
          this.products = data as Product[];
        });
      }
    });

    this.categoryService.getAllShow().subscribe(data => {
      this.categories = data as Category[];
      console.log(this.categories);
    });
  }

  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  sortHighToLow(event: Event) {
    event.preventDefault();
    this.productService.getProductsSortedByPriceDesc().subscribe((data: any) => {
      this.products = data as Product[];
      this.sortLabel = 'Giá cao - thấp';
      this.dropdownOpen = false;
    });
  }

  sortLowToHigh(event: Event) {
    event.preventDefault();
    this.productService.getProductsSortedByPriceAsc().subscribe((data: any) => {
      this.products = data as Product[];
      this.sortLabel = 'Giá thấp - cao';
      this.dropdownOpen = false;
    });
  }
}
