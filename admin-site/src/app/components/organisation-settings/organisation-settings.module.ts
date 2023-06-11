import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router'; // Import Routes and RouterModule
import { OpperatingSettingsComponent } from './opperating-settings/opperating-settings.component';
import { AngularMaterialsModule } from 'src/app/angular-materials/angular-materials.module';
import { ServicesSettingsComponent } from './services-settings/services-settings.component';
// Define your routes
const routes: Routes = [
  { path: 'opperating', component: OpperatingSettingsComponent },
  { path: 'services', component: ServicesSettingsComponent },
];


@NgModule({
  declarations: [
    OpperatingSettingsComponent,
    ServicesSettingsComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialsModule,
    RouterModule.forChild(routes)
  ]
})
export class OrganisationSettingsModule { }
