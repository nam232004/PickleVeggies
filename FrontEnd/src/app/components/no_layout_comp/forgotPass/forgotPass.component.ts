import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgotPass',
  templateUrl: './forgotPass.component.html',
  styleUrls: ['./forgotPass.component.css']
})
export class ForgotPassComponent implements OnInit {
  userForm: FormGroup;

  constructor(private usersService: UsersService) {
    this.userForm = new FormGroup({
      'email': new FormControl('', [Validators.email, Validators.required]),
    });
  }

  ngOnInit() {}

  onForgotPass() {
    if (this.userForm.valid) {
      const email = this.userForm.value.email;
      this.usersService.forgotPassword({ forgot_email: email }).subscribe(
        response => {
          alert('Đã gửi email thành công, vui lòng check mail của bạn!');
          console.log('Đã gửi email thành công:', response.message);
        },
        error => {
          if (error.status === 404) {
            alert('Email không tồn tại');
          } else {
            console.error('Lỗi khi gửi yêu cầu:', error);
          }
        }
      );
    } else {
      alert('Form không hợp lệ');
    }
  }
}
