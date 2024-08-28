import { Component, OnInit } from '@angular/core';
import { Products } from 'src/app/models/products';
import { ProductsService } from 'src/app/services/products.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { Categories } from 'src/app/models/categories';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: Products[] = [];
  filteredProducts: Products[] = [];
  categoryMap: { [key: string]: string } = {};
  categories: Categories[] = [];
  currentCategoryId: any = '';
  bestSellerProductsSquare: Products[] = [];
  bestSellerProductsCircle: Products[] = [];

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCatList();
    this.loadCategoriesAndProducts();
    this.loadBestsellerPro();
  }

  //category filler choose
  loadCatList() {
    this.categoriesService.getAll().subscribe(categoriesData => {
      this.categories = categoriesData as Categories[];
    });
  }
  //for click button category filter
  onCategorySelect(categoryId: number) {
    this.currentCategoryId = categoryId;
    this.filterProducts();
  }

  //load main content
  loadCategoriesAndProducts() {
    this.categoriesService.getAll().subscribe(categories => {
      if (Array.isArray(categories)) {
        this.categoryMap = categories.reduce((acc: any, cat: any) => {
          acc[cat.id] = cat.name;
          return acc;
        }, {});
      }

      this.productsService.getAll().subscribe(products => {
        if (Array.isArray(products)) {
          this.products = products.map(pro => ({
            ...pro,
            category_name: this.categoryMap[pro.category_id]
          }));
          this.filterProducts();
        }
      });
    });
  }

  //filter main content by category
  filterProducts() {
    if (this.currentCategoryId) {
      this.filteredProducts = this.products.filter(product => product.category_id === this.currentCategoryId);
    } else {
      this.filteredProducts = this.products.slice(0, 8);
    }
  }

  //get best seller products
  loadBestsellerPro() {
    this.productsService.getAll().subscribe(products => {
      this.bestSellerProductsSquare = products.slice(0, 4);
      this.bestSellerProductsCircle = products.slice(4, 10);
    });
  }

  //load shop detail
  loadDetail(id: number) {
    this.router.navigate(['detail/', id]);
  }

  //add to cart
  addToCart(product: Products) {
    this.cartService.addToCart(product); 
  }
}
