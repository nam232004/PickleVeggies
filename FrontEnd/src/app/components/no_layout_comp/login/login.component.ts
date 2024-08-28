import { Component, OnInit, Renderer2 } from '@angular/core';
import { Users } from 'src/app/models/users';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user!: Users;
  onRegisterForm: FormGroup;
  onLoginForm: FormGroup;

  constructor(
    private renderer: Renderer2,
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.user = new Users();

    this.onRegisterForm = new FormGroup({
      'id': new FormControl(null),
      'name': new FormControl('', [Validators.minLength(6), Validators.maxLength(20), Validators.required]),
      'email': new FormControl('', [Validators.email, Validators.required]),
      'password': new FormControl('', [Validators.minLength(6), Validators.pattern(/\d/), Validators.required]),
      'repass': new FormControl('', [Validators.required])
    });
    this.onRegisterForm.setValidators(this.rePassMatch());

    this.onLoginForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', [Validators.minLength(6), Validators.pattern(/\d/), Validators.required]),
    });
  }

  ngOnInit() {
    this.changACtion();
  }

  changACtion() {
    const container = this.renderer.selectRootElement('#container', true);
    const registerBtn = this.renderer.selectRootElement('#register', true);
    const loginBtn = this.renderer.selectRootElement('#login', true);

    if (registerBtn && loginBtn) {
      registerBtn.addEventListener('click', () => {
        this.renderer.addClass(container, 'active');
      });

      loginBtn.addEventListener('click', () => {
        this.renderer.removeClass(container, 'active');
      });
    }
  }

  onRegister() {
    const loginBtn = this.renderer.selectRootElement('#login', true);
    if (this.onRegisterForm.invalid) {
      alert('Vui lòng điền đúng định dạng!');
      return;
    }
    this.usersService.register(this.onRegisterForm.value).subscribe(data => {
      this.user = data as Users;
      alert('Đăng ký thành công!');
      loginBtn.click();
    },
      (error: any) => {
        if (error.status === 400 && error.error.message === 'Email đã tồn tại') {
          this.onRegisterForm.controls['email'].setErrors({ emailExists: true });
        } else {
          console.error(error);
          alert('Đăng ký thất bại!');
        }
      });

  }

  rePassMatch(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password')?.value;
      const repass = formGroup.get('repass')?.value;

      if (password !== repass) {
        return { mismatch: true };
      } else {
        return null;
      }
    };
  }

  onLogin() {
    if (this.onLoginForm.invalid) {
      alert('Vui lòng điền đúng định dạng!');
      return;
    }
    this.usersService.login(this.onLoginForm.value).subscribe(
      (data: Users) => {
        this.user = data;
        let dataJson = JSON.stringify(data);
        localStorage.setItem('user_login', dataJson);
        alert('Chào mừng ' + JSON.parse(dataJson).user.name);
        location.assign('/');
      },
      (error: any) => {
        if (error.status === 400) {
          this.onLoginForm.setErrors({ invalidCredentials: true });
        } else {
          console.error(error);
          alert('Đăng nhập thất bại!');
        }
      }
    );
  }
}
