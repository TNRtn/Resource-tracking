import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourecesService } from '../services/resoureces.service';

@Component({
  selector: 'app-resourcedetails',
  standalone: true,
  imports: [],
  templateUrl: './resourcedetails.component.html',
  styleUrl: './resourcedetails.component.css'
})
export class ResourcedetailsComponent implements OnInit {
   resource: any;
  resourceId!: number;
  isLoading = false;
  errorMessage = '';
  projectId!: number;
  referenceLinks: string[] = [];
  constructor(
     private route: ActivatedRoute,
    private router: Router,
    private resourceService: ResourecesService
  ){

  }
  ngOnInit(): void {
    this.projectId = Number(localStorage.getItem('projectId'));
    this.resourceId = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.resourceId)
    this.getResourceDetails();
  }
  getResourceDetails(){
    this.isLoading = true;
    console.log("hitting1")
    this.resourceService.getResources(this.resourceId,undefined,undefined).subscribe({
      next: (response: any) => {
        this.resource = response.data[0];
        this.referenceLinks = this.resource.referenceNoteLinks
        ? this.resource.referenceNoteLinks
            .split(',')
            .map((link: string) => link.trim())
            .filter((link: string) => link !== '')
        : [];
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Unable to load resource details.';
        this.isLoading = false;
        console.error(error);
      }
    });
  }
  goBack(){
    this.router.navigate([
  '/project',
  this.projectId,
  'upsc','Resources'
]);
  }
}
