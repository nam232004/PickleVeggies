import { Component, OnInit } from '@angular/core';
import { Products } from 'src/app/models/products';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart!: any;
  
  constructor(private router: Router) { }

  ngOnInit() {
    this.cart = this.showCart();
  }

  showCart(): Products[] {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      console.log(cart);
      return cart;
    } catch (error) {
      console.error('Error parsing cart from localStorage', error);
      return [];
    }
  }

  changeQuantity(index: number, increment: number) {
    switch (increment) {
      case 0: this.cart[index].quantity--;
        break;
      case 1: this.cart[index].quantity++;
        break;
    }

    if (this.cart[index].quantity! < 1) {
      this.cart[index].quantity = 1;
    }

    this.updateCart();
  }

  removeItem(index: number) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      this.cart.splice(index, 1);
      alert("Xóa thành công!");
      this.updateCart();
    }
  }

  updateCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  getPrice(){
    let total = 0;
    for (let i = 0; i < this.cart.length; i++) {
      total += this.cart[i].price * this.cart[i].quantity;
    }
    return total;
  }
  getTotalCartMoney(){
    let totalCartMoney = this.getPrice() * 105/100;
    totalCartMoney = Math.ceil(totalCartMoney / 1000) * 1000;
    return totalCartMoney ;
  }
  
  loadCheckOut() {
    this.router.navigate(['/checkout']);
  }

}
