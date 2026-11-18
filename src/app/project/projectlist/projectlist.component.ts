import { Component, OnInit } from '@angular/core';
import { Project } from '../model/project';
import { ProjectserviceService } from '../services/projectservice.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MissingMeasurementDate } from '../../dailyhealth/model/health-measurement';
import { HealthMeasurementService } from '../../dailyhealth/services/health-measurement.service';

@Component({
  selector: 'app-projectlist',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './projectlist.component.html',
  styleUrl: './projectlist.component.css'
})
export class ProjectlistComponent implements OnInit{
   projects: Project[] = [];
  isLoading = false;
  missingMeasurementDates: MissingMeasurementDate[] = [];
missingMeasurementCount = 0;
showMissingMeasurementPopup = false;

  // Set this from your actual tracking start date.
  trackingStartDate = '';
  constructor (private projectService :ProjectserviceService,
    private router :Router,
     private healthService: HealthMeasurementService
  ){}
ngOnInit(): void {
  this.getProjects();
   this.loadMissingMeasurementDates();
}
getProjects(){
  this.isLoading = true;

  this.projectService.getprojects().subscribe({
    next : (response)=>{
      if (response.isSuccess) {
          this.projects = response.data;
        }

        this.isLoading = false;
    },
     error: (error) => {
        console.error('Error loading projects:', error);
        this.isLoading = false;
      }
  })
}
 getProjectImage(id: number): string {
    return `src/assets/images/projects/project-${id}.jpg`;
   // "C:\Resource tracking frontend\ResourceTracking\src\assets\images\projects\project-1.png"
  }
  openProject(project: any): void {
  localStorage.setItem('projectId', project.id.toString());
  localStorage.setItem('projectName', project.name);
  this.router.navigate(['/project', project.id]);
}

loadMissingMeasurementDates(): void {

    // Use the actual tracking start date.
    // Do not hardcode it in the component.
      const startDate = this.getTodayDate();
    //const startDate = this.trackingStartDate;

    if (!startDate) {
      return;
    }
    console.log("hitting")
    this.healthService.getMissingMeasurementDates(
      startDate,
      null
    ).subscribe({
      next: (response) => {

        if (response.isSuccess) {

          this.missingMeasurementDates = response.data || [];

          this.missingMeasurementCount =
            this.missingMeasurementDates.length;
            this.showMissingMeasurementPopup =
          this.missingMeasurementCount > 0;


        }
      },
      error: (error) => {
        console.error(
          'Error loading missing measurement dates:',
          error
        );
      }
    });
  }
getMissingDates(): string[] {
    return this.missingMeasurementDates.map(item =>
      new Date(item.missingDate).toLocaleDateString('en-IN')
    );
  }

  closeMissingMeasurementPopup(): void {
  this.showMissingMeasurementPopup = false;
}
getTodayDate(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
}
