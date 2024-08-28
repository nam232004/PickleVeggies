import { Component, OnInit } from '@angular/core';
import { Products } from 'src/app/models/products';
import { ProductsService } from 'src/app/services/products.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { Categories } from 'src/app/models/categories';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  products: Products[] = [];
  categories: Categories[] = [];
  categoryMap: { [key: string]: string } = {};
  filteredProducts: Products[] = [];
  currentCategoryId: any = '';
  currentPage: number = 1;
  totalPages: number[] = [];
  timePriceFilter: any[] = [];
  minPrice = 0;
  maxPrice = 500000;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private cartService: CartService,
  ) { }

  ngOnInit() {
    this.loadCatList();
    this.loadCategoriesAndProducts();
    this.setTimePriceFilter();
  }

  loadCatList() {
    this.categoriesService.getAll().subscribe(categoriesData => {
      this.categories = categoriesData as Categories[];
    });
  }

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

          this.calculateTotalPages();
          this.filterProducts();
        }
      });
    });
  }

  setTimePriceFilter() {
    this.timePriceFilter = [
      { minPrice: 0, maxPrice: 100000 },
      { minPrice: 100000, maxPrice: 200000 },
      { minPrice: 200000, maxPrice: 300000 },
      { minPrice: 300000, maxPrice: 400000 },
      { minPrice: 400000, maxPrice: 500000 },
      { minPrice: 500000, maxPrice: 9999999 }
    ];
  }

  filterProducts() {
    if (this.currentCategoryId) {
      this.filteredProducts = this.products.filter(product => product.category_id === this.currentCategoryId);
    } else {
      const startIndex = (this.currentPage - 1) * 9;
      const endIndex = this.currentPage * 9;
      this.filteredProducts = this.products.slice(startIndex, endIndex);
    }
  }

  filterProByCat(categoryId: number) {
    this.productsService.getByCategory(categoryId).subscribe(data => {
      this.filteredProducts = data as Products[];
    });
    this.currentCategoryId = categoryId;
    this.currentPage = 1;
    this.filterProducts();
  }

  filterProByPrice(minPrice: number, maxPrice: number) {
    this.productsService.getByPrice(minPrice, maxPrice).subscribe(data => {
      this.filteredProducts = data as Products[];
    });
  }

  searchProducts(searchText: string) {
    console.log('searchProducts called');
    console.log('Search input value:', searchText);
    if (searchText.trim()) { // Ensure searchText is not just whitespace
      this.productsService.search(searchText.trim()).subscribe(data => {
        this.filteredProducts = data as Products[];
      });
    } else {
      this.loadCategoriesAndProducts(); // Load all products if search input is empty
    }
  }

  calculateTotalPages() {
    const totalProducts = this.products.length;
    const totalPages = Math.ceil(totalProducts / 9);
    this.totalPages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  loadShopProducts(page: number) {
    this.currentPage = page;
    this.filterProducts();
  }

  addToCart(product: Products) {
    this.cartService.addToCart(product);
  }
}
