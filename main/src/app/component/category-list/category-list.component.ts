import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../../models/category';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories!: Category[];
  constructor(private categoryService: CategoryService, private router: Router, private auth: AuthService) { }

  ngOnInit() {
    return this.categoryService.getAll().subscribe(data => {
      this.categories = data as Category[];
    }
    ,
    (error: any) => {
      console.log(error);
      if (error && error.status === 403) {
        // access token het han, lay lai new access token tu refresh token
        try {
          const refreshToken = this.auth.getRefreshToken();
          // console.log(refreshToken);
          if (!refreshToken) {
            // neu refresh token khong co thi redirect ve trang login
            this.router.navigate(['/login']);
            return;
          }
          // goi api refresh token de lay new access token
          this.auth.refreshToken({ 'refreshToken': refreshToken }).subscribe((res: any) => {
            // console.log(res);
            // cap nhat the accesstoken va refreshtoken
            let jsonData = JSON.stringify(res);
            localStorage.setItem('login',jsonData);
            // console.log(jsonData);

            // Goi lai API Lay danh sach danh muc
            this.categoryService.getAll().subscribe(data=>{
              this.categories = data as Category[]; //trong trg hop du lieu khong khop
            });
          });
        } catch (refreshError) {
          console.log('Error refreshing token:', refreshError);
          // neu refreshtoken loi thi redirect ve trang login
          this.router.navigate(['/login'])
        }
      } else {
        console.error('Error fetching data:', error);
        throw error;
      }
    });
  }

  deleteCategory(id: string) {
    var result = confirm("bạn có muốn xóa?");
    if (result) {
      this.categoryService.delete(id).subscribe(data => {
        console.log(data);
        this.router.navigate(['/category-list'])
          .then(() => {
            window.location.reload()
          })
      })
    }
  }
}
