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
import { Target } from '../../upsc/Additionalskills/model/target';

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
cumulativeScore = 0;
completingTargetId: number | null = null;
allTargets: Target[] = [];
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
// Load targets and calculate cumulative score
loadActiveTargets(): void {

  this.targetService.getTargets().subscribe({

    next: (response) => {

      if (response.isSuccess && response.data) {

        // Store all targets
        this.allTargets = response.data;

        // Calculate cumulative score from completed targets
        this.cumulativeScore = this.allTargets
          .filter(target => target.isCompleted)
          .reduce((total, target) => total + target.score, 0);

        // Display only active and incomplete targets
        this.activeTargets = this.allTargets
          .filter(target => target.isActive && !target.isCompleted)
          .map(target => ({
            id: target.id,
            name: target.name,
            targetDate: target.targetDate,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isCompleted: false,
            score: target.score
          }));

        this.updateCountdowns();

        // Start timer only once
        if (!this.countdownSubscription) {
          this.countdownSubscription = interval(1000).subscribe(() => {
            this.updateCountdowns();
          });
        }

      } else {

        this.allTargets = [];
        this.activeTargets = [];
        this.cumulativeScore = 0;

      }
    },

    error: (error) => {
      console.error('Error loading targets:', error);
      this.allTargets = [];
      this.activeTargets = [];
      this.cumulativeScore = 0;
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

completeTarget(id: number): void {

  const confirmed = confirm(
    'Are you sure you want to mark this target as completed?'
  );

  if (!confirmed) {
    return;
  }

  this.completingTargetId = id;

  this.targetService.completeTarget(id).subscribe({

    next: response => {

      this.completingTargetId = null;

      if (response.isSuccess) {

        alert(
          `Target completed successfully! Your score is ${response.data.score}.`
        );

        // Reload targets and cumulative score
        this.loadActiveTargets();

      } else {
        alert(response.message);
      }
    },

    error: error => {

      this.completingTargetId = null;

      alert(
        error.error?.message || 'Unable to complete target.'
      );
    }
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