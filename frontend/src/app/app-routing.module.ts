import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { TeamOverviewComponent } from './pages/team-overview/team-overview.component';
import { UserGuard } from './guards/user-auth.guard';
import { BoardComponent } from './pages/board/board.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { StatsComponent } from './pages/stats/stats.component';
import { DepartmentComponent } from './pages/department/department.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, },
  { path: 'dashboard', component: DashboardComponent, canActivate: [UserGuard]},
  { path: 'gallery', component: GalleryComponent, canActivate: [UserGuard]},
  { path: 'team-overview', component: TeamOverviewComponent, canActivate: [UserGuard]},
  { path: 'board', component: BoardComponent, canActivate: [UserGuard]},
  { path: 'sign-up', component: SignUpComponent,},
  { path: 'calendar', component: CalendarComponent, canActivate: [UserGuard]},
  { path: 'stats', component: StatsComponent, canActivate: [UserGuard]},
  { path: 'department', component: DepartmentComponent, canActivate: [UserGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
