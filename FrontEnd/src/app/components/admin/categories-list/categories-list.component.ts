import { Component, OnInit } from '@angular/core';
import { Categories } from 'src/app/models/categories';
import { CategoriesService } from 'src/app/services/categories.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {
  categories!: Categories[];
  categoryForm: FormGroup;
  category: Categories;
  id: number | null = null;
  imageUrl: string | ArrayBuffer | null = '';
  fileToUpload: File | null = null;

  constructor(
    private httpClient: HttpClient,
    private categoriesService: CategoriesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.category = new Categories();

    this.categoryForm = new FormGroup({
      'id': new FormControl(null),
      'name': new FormControl('', [Validators.required, Validators.minLength(6)]),
      'status': new FormControl('', [Validators.required]),
      'img': new FormControl('')
    });
  }

  ngOnInit() {
    this.loadCategories();

    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.categoriesService.get(this.id).subscribe(data => {
          this.category = data as Categories;
          this.categoryForm.patchValue(this.category);
        });
      }
    });
  }

  loadCategories() {
    this.categoriesService.getAll().subscribe(data => {
      this.categories = data as Categories[];
    });
  }

  addCat() {
    if (this.categoryForm.invalid) {
      alert('Please enter valid data');
      return;
    }

    this.categoriesService.save(this.categoryForm.value).subscribe(data => {
      console.log(data);
      alert(`Đã thêm danh mục ${this.categoryForm.value.name}`);
      this.loadCategories();
      this.categoryForm.reset();
    });
  }

  editCat() {
    if (this.categoryForm.invalid) {
      alert('Please enter valid data');
      return;
    }
    this.categoriesService.update(this.categoryForm.value.id, this.categoryForm.value).subscribe(data => {
      console.log(data);
      alert(`Đã cập nhật danh mục ${this.categoryForm.value.name}`);
      this.loadCategories();
      this.router.navigate(['/categories-list']);
    });
  }

  deleteCat(id: number) {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này không?')) {
      this.categoriesService.delete(id).subscribe(() => {
        alert('Đã xóa danh mục');
        this.loadCategories();
      });
    }
  }

  openEditModal(category: Categories) {
    console.log(category.id);
    this.categoryForm.patchValue(category);
    ($('#editCategoryModal') as any).modal('show');
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      console.log(input.files[0].name);
      
      this.fileToUpload = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(this.fileToUpload);
      
    }
  }


}
