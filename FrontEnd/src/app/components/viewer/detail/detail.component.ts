import { Component, OnInit } from '@angular/core';
import { Products } from 'src/app/models/products';
import { ProductsService } from 'src/app/services/products.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { Categories } from 'src/app/models/categories';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  product!: Products;
  productFeater: Products[] = [];;
  categoryMap: { [key: string]: string } = {};
  categories: Categories[] = [];
  currentCategoryId: any = '';
  id!:number;
  category_name!:string;
  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private route: ActivatedRoute
  ) { 
    this.id = route.snapshot.params['id'];
  }

  ngOnInit() {
    this.loadCategoriesAndProducts();
    this.loadFeaturedProducts();
  }

  loadCategoriesAndProducts() {
    this.categoriesService.getAll().subscribe(categories => {
      if (Array.isArray(categories)) {
        this.categoryMap = categories.reduce((acc: any, cat: any) => {
          acc[cat.id] = cat.name;
          return acc;
        }, {});
      }

      this.productsService.get(this.id).subscribe(data => {
        this.product = data as Products;
        this.category_name = this.categoryMap[this.product.category_id]
      });
    });
  }

  //load features products
  loadFeaturedProducts() {
    this.productsService.getByCategory(this.id).subscribe(data => {
      this.productFeater = data as Products[];
    });
  }

}
