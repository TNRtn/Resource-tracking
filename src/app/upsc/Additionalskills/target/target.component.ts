import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Target, TargetInput } from '../model/target';
import { TargetService } from '../service/target.service';

@Component({
  selector: 'app-target',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './target.component.html',
  styleUrl: './target.component.css'
})
export class TargetComponent implements OnInit {
 targetForm!: FormGroup;

  targets: Target[] = [];

  isLoading = false;
  isSaving = false;
  showAddForm = false;

  selectedFilter: string = 'all';

  successMessage = '';
  errorMessage = '';
  constructor(
    private fb: FormBuilder,
    private targetService: TargetService
  ){}

  ngOnInit(): void {
     this.initializeForm();
    this.loadTargets();
  }

   initializeForm(): void {

    this.targetForm = this.fb.group(
      {
        name: ['', [
          Validators.required,
          Validators.maxLength(100)
        ]],

        startDate: ['', Validators.required],

        targetDate: ['', Validators.required],

        isActive: [true]
      },
      {
        validators: this.dateRangeValidator
      }
    );
  }

   // Validate target date
  dateRangeValidator(control: AbstractControl): ValidationErrors | null {

    const startDate = control.get('startDate')?.value;
    const targetDate = control.get('targetDate')?.value;

    if (startDate && targetDate && targetDate < startDate) {
      return { invalidDateRange: true };
    }

    return null;
  }

   // Load targets
  loadTargets(): void {

    this.isLoading = true;
    this.errorMessage = '';

    let isActive: boolean | undefined;

    if (this.selectedFilter === 'active') {
      isActive = true;
    }
    else if (this.selectedFilter === 'inactive') {
      isActive = false;
    }

    this.targetService.getTargets(isActive).subscribe({

      next: (response) => {

        if (response.isSuccess) {
          this.targets = response.data || [];
        }
        else {
          this.targets = [];
          this.errorMessage = response.message;
        }

        this.isLoading = false;
      },

      error: (error) => {

        this.targets = [];
        this.errorMessage =
          error.error?.message || 'Unable to retrieve targets.';

        this.isLoading = false;
      }
    });
  }

   // Add target
  addTarget(): void {

    this.successMessage = '';
    this.errorMessage = '';

    if (this.targetForm.invalid) {
      this.targetForm.markAllAsTouched();
      return;
    }

    const input: TargetInput = this.targetForm.value;

    this.isSaving = true;

    this.targetService.addTarget(input).subscribe({

      next: (response) => {

        if (response.isSuccess) {

          this.successMessage =
            response.message || 'Target added successfully.';

          this.targetForm.reset({
            name: '',
            startDate: '',
            targetDate: '',
            isActive: true
          });

          this.showAddForm = false;
          this.selectedFilter = 'all';

          this.loadTargets();
        }
        else {
          this.errorMessage =
            response.message || 'Unable to add target.';
        }

        this.isSaving = false;
      },

      error: (error) => {

        this.errorMessage =
          error.error?.message || 'Error occurred while adding target.';

        this.isSaving = false;
      }
    });
  }

   // Show add form
  openAddForm(): void {

    this.successMessage = '';
    this.errorMessage = '';

    this.targetForm.reset({
      name: '',
      startDate: '',
      targetDate: '',
      isActive: true
    });

    this.showAddForm = true;
  }

   // Cancel add form
  cancelAdd(): void {

    this.showAddForm = false;
    this.targetForm.reset({
      name: '',
      startDate: '',
      targetDate: '',
      isActive: true
    });
  }

   // Change filter
  onFilterChange(): void {
    this.loadTargets();
  }

  get f() {
    return this.targetForm.controls;
  }

  getDuration(startDate: string, targetDate: string): string {

  const start = new Date(startDate + 'T00:00:00');
  const end = new Date(targetDate + 'T00:00:00');

  const difference = end.getTime() - start.getTime();

  const days = Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;

  return `${days} days`;
}
}
