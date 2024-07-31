import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from 'src/models/category';
@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.css']
})
export class CategoryAddComponent implements OnInit {
  categoryForm: FormGroup;
  category:  Category;

  constructor(private categoryService: CategoryService,private router:Router) {
    this.category = new Category();
    this.categoryForm= new FormGroup({
      'name': new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnInit() {
  }

  onSubmit(){
    if(this.categoryForm.invalid){
      alert('Vui lòng nhập hợp lệ')
      return console.log('Không hợp lệ');
    }else{
      this.categoryService.save(this.category).subscribe(data =>{
        console.log(data);
        this.router.navigate(['/category-list'])
      })
    }
  }
}
