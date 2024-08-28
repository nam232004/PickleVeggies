import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Categories } from 'src/app/models/categories';
import { Products } from 'src/app/models/products';
import { HttpClient } from '@angular/common/http';
import { ProductsService } from 'src/app/services/products.service';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  products!: Products[];
  categories!: Categories[];
  productForm: FormGroup;
  product: Products;
  id: number | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('previewImg') previewImg!: ElementRef<HTMLImageElement>;

  constructor(
    private httpClient: HttpClient,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private renderer: Renderer2,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.product = new Products();

    this.productForm = new FormGroup({
      'id': new FormControl(null),
      'name': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'img': new FormControl(''),
      'price': new FormControl('', [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      'category_id': new FormControl('', [Validators.required]),
      'description': new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  ngOnInit() {
    this.loadCategoriesAndProducts();
  }

  loadCategoriesAndProducts() {
    this.categoriesService.getAll().subscribe(categoriesData => {
      this.categories = categoriesData as Categories[];
      this.productsService.getAll().subscribe(productsData => {
        this.products = productsData as Products[];
        this.proIdToCatName();
      });
    });
  }

  proIdToCatName() {
    this.products.forEach(product => {
      const category = this.categories.find(cat => cat.id === product.category_id);
      if (category) {
        product.category_id = category.name;
      }
    });
  }

  addPro() {
    if (this.productForm.invalid) {
      alert('Vui lòng điền đúng định dạng!');
      return;
    }
    this.productsService.save(this.productForm.value).subscribe(data => {
      console.log(data);
      alert(`Đã thêm sản phẩm ${this.productForm.value.name}`);
      this.loadCategoriesAndProducts();
      this.productForm.reset();
    });
  }

  editPro() {
    if (this.productForm.invalid) {
      alert('Vui lòng điền đúng định dạng!');
      return;
    }
    this.productsService.update(this.productForm.value.id, this.productForm.value).subscribe(data => {
      console.log(data);
      alert(`Đã sửa sản phẩm ${this.productForm.value.name}`);
      this.loadCategoriesAndProducts();
      this.productForm.reset();
    });
  }

  deletePro(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      this.productsService.delete(id).subscribe(() => {
        alert('Đã xóa sản phẩm');
        this.loadCategoriesAndProducts();
      });
    }
  }

  openEditModal(product: Products) {
    console.log(product.id);
    this.productForm.patchValue(product);
    ($('#editProductModal') as any).modal('show');
  }

  changeImg(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.productForm.patchValue({
        img: file.name
      });

      const reader = new FileReader();
      reader.onload = () => {
        this.renderer.setProperty(this.previewImg.nativeElement, 'src', reader.result);
      };
      reader.readAsDataURL(file);
    }
  }
  openFileInput() {
    this.fileInput.nativeElement.click();
  }
}
