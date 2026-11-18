import { Routes } from '@angular/router';
import { CateogryLidtComponent } from './category/cateogry-lidt/cateogry-lidt.component';
import { ResourecesListingComponent } from './Resources/resoureces-listing/resoureces-listing.component';
import { ResourcedetailsComponent } from './Resources/resourcedetails/resourcedetails.component';
import { AddresourceComponent } from './Resources/addresource/addresource.component';
import { ProjectlistComponent } from './project/projectlist/projectlist.component';
import { ProjectLayoutComponent } from './project-layout/project-layout.component';
import { TimeperiodlistComponent } from './upsc/timeperiod/timeperiodlist/timeperiodlist.component';
import { AddtimeperiodComponent } from './upsc/timeperiod/addtimeperiod/addtimeperiod.component';
import { HealthMeasurementComponent } from './dailyhealth/health-measurement/health-measurement.component';
import { HealthdashboardComponent } from './dailyhealth/healthdashboard/healthdashboard.component';
//import { DashboardComponent } from './upsc/dashboard/dashboard.component';

export const routes: Routes = [
     {
    path: 'categories',
    component: CateogryLidtComponent
  },
  {
    path : 'resources',
    component : ResourecesListingComponent

  },
  {
    path :'resourcedetails/:id',
    component : ResourcedetailsComponent
  },
  {
    path : 'addresource',
    component : AddresourceComponent
  },
  { 
    path: 'addresource/:id', 
    component: AddresourceComponent 
  },
  {
  path: 'projects',
  component: ProjectlistComponent
},
{
    path: 'daily-health/stomach-measurement',
    component: HealthdashboardComponent
  },
{
  path: 'project/:id',
  component: ProjectLayoutComponent,
  children: [
    {
      path: 'daily-health/weightcheck',
      loadComponent: () => import('./dailyhealth/health-measurement/health-measurement.component').then(m => m.HealthMeasurementComponent)
    },
    {
      path :'daily-health/dashboard',
      loadComponent: ()=>import( './dailyhealth/healthdashboard/healthdashboard.component').then(m=>m.HealthdashboardComponent)
    }
  ]
},
{
  path : 'project/:id',
  component : ProjectLayoutComponent,
  children : [
    {
      path : 'upsc/dashboard',
      loadComponent : () =>import('./upsc/dashboard/dashboard.component').then(m=>m.DashboardComponent)
    },{
      path : 'upsc/Category',
      loadComponent : () => import('./category/cateogry-lidt/cateogry-lidt.component').then(m=>m.CateogryLidtComponent)
    },
    {
      path : 'upsc/Resources',
      loadComponent : ()=>import ('./Resources/resoureces-listing/resoureces-listing.component').then(m=>m.ResourecesListingComponent)
    },
    {
    path :'resourcedetails/:id',
    loadComponent : ()=> import ('./Resources/resourcedetails/resourcedetails.component').then(m=>m.ResourcedetailsComponent)
    },{
       path: 'addresource/:id',
       loadComponent : ()=> import ('./Resources/addresource/addresource.component').then(m=>m.AddresourceComponent)
    },{
       path : 'addresource',
       loadComponent : ()=> import ('./Resources/addresource/addresource.component').then(m=>m.AddresourceComponent)
    },{
      path : 'upsc/Timeperiods',
      loadComponent : ()=> import('./upsc/timeperiod/timeperiodlist/timeperiodlist.component').then(m=>m.TimeperiodlistComponent)
    },
    {
      path :'timeperiod/add',
      loadComponent : ()=>import('./upsc/timeperiod/addtimeperiod/addtimeperiod.component').then(m=>m.AddtimeperiodComponent)
    },
    {
      path: 'timeperiod/edit/:id',
      loadComponent : ()=> import('./upsc/timeperiod/addtimeperiod/addtimeperiod.component').then(m=>m.AddtimeperiodComponent)
    }
  ]
},
   {
    path: '',
    redirectTo: 'projects',
    pathMatch: 'full'
  }
];
