import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLogin: any;
  isAdmin: any;
  constructor(private user: UsersService) {
    this.isLogin = this.user.checkLogin();
    this.isAdmin = this.user.checkAdmin();
    console.log(this.isAdmin);
  }

  ngOnInit() {
  }

  onLogout() {
    localStorage.clear();
    location.assign('/');
  }
}
