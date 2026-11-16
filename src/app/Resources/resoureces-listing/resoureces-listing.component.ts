import { Component, OnInit } from '@angular/core';
import { Resources } from '../model/resources';
import { ResourecesService } from '../services/resoureces.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CetegoryService } from '../../services/cetegory.service';
import { Category } from '../../model/category';

@Component({
  selector: 'app-resoureces-listing',
  standalone: true,
  imports: [  CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './resoureces-listing.component.html',
  styleUrl: './resoureces-listing.component.css'
})
export class ResourecesListingComponent implements OnInit {
  constructor(private resourceService : ResourecesService,
    private categoryService : CetegoryService
  ){

  }
resources: Resources[] = [];
  categories: Category[] = [];
isLoading = false;
errorMessage = '';
successMessage = '';
searchText: string = '';
selectedCategoryId : number =0;
selectedRevisionCount: number | null = null;
id=0;
projectId!:number;
revisionCounts: number[] = [0, 1, 2, 3, 4, 5];
ngOnInit(): void {
  this.projectId = Number(localStorage.getItem('projectId'));
  this.getCategories();
  this.getResources();
}

getResources(){
  this.isLoading= true;
  this.errorMessage ='';
  this.resourceService.getResources().subscribe({
    next: (response) => {

      if (response.isSuccess) {
        this.resources = response.data ?? [];
      } else {
        this.resources = [];
        this.errorMessage = response.message;
      }

      this.isLoading = false;
    },
     error: (error) => {

      console.error('Resource API error:', error);

      this.resources = [];

      this.errorMessage =
        error.error?.message ||
        'Unable to load resources.';

     this.isLoading = false;
     }
  });
}

searchResources(){
  
    this.isLoading = true;
    this.errorMessage = '';
    this.resourceService.getResources(undefined,this.searchText.trim(),this.selectedCategoryId || undefined, this.selectedRevisionCount || undefined).subscribe({
      next :(response)=>{
        
        if (response.isSuccess) {

          this.resources = response.data ?? [];

        } else {

          this.resources = [];
          this.errorMessage = response.message;
        }

        this.isLoading = false;
      },
      error: (error) => {

        console.error('Search Resource error:', error);

        this.resources = [];

        this.errorMessage =
          error.error?.message ||
          'Unable to search Resources.';

        this.isLoading = false;
      }
    })
}

getCategories(){
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

 clearSearch(): void {
    this.searchText = '';
    this.selectedCategoryId = 0;
    this.selectedRevisionCount = null;
    this.getResources();
  }

  deleteResource(id:number){
    if (!confirm('Are you sure you want to delete this Resource?')) {
    return;
  }

  this.errorMessage = '';
  this.successMessage = '';

  this.resourceService.deleteResource(id).subscribe({

    next: (response) => {

      if (response.isSuccess) {
        this.successMessage =
          response.message || 'Resource deleted successfully.';

        this.getResources();
      } else {
        this.errorMessage = response.message;
      }
    },

    error: (error) => {

      console.error('Resource category error:', error);

      this.errorMessage =
        error.error?.error ||
        error.error?.message ||
        'Unable to delete Resource.';
    }
  });
  }
}
