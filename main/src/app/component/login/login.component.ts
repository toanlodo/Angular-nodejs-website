import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})



export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  user:User;
  constructor(private authService: AuthService) {
    this.user = new User();
    this.loginForm = new FormGroup({
      name: new FormControl('', [Validators.required,Validators.minLength(6)]),
      password: new FormControl('',[
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  ngOnInit() {
  }

  onLogin():void{
    if(this.loginForm.invalid){
      alert('Vui lòng nhập hợp lệ');
      return console.log('không hợp lệ');
    }

    this.authService.login(this.loginForm.value).subscribe(
      (res:any)=>{
        console.log(res);
        alert('Đăng nhập thành công');
        let jsonData= JSON.stringify(res);
        localStorage.setItem('login',jsonData);
        location.assign('/');
      },
      (error:any)=>{
        console.error(error);
        console.log('sai tên đăng nhập hoặc mật khẩu');
        alert('Sai tên đăng nhập hoặc mật khẩu')
      }
    );
  }

}
