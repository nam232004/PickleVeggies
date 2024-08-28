import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Categories } from '../models/categories';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  url = 'http://localhost:3000/api';
  constructor(private httpClient: HttpClient, private users:UsersService) { }

  getAll() {
    return this.httpClient.get(`${this.url}/categories`);
  }

  get(id: number) {
    return this.httpClient.get(`${this.url}/categories/${id}`);
  }

  delete(id: number) {
    const headers = { 'Authorization': 'Bearer ' + this.users.getAccessToken() };
    return this.httpClient.delete(`${this.url}/categories/${id}`, {headers});
  }

  save(category: Categories) {
    const headers = { 'Authorization': 'Bearer ' + this.users.getAccessToken() };
    return this.httpClient.post(`${this.url}/categories/add`, category, {headers});
  }

  update(id: number, category: Categories) {
    const headers = { 'Authorization': 'Bearer ' + this.users.getAccessToken() };
    return this.httpClient.patch(`${this.url}/categories/${id}`, category ,{headers});
  }

}
