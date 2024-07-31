import { ProductAddComponent } from './component/product-add/product-add.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { HomeComponent } from './component/home/home.component';
import { RouterModule, Routes } from '@angular/router'; // khai báo dùng cho routes
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { CategoryListComponent } from './component/category-list/category-list.component';
import { CategoryAddComponent } from './component/category-add/category-add.component';
import { CategoryEditComponent } from './component/category-edit/category-edit.component';
import { ProductListComponent } from './component/product-list/product-list.component';
import { ProductEditComponent } from './component/product-edit/product-edit.component';
import { AdminLayoutComponent } from './component/admin-layout/admin-layout.component';
import { ProductDetailComponent } from './component/product-detail/product-detail.component';
import { AuthGuard } from './auth/auth-guard';
import { MyAccountComponent } from './component/my-account/my-account.component';
import { AdminGuard } from './auth/admin-guard';
import { ProductsComponent } from './component/products/products.component';

// Định nghĩa các roures trong dự án
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'category-list', component: CategoryListComponent, canActivate:[AdminGuard] },
  { path: 'category-add', component: CategoryAddComponent, canActivate:[AdminGuard] },
  { path: 'category-edit/:id', component: CategoryEditComponent, canActivate:[AdminGuard] },
  { path: 'product-list', component: ProductListComponent, canActivate:[AdminGuard] },
  { path: 'product-add', component: ProductAddComponent, canActivate:[AdminGuard] },
  { path: 'product-edit/:id', component: ProductEditComponent, canActivate:[AdminGuard] },
  { path: 'admin-layout', component: AdminLayoutComponent, canActivate:[AdminGuard] },
  { path: 'product-detail/:id', component: ProductDetailComponent},
  { path: 'products', component: ProductsComponent },
  { path: 'my-account', component: MyAccountComponent, canActivate:[AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
      HeaderComponent,
      FooterComponent,
      HomeComponent,
      LoginComponent,
      CategoryListComponent,
      CategoryAddComponent,
      CategoryEditComponent,
      ProductListComponent,
      ProductAddComponent,
      ProductEditComponent,
      AdminLayoutComponent,
      ProductDetailComponent,
      RegisterComponent,
      MyAccountComponent,
      ProductsComponent,


   ],
  imports: [

    BrowserModule,
    /*
    FormsModule được sử dụng cho các biểu mẫu
    ví dụ: khi sử dụng binding 2 chiều ([(ngModel)] = "product.productName") trong form > input (component.html) thì xuất hiện lỗi "Can't bind to 'ngModel'..."
    */
    FormsModule,
    ReactiveFormsModule,
    /*
    Angular thường được sử dụng để phát triển ứng dụng đơn trang (SPA),
    và RouterModule được sử dụng để thiết lập định tuyến trong ứng dụng của bạn.
    Phương thức forRoot để nạp các thông tin của Routes.
    */
    RouterModule.forRoot(routes),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
