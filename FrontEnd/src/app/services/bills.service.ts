import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class BillsService {
  url = 'http://localhost:3000/api';

  constructor(private httpClient: HttpClient) {

  }
  addBill(bill: any) {
    return this.httpClient.post(`${this.url}/bills/add`, bill);
  }

}
