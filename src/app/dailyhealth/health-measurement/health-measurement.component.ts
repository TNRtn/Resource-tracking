import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HealthMeasurement } from '../model/health-measurement';
import { HealthMeasurementService } from '../services/health-measurement.service';

@Component({
  selector: 'app-health-measurement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './health-measurement.component.html',
  styleUrl: './health-measurement.component.css'
})
export class HealthMeasurementComponent implements OnInit{
   measurementForm!: FormGroup;

  measurements: HealthMeasurement[] = [];

  isLoading = false;
  isSaving = false;

  successMessage = '';
  errorMessage = '';
  fromDate: string = '';
toDate: string = '';

averageMeasurement: number = 0;
measurementChange: number = 0;
periodMeasurements: HealthMeasurement[] = [];
constructor(
    private fb: FormBuilder,
    private healthService: HealthMeasurementService
  ) {}
ngOnInit(): void {
  this.initializeForm();
    this.initializeDateRange();
  this.loadMeasurements();
}
  // Initialize form
  initializeForm(): void {

    this.measurementForm = this.fb.group({
      measurementValue: [
        '',
        [
          Validators.required,
          Validators.min(0.01)
        ]
      ],

      measurementDate: [
        this.getTodayDate(),
        Validators.required
      ],

      notes: ['']
    });
  }

  // Get today's local date
  getTodayDate(): string {

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

   // Load all measurements
  loadMeasurements(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.healthService.getMeasurements().subscribe({

      next: (response) => {

        if (response.isSuccess) {

          this.measurements = response.data || [];

          this.measurements.sort((a, b) =>
            new Date(b.measurementDate).getTime() -
            new Date(a.measurementDate).getTime()
          );

        } else {

          this.errorMessage = response.message ||
            'Unable to load measurements.';
        }

        this.isLoading = false;
      },

      error: (error) => {

        console.error('Error loading measurements:', error);

        this.errorMessage =
          'Unable to load measurements. Please try again.';

        this.isLoading = false;
      }
    });
  }
 // Add new measurement
  addMeasurement(): void {

    this.successMessage = '';
    this.errorMessage = '';

    if (this.measurementForm.invalid) {

      this.measurementForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    const input = this.measurementForm.value;

    this.healthService.addMeasurement({
      measurementValue: Number(input.measurementValue),
      measurementDate: input.measurementDate,
      notes: input.notes?.trim() || undefined
    }).subscribe({

      next: (response) => {

        if (response.isSuccess) {

          this.successMessage =
            'Stomach measurement added successfully!';

          this.measurementForm.reset({
            measurementValue: '',
            measurementDate: this.getTodayDate(),
            notes: ''
          });
          this.calculateMeasurementSummary();
          this.loadMeasurements();

        } else {

          this.errorMessage =
            response.message || 'Unable to add measurement.';
        }

        this.isSaving = false;
      },

      error: (error) => {

        console.error('Error adding measurement:', error);

        this.errorMessage =
          error.error?.message ||
          'Something went wrong while adding measurement.';

        this.isSaving = false;
      }
    });
  }

  // Convenient form access
  get f() {
    return this.measurementForm.controls;
  }

  // Latest measurement
  get latestMeasurement(): HealthMeasurement | null {

    return this.measurements.length > 0
      ? this.measurements[0]
      : null;
  }

  // First recorded measurement
  get firstMeasurement(): HealthMeasurement | null {

    return this.measurements.length > 0
      ? this.measurements[this.measurements.length - 1]
      : null;
  }

  // Overall change from first to latest
  get overallChange(): number {

    if (!this.latestMeasurement || !this.firstMeasurement) {
      return 0;
    }

    return Number(
      (
        this.latestMeasurement.measurementValue -
        this.firstMeasurement.measurementValue
      ).toFixed(2)
    );
  }

  // Number of recorded measurements
  get totalMeasurements(): number {
    return this.measurements.length;
  }

  initializeDateRange(): void {

  const today = new Date();

  const previousWeek = new Date();
  previousWeek.setDate(today.getDate() - 7);

  this.fromDate = this.formatDate(previousWeek);
  this.toDate = this.formatDate(today);

}

formatDate(date: Date): string {

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
calculateMeasurementSummary(): void {

  this.periodMeasurements = this.measurements.filter(item => {

    const measurementDate = item.measurementDate.substring(0, 10);

    return measurementDate >= this.fromDate &&
           measurementDate <= this.toDate;

  });

  if (this.periodMeasurements.length === 0) {

    this.averageMeasurement = 0;
    this.measurementChange = 0;

    return;
  }

  // Calculate average
  const total = this.periodMeasurements.reduce(
    (sum, item) => sum + Number(item.measurementValue),
    0
  );

  this.averageMeasurement = Number(
    (total / this.periodMeasurements.length).toFixed(2)
  );

  // Sort measurements from oldest to newest
  const sorted = [...this.periodMeasurements].sort(
    (a, b) =>
      new Date(a.measurementDate).getTime() -
      new Date(b.measurementDate).getTime()
  );

  const first = Number(sorted[0].measurementValue);
  const last = Number(sorted[sorted.length - 1].measurementValue);

  this.measurementChange = Number((last - first).toFixed(2));

}
onDateRangeChange(): void {

  if (!this.fromDate || !this.toDate) {
    return;
  }

  if (this.fromDate > this.toDate) {
    this.averageMeasurement = 0;
    this.measurementChange = 0;
    this.periodMeasurements = [];
    return;
  }

  this.calculateMeasurementSummary();
}
}
