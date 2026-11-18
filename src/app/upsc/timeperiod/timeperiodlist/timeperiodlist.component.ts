import { Component, OnInit } from '@angular/core';
import { Timerperiod } from '../model/timerperiod';
import { TimeperiodService } from '../services/timeperiod.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Category } from '../../../model/category';
import { CetegoryService } from '../../../services/cetegory.service';

@Component({
  selector: 'app-timeperiodlist',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './timeperiodlist.component.html',
  styleUrl: './timeperiodlist.component.css'
})
export class TimeperiodlistComponent implements OnInit{
 timePeriods: Timerperiod[] = [];
categories: Category[] = [];
 searchName = '';
sortOrder = 'DESC';
  selectedCategoryId: number | undefined = undefined;
  isLoading = false;
  errorMessage = '';
  projectId! : number;

  constructor(private timeperiodService :TimeperiodService,
     private categoryService: CetegoryService
   ){
    
  }
  ngOnInit(): void {
    this.projectId = Number(localStorage.getItem('projectId'));
     this.loadCategories();
    this.loadTimePeriods();
  }
  loadCategories(): void {

    this.categoryService.getCategories().subscribe({
      next: (response: any) => {

        if (response.isSuccess) {
          this.categories = response.data ?? [];
        } else {
          console.error(response.message);
        }

      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

    loadTimePeriods(): void {
       this.isLoading = true;
    this.errorMessage = '';

    this.timeperiodService.getTimeperiods(undefined,this.searchName,this.selectedCategoryId,this.sortOrder).subscribe({
      next: (response) => {

        if (response.isSuccess) {
          this.timePeriods = response.data ?? [];
        } else {
          this.errorMessage = response.message;
          this.timePeriods = [];
        }

        this.isLoading = false;
      },
       error: (error) => {
        console.error('Error loading time periods:', error);

        this.errorMessage =
          error.error?.message || 'Unable to load time periods.';

        this.isLoading = false;
      }

    })
    }

     search(): void {
    this.loadTimePeriods();
  }
  clearSearch(): void {
    this.searchName = '';
    this.sortOrder = 'DESC';
    this.selectedCategoryId = undefined;
    this.loadTimePeriods();
  }
  deleteTimePeriod(id: number): void {

  const confirmDelete = confirm(
    'Are you sure you want to delete this Time Period?'
  );

  if (!confirmDelete) {
    return;
  }

  this.timeperiodService.deleteTimePeriod(id).subscribe({

    next: (response: any) => {

      if (response.isSuccess) {

        alert(response.message);

        // Reload listing after successful deletion
        this.loadTimePeriods();

      } else {
        alert(response.message);
      }
    },

    error: (error) => {

      console.error('Delete error:', error);

      alert(
        error.error?.message || 'Unable to delete Time Period.'
      );
    }

  });
}
}
