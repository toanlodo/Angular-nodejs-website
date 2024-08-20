import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = 'http://localhost:8000/v1';
  constructor(private httpClient: HttpClient) { }

  getAll(){
    return this.httpClient.get(`${this.url}/product`)
  }

  get(id:string){
    return this.httpClient.get(`${this.url}/product/${id}`)
  }
  
  getProductByCategoryId(categoryId: string) {
    return this.httpClient.get(`${this.url}/product/categoryId/${categoryId}`);
  }

  getProductByKeyword(keyword: string) {
    console.log(`${this.url}/product/keyword/${keyword}`);
    return this.httpClient.get(`${this.url}/product/keyword/${keyword}`);
  }


  delete(id:string){
    return this.httpClient.delete(`${this.url}/product/${id}`)
  }
  save(product: Product){
    return this.httpClient.post(`${this.url}/product`, product);
  }

  update(id: String ,product: Product){
    return this.httpClient.put(`${this.url}/product/${id}`, product);
  }

  getProductsSortedByPriceAsc() {
    return this.httpClient.get(`${this.url}/product/sort/asc`);
  }

  getProductsSortedByPriceDesc() {
    return this.httpClient.get(`${this.url}/product/sort/desc`);
  }
}
