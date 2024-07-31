import { Component } from '@angular/core';
import { NavigationEnd, Router, Event } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'asm';
  adminRender = true;
  private excludedPaths: string[] = ['/admin-layout', '/category-list', '/category-add', '/category-edit', '/product-list', '/product-add', '/product-edit'];

  constructor(private router: Router){
    this.router.events.pipe(
      filter((event : Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event : NavigationEnd)=>{
      this.adminRender = !this.excludedPaths.some(path => event.url.includes(path));
    })
  }
}
