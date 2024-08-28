import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-changePass',
  templateUrl: './changePass.component.html',
  styleUrls: ['./changePass.component.css']
})
export class ChangePassComponent implements OnInit {

  changePassForm: FormGroup;
  token: string | null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UsersService
  ) {
    this.changePassForm = new FormGroup({
      'newPassword': new FormControl('', [Validators.minLength(6), Validators.pattern(/\d/), Validators.required]),
      'confirmPassword': new FormControl('', [Validators.minLength(6), Validators.pattern(/\d/), Validators.required])
    });
    this.token = this.route.snapshot.paramMap.get('token');
  }

  ngOnInit(): void { }

  onChangePass() {
    if (this.changePassForm.valid) {
      const newPassword = this.changePassForm.value.newPassword;
      const confirmPassword = this.changePassForm.value.confirmPassword;

      if (newPassword !== confirmPassword) {
        console.error('Mật khẩu không khớp');
        return;
      }

      if (this.token) {
        this.usersService.changePassword(this.token, newPassword).subscribe(() => {});
        alert('Đổi mật khẩu thành công:');
        this.router.navigate(['/account/login']);
      } else {
        console.error('Token không tồn tại');
      }
    } else {
      console.error('Form không hợp lệ');
    }
  }

}
