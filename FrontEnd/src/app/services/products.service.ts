import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Products } from '../models/products';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  url = 'http://localhost:3000/api';
  //addToCart: Subject<any> = new Subject();
  constructor(private httpClient: HttpClient, private users: UsersService) { }

  getAll() {
    //const headers = { 'Authorization': 'Bearer ' + this.users.getAccessToken() };
    return this.httpClient.get<Products[]>(`${this.url}/products`);
  }

  get(id: number) {
    return this.httpClient.get<Products>(`${this.url}/products/${id}`);
  }

  getByPrice(price: number, lastPrice: number) {
    return this.httpClient.get<Products[]>(`${this.url}/products/filter/${price}-${lastPrice}`);
  }

  getByCategory(id: number) {
    return this.httpClient.get<Products[]>(`${this.url}/products/categoryId/${id}`);
  }

  search(name:string){
    return this.httpClient.get<Products[]>(`${this.url}/products/search/${name}`);
  }

  getHot(){
    return this.httpClient.get<Products[]>(`${this.url}/products/hot`);
  }

  delete(id: number) {
    const headers = { 'Authorization': 'Bearer ' + this.users.getAccessToken() };
    return this.httpClient.delete(`${this.url}/products/${id}`, { headers });
  }

  save(product: Products) {
    const headers = { 'Authorization': 'Bearer ' + this.users.getAccessToken() };
    return this.httpClient.post(`${this.url}/products/add`, product, { headers });
  }

  update(id: number, product: Products) {
    const headers = { 'Authorization': 'Bearer ' + this.users.getAccessToken() };
    return this.httpClient.patch(`${this.url}/products/${id}`, product, { headers });
  }




}
