import { Component, OnInit } from '@angular/core';
import { DashbaordService } from './service/dashbaord.service';
import { DashboardResult } from './model/dashboard-result';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
   dashboardData: DashboardResult[] = [];
totalCategories = 0;
  totalResources = 0;

  loading = false;
  errorMessage = '';
  revisionSummary = [
  { label: '0 Revisions', count: 0 },
  { label: '1 Revision', count: 0 },
  { label: '2 Revisions', count: 0 },
  { label: '3 Revisions', count: 0 },
  { label: '4 Revisions', count: 0 },
  { label: '5 Revisions', count: 0 }
];

  constructor(
    private dashboardService: DashbaordService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }
  loadDashboard(): void {

    this.loading = true;
    this.errorMessage = '';

    this.dashboardService.getDashboard().subscribe({

      next: (response: any) => {

        if (response.isSuccess) {

          this.dashboardData = response.data || [];

          if (this.dashboardData.length > 0) {

            this.totalCategories =
              this.dashboardData[0].totalCategories;

            this.totalResources =
              this.dashboardData[0].totalResources;

            if (this.dashboardData.length > 0) {

              const data = this.dashboardData[0];

              this.totalCategories = data.totalCategories;
              this.totalResources = data.totalResources;

              this.revisionSummary = [
                { label: '0 Revisions', count: data.revision0Count },
                { label: '1 Revision', count: data.revision1Count },
                { label: '2 Revisions', count: data.revision2Count },
                { label: '3 Revisions', count: data.revision3Count },
                { label: '4 Revisions', count: data.revision4Count },
                { label: '5 Revisions', count: data.revision5Count }
              ];
            }
          }
        }
        else {
          this.errorMessage = response.message;
        }

        this.loading = false;
      },

      error: (error) => {

        console.error('Dashboard error:', error);

        this.errorMessage =
          error.error?.message || 'Unable to load dashboard data.';

        this.loading = false;
      }

    });
  }

  getResourcePercentage(count: number): number {

    if (this.totalResources === 0) {
      return 0;
    }

    return Math.round((count / this.totalResources) * 100);
  }
}
