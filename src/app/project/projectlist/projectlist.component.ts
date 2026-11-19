import { Component, OnDestroy, OnInit } from '@angular/core';
import { Project } from '../model/project';
import { ProjectserviceService } from '../services/projectservice.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MissingMeasurementDate } from '../../dailyhealth/model/health-measurement';
import { HealthMeasurementService } from '../../dailyhealth/services/health-measurement.service';
import { TargetService } from '../../upsc/Additionalskills/service/target.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-projectlist',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './projectlist.component.html',
  styleUrl: './projectlist.component.css'
})
export class ProjectlistComponent implements OnInit,OnDestroy{
  
   projects: Project[] = [];
  isLoading = false;
  missingMeasurementDates: MissingMeasurementDate[] = [];
missingMeasurementCount = 0;
showMissingMeasurementPopup = false;

  // Set this from your actual tracking start date.
  trackingStartDate = '';

  activeTargets: TargetCountdown[] = [];

private countdownSubscription?: Subscription;
  constructor (private projectService :ProjectserviceService,
    private router :Router,
     private healthService: HealthMeasurementService,
      private targetService: TargetService
  ){}
ngOnInit(): void {
  this.getProjects();
   this.loadMissingMeasurementDates();
    this.loadActiveTargets();
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

// Load active targets
loadActiveTargets(): void {

  this.targetService.getTargets(true).subscribe({

    next: (response) => {

      if (response.isSuccess && response.data) {

        this.activeTargets = response.data.map(target => ({
          id: target.id,
          name: target.name,
          targetDate: target.targetDate,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isCompleted: false
        }));

        this.updateCountdowns();

        // Start timer only once
        if (!this.countdownSubscription) {
          this.countdownSubscription = interval(1000).subscribe(() => {
            this.updateCountdowns();
          });
        }

      } else {
        this.activeTargets = [];
      }
    },

    error: (error) => {
      console.error('Error loading active targets:', error);
      this.activeTargets = [];
    }

  });
}
// Update each target countdown
updateCountdowns(): void {

  const now = new Date().getTime();

  this.activeTargets.forEach(target => {

    // SQL DATE is converted into local date.
    // Countdown ends at 11:59:59 PM on TargetDate.
    const [year, month, day] = target.targetDate.substring(0, 10)
      .split('-')
      .map(Number);

    const deadline = new Date(
      year,
      month - 1,
      day,
      23,
      59,
      59
    ).getTime();

    const difference = deadline - now;

    if (difference <= 0) {

      target.days = 0;
      target.hours = 0;
      target.minutes = 0;
      target.seconds = 0;
      target.isCompleted = true;

      return;
    }

    target.isCompleted = false;

    const totalSeconds = Math.floor(difference / 1000);

    target.days = Math.floor(totalSeconds / (24 * 60 * 60));

    target.hours = Math.floor(
      (totalSeconds % (24 * 60 * 60)) / 3600
    );

    target.minutes = Math.floor(
      (totalSeconds % 3600) / 60
    );

    target.seconds = totalSeconds % 60;

  });
}
ngOnDestroy(): void {
  this.countdownSubscription?.unsubscribe();
}

}
interface TargetCountdown {
  id: number;
  name: string;
  targetDate: string;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}