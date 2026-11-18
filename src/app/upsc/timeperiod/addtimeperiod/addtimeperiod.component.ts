import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeperiodService } from '../services/timeperiod.service';
import { CetegoryService } from '../../../services/cetegory.service';

@Component({
  selector: 'app-addtimeperiod',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './addtimeperiod.component.html',
  styleUrl: './addtimeperiod.component.css'
})
export class AddtimeperiodComponent implements OnInit{
  timePeriodId = 0;
  isEditMode = false;

  categories: any[] = [];
  projectId! : number;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private timeperiodService: TimeperiodService,
    private categoryService: CetegoryService
  ) {}

   timePeriodForm = this.fb.group({
    name: ['', Validators.required],
    periodDate: ['', Validators.required],
    description: [''],
    categoryId: [0, Validators.min(1)],
    keyNotes: [''],
    keyReferenceLinks: ['']
  });

  ngOnInit(): void {
    this.projectId = Number(localStorage.getItem('projectId'));
    this.loadCategories();
     const id = this.route.snapshot.paramMap.get('id');

    if (id !== null) {
      this.timePeriodId = Number(id);
      this.isEditMode = true;
      this.getTimePeriodById(this.timePeriodId);
    }
  }

  loadCategories(): void {

    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        if (response.isSuccess) {
          this.categories = response.data ?? [];
        }
      },
      error: (error) => console.error(error)
    });
  }

  getTimePeriodById(id : number): void {
    console.log(this.timePeriodId)
    this.timeperiodService.getTimeperiods(id,undefined,undefined,undefined).subscribe({
      next: (response: any) => {

        if (response.isSuccess && response.data?.length > 0) {

          const item = response.data[0];

          this.timePeriodForm.patchValue({
            name: item.name,
            periodDate: item.periodDate?.substring(0, 10),
            description: item.description,
            categoryId: item.categoryId,
            keyNotes: item.keyNotes,
            keyReferenceLinks: item.keyReferenceLinks
          });
        }
      },
      error: (error) => console.error(error)
    });
  }

saveTimePeriod(): void {

    if (this.timePeriodForm.invalid) {
      this.timePeriodForm.markAllAsTouched();
      return;
    }

    const form = this.timePeriodForm.getRawValue();

    this.timeperiodService.saveTimePeriod(
      this.timePeriodId,
      form.name!,
      form.periodDate!,
      form.description || '',
      Number(form.categoryId),
      form.keyNotes || '',
      form.keyReferenceLinks || ''
    ).subscribe({

      next: (response: any) => {

        if (response.isSuccess) {
          alert(response.message);
          this.router.navigate([
                '/project',
                this.projectId,
                'upsc','Timeperiods'
              ]);
        } else {
          alert(response.message);
        }
      },

      error: (error) => {
        console.error(error);
        alert(error.error?.message || 'Error saving TimePeriod.');
      }
    });
  }

  goBack(): void {
    console.log("hitting")
    this.router.navigate([
  '/project',
  this.projectId,
  'upsc','Timeperiods'
]);
  }

}
