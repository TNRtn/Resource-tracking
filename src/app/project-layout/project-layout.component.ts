import { Component, OnInit } from '@angular/core';
import { Menu } from '../menu/model/menu';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MenuService } from '../menu/service/menu.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-project-layout',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './project-layout.component.html',
  styleUrl: './project-layout.component.css'
})
export class ProjectLayoutComponent implements OnInit{
 menus: Menu[] = [];
 projectId!: number;
  projectName: string = '';
  isSidebarOpen = false;
 constructor(
    private route: ActivatedRoute,
    private menuService: MenuService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectId = Number(
      this.route.snapshot.paramMap.get('id')
    );
    this.projectName = localStorage.getItem('projectName') || '';
    this.getMenu();
  }
  getMenu(){
    this.menuService.getMenus(this.projectId).subscribe({
       next: (response) => {
        if (response.isSuccess) {
          this.menus = response.data;
          const defaultMenu = this.menus.find(
          (menu: any) =>  menu.isDefault === true 
        );
        if(defaultMenu){
          this.navigateToMenu(defaultMenu)
        }
        }
      },
      error: (error) => {
        console.error('Error loading menus:', error);
      }
    
    })
  }
  openMenu(menu: Menu): void {
    this.router.navigateByUrl(
      `/project/${this.projectId}/${menu.urlPath}`
    );
  }
  navigateToMenu(menu: Menu): void {
    console.log(menu)
    console.log('Clicked Menu:', menu);
  console.log('URL Path:', menu.urlPath);
  const urlPath = menu.urlPath.replace(/^\/+/, '');

  this.router.navigateByUrl(
    `/project/${this.projectId}/${urlPath}`
  );
  this.isSidebarOpen =!this.isSidebarOpen;
}



toggleSidebar(): void {
  this.isSidebarOpen = !this.isSidebarOpen;
}
goToResources(){
  
  this.router.navigate(['projects']);

}
}
