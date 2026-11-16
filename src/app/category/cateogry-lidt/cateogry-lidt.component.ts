
import { Component, OnInit } from '@angular/core';
import { Category } from '../../model/category';
import { CetegoryService } from '../../services/cetegory.service';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cateogry-lidt',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './cateogry-lidt.component.html',
  styleUrl: './cateogry-lidt.component.css'
})
export class CateogryLidtComponent implements OnInit {

  categories: Category[] = [];

  isLoading = false;
  isSaving = false;

  errorMessage = '';
  successMessage = '';

  showAddForm = false;
  isEditMode = false;

  searchText: string = '';

  selectedCategoryId: number | null = null;

  categoryForm = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.maxLength(255)
    ]]
  });

  constructor(
    private categoryService: CetegoryService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getCategories();
  }

  // Get all categories
  getCategories(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.categoryService.getCategories().subscribe({

      next: (response) => {

        if (response.isSuccess) {
          this.categories = response.data ?? [];
        } else {
          this.categories = [];
          this.errorMessage = response.message;
        }

        this.isLoading = false;
      },

      error: (error) => {

        console.error('Category API error:', error);

        this.errorMessage =
          error.error?.message ||
          'Unable to load categories.';

        this.isLoading = false;
      }
    });
  }

  // Open Add Category Form
  openAddForm(): void {

    this.showAddForm = true;
    this.isEditMode = false;
    this.selectedCategoryId = null;

    this.successMessage = '';
    this.errorMessage = '';

    this.categoryForm.reset();
  }

  // Cancel Add/Edit Form
  cancelAdd(): void {

    this.showAddForm = false;
    this.isEditMode = false;
    this.selectedCategoryId = null;

    this.categoryForm.reset();

    this.errorMessage = '';
  }

  // Add or Update Category
  saveCategory(): void {

    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const name = this.categoryForm.value.name?.trim() ?? '';

    if (!name) {
      this.categoryForm.controls.name.setErrors({ required: true });
      return;
    }
    console.log(name,this.categoryForm)
    this.isSaving = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Update Category
    if (this.isEditMode && this.selectedCategoryId !== null) {

      this.categoryService.updateCategory(
        this.selectedCategoryId,
        name
      ).subscribe({

        next: (response) => {

          if (response.isSuccess) {

            this.successMessage =
              response.message || 'Category updated successfully.';

            this.closeForm();
            this.getCategories();

          } else {

            this.errorMessage =
              response.message || 'Unable to update category.';
          }

          this.isSaving = false;
        },

        error: (error) => {

          console.error('Update category error:', error);

          this.errorMessage =
            error.error?.error ||
            error.error?.message ||
            'Something went wrong while updating category.';

          this.isSaving = false;
        }
      });

    } else {

      // Add Category
      this.categoryService.addCategories(name).subscribe({

        next: (response) => {

          if (response.isSuccess) {

            this.successMessage =
              response.message || 'Category added successfully.';

            this.closeForm();
            this.getCategories();

          } else {

            this.errorMessage =
              response.message || 'Unable to add category.';
          }

          this.isSaving = false;
        },

        error: (error) => {

          console.error('Add category error:', error);

          this.errorMessage =
            error.error?.error ||
            error.error?.message ||
            'Something went wrong while adding category.';

          this.isSaving = false;
        }
      });
    }
  }

  // Open Edit Category Form
  editCategory(category: Category): void {

    this.isEditMode = true;
    this.showAddForm = true;

    this.selectedCategoryId = category.id;

    this.successMessage = '';
    this.errorMessage = '';
    console.log(category)
    this.categoryForm.patchValue({
      name: category.name
    });
  }

  // Search Categories
  searchCategories(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.categoryService.getCategories(
      undefined,
      this.searchText.trim()
    ).subscribe({

      next: (response) => {

        if (response.isSuccess) {

          this.categories = response.data ?? [];

        } else {

          this.categories = [];
          this.errorMessage = response.message;
        }

        this.isLoading = false;
      },

      error: (error) => {

        console.error('Search category error:', error);

        this.categories = [];

        this.errorMessage =
          error.error?.message ||
          'Unable to search categories.';

        this.isLoading = false;
      }
    });
  }

  // Close and Reset Form
  private closeForm(): void {

    this.showAddForm = false;
    this.isEditMode = false;
    this.selectedCategoryId = null;

    this.categoryForm.reset();
  }


  deleteCategory(id: number): void {

  if (!confirm('Are you sure you want to delete this category?')) {
    return;
  }

  this.errorMessage = '';
  this.successMessage = '';

  this.categoryService.deleteCategory(id).subscribe({

    next: (response) => {

      if (response.isSuccess) {
        this.successMessage =
          response.message || 'Category deleted successfully.';

        this.getCategories();
      } else {
        this.errorMessage = response.message;
      }
    },

    error: (error) => {

      console.error('Delete category error:', error);

      this.errorMessage =
        error.error?.error ||
        error.error?.message ||
        'Unable to delete category.';
    }
  });
}
}
