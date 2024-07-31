import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLogin:any;
  isADM:any;
  keyword!: string;
  constructor(private auth: AuthService, private router:Router) {
    this.isLogin = this.auth.checkLogin();
    this.isADM= this.auth.checkADM();
  }
  ngOnInit() {

  }

  onLogout(){
    localStorage.clear();
    location.assign('/');
  }

  onSearch(){
    this.router.navigate(
      ['/products'],
      { queryParams: { keyword: this.keyword}}
    )
  }
}
