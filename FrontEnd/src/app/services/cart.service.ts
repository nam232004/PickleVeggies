import { Injectable } from '@angular/core';
import { Products } from 'src/app/models/products';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  quantuty:number = 0;
  constructor() { }

  addToCart(product: Products) {
    let cart: Products[] = [];
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        cart = JSON.parse(storedCart);
        if (!Array.isArray(cart)) {
          cart = [];
        }
      }
    } catch (error) {
      console.error('Error parsing cart from localStorage', error);
      cart = [];
    }

    let found = false;
    for (let item of cart) {
      if (item.id === product.id) {
        item.quantity = (item.quantity || 0) + 1; 
        found = true;
        break;
      }
    }

    if (!found) {
      cart.push({ ...product, quantity: 1 }); 
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Đã thêm "${product.name}" vào giỏ hàng thành công!`);
  }



}
