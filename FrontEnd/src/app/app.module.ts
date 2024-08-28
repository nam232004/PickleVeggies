import { NgModule, Pipe } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { VndCurrencyPipe } from './vnd-currency.pipe';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

import { ViewerComponent } from './components/viewer/viewer.component';
import { No_layout_compComponent } from './components/no_layout_comp/no_layout_comp.component';
import { AdminComponent } from './components/admin/admin.component';

import { HomeComponent } from './components/viewer/home/home.component';
import { CategoriesListComponent } from './components/admin/categories-list/categories-list.component';
import { ProductsListComponent } from './components/admin/products-list/products-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShopComponent } from './components/viewer/shop/shop.component';
import { LoginComponent } from './components/no_layout_comp/login/login.component';
import { DetailComponent } from './components/viewer/detail/detail.component';
import { AuthGuard } from './components/admin/auth/auth-guard';
import { AdminGuard } from './components/admin/auth/admin-guard';
import { CartComponent } from './components/viewer/cart/cart.component';
import { CartService } from './services/cart.service';
import { ForgotPassComponent } from './components/no_layout_comp/forgotPass/forgotPass.component';
import { ChangePassComponent } from './components/no_layout_comp/changePass/changePass.component';
import { CheckoutComponent } from './components/viewer/checkout/checkout.component';
const routes: Routes = [
  {
    path: '', component: ViewerComponent, children: [
      { path: 'home', component: HomeComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'cart', component: CartComponent },
      { path: 'forgotPass', component: ForgotPassComponent },
      { path: 'detail/:id', component: DetailComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: '', redirectTo: '/home', pathMatch: 'full' },
    ],
  }, {
    path: 'admin', component: AdminComponent, canActivate: [AdminGuard], children: [
      { path: 'categories-list', component: CategoriesListComponent },
      { path: 'products-list', component: ProductsListComponent },
      { path: '', redirectTo: '/products-list', pathMatch: 'full' },
    ]
  }, {
    path: 'account', component: No_layout_compComponent, children: [
      { path: 'login', component: LoginComponent },
      { path: 'forgotPass', component: ForgotPassComponent },
      { path: 'changePass/:token', component: ChangePassComponent },
      { path: '', redirectTo: '/login', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ShopComponent,
    CheckoutComponent,
    CartComponent,
    DetailComponent,
    CategoriesListComponent,
    ProductsListComponent,
    LoginComponent,
    AdminComponent,
    ViewerComponent,
    VndCurrencyPipe,
    ForgotPassComponent,
    ChangePassComponent,
    No_layout_compComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [CartService],
  bootstrap: [AppComponent]
})
export class AppModule { }
