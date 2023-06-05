import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router'; // Import Routes and RouterModule
import { OrganisationSettingsComponent } from './organisation-settings.component';

// Define your routes
const routes: Routes = [
  { path: '', component: OrganisationSettingsComponent },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class OrganisationSettingsModule { }
