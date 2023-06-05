import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './shared/auth/auth.component';
import { authGuard } from './services/auth.guard';
import { ScheduleComponent } from './components/schedule/schedule.component';

const routes: Routes = [
  {
    path: 'schedule',
    component: ScheduleComponent,
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./components/organisation-settings/organisation-settings.module').then(m => m.OrganisationSettingsModule),
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: '**',
    component: ScheduleComponent,
    canActivate: [authGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
