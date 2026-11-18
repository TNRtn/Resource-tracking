import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Category } from '../../model/category';
import { CetegoryService } from '../../services/cetegory.service';
import { ResourecesService } from '../services/resoureces.service';

@Component({
  selector: 'app-add-resource',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './addresource.component.html'
})
export class AddresourceComponent implements OnInit {

  resourceForm!: FormGroup;
  categories: Category[] = [];

  resourceId: number | null = null;
  isEditMode = false;
  isSubmitting = false;
  projectId!: number;

  constructor(
    private fb: FormBuilder,
    private resourceService: ResourecesService,
    private categoryService: CetegoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectId = Number(localStorage.getItem('projectId'));
    this.initializeForm();
    this.getCategories();

    const id = this.route.snapshot.paramMap.get('id');

    if (id !== null) {
      this.resourceId = Number(id);
      this.isEditMode = true;
      this.getResourceDetails(this.resourceId);
    }
  }

  initializeForm(): void {
    this.resourceForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      categoryId: [null, Validators.required],
      referenceKeys: [''],
      referenceNoteLinks: [''],
      keyPoints: [''],
      revisionCount : [0 , [
    Validators.required,
    Validators.min(0),
    Validators.max(5),
    Validators.pattern(/^\d+$/)
  ]]
    });
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.categories = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  getResourceDetails(id: number): void {
    this.resourceService.getResources(id,undefined,undefined,undefined).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          const resource = response.data[0];

          this.resourceForm.patchValue({
            name: resource.name,
            description: resource.description,
            categoryId: resource.categoryId,
            referenceKeys: resource.referenceKeys,
            referenceNoteLinks: resource.referenceNoteLinks,
            keyPoints: resource.keyPoints,
            revisionCount : resource.revisionCount
          });
        }
      },
      error: (error) => {
        console.error('Error loading resource:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.resourceForm.invalid) {
      this.resourceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const form = this.resourceForm.value;

    if (this.isEditMode && this.resourceId !== null) {

      // Update existing resource
      this.resourceService.addResource(
        form.name,
        form.description,
        form.categoryId,
        form.referenceKeys,
        form.referenceNoteLinks,
        form.keyPoints,
        form.revisionCount,
        this.resourceId
      ).subscribe({
        next: (response) => {
          this.isSubmitting = false;

          if (response.isSuccess) {
            alert('Resource updated successfully.');
             this.router.navigate([
                '/project',
                this.projectId,
                'upsc','Resources'
              ]);
          } else {
            alert(response.message);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error updating resource:', error);
          alert('Error updating resource.');
        }
      });

    } else {

      // Add new resource
      this.resourceService.addResource(
        form.name,
        form.description,
        form.categoryId,
        form.referenceKeys,
        form.referenceNoteLinks,
        form.keyPoints
      ).subscribe({
        next: (response) => {
          this.isSubmitting = false;

          if (response.isSuccess) {
            alert('Resource added successfully.');
             this.router.navigate([
            '/project',
            this.projectId,
              'upsc','Resources'
            ]);
          } else {
            alert(response.message);
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error adding resource:', error);
          alert('Error adding resource.');
        }
      });
    }
  }
  goBack(){
    this.router.navigate([
  '/project',
  this.projectId,
  'upsc','Resources'
]);
  }
}