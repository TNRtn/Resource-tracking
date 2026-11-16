import { Component, OnInit } from '@angular/core';
import { Project } from '../model/project';
import { ProjectserviceService } from '../services/projectservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projectlist',
  standalone: true,
  imports: [],
  templateUrl: './projectlist.component.html',
  styleUrl: './projectlist.component.css'
})
export class ProjectlistComponent implements OnInit{
   projects: Project[] = [];
  isLoading = false;
  constructor (private projectService :ProjectserviceService,
    private router :Router
  ){}
ngOnInit(): void {
  this.getProjects();
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
}
