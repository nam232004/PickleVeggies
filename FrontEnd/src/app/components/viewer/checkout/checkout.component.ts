import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillsService } from 'src/app/services/bills.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: any[] = []; 
  totalAmount: number = 0;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private billsService: BillsService
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      agree: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems() {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.cartItems = JSON.parse(cart);
      this.totalAmount = this.cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    }
  }

  submitOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const orderData = {
      id_bill: 'DH' + Math.floor(Math.random() * 1000000), 
      customer_name: this.checkoutForm.get('name')?.value,
      customer_address: this.checkoutForm.get('address')?.value,
      customer_phone: this.checkoutForm.get('phone')?.value,
      customer_email: this.checkoutForm.get('email')?.value,
      status: 'Chờ xử lý', 
      totalCartMoney: this.totalAmount,
      goods: this.cartItems,
      order_date: new Date().toISOString().split('T')[0] 
    };

    this.billsService.addBill(orderData).subscribe(
      response => {
        console.log('Order placed successfully:', response);
        alert('Đặt hàng thành công!');
        localStorage.removeItem('cart');
        this.checkoutForm.reset();
      },
      error => {
        console.error('Error placing order:', error);
        alert('Đặt hàng không thành công, vui lòng thử lại!');
      }
    );
  }
}
