import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './core/components/header/header.component';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { MagicLinkComponent } from './pages/magic-link/magic-link.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { ClassicLoginComponent } from './pages/classic-login/classic-login.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { TeamOverviewComponent } from './pages/team-overview/team-overview.component';
import { DepartmentComponent } from './pages/department/department.component';
import { BoardComponent } from './pages/board/board.component';
import { StatsComponent } from './pages/stats/stats.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { CalendarComponent } from './pages/calendar/calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignUpComponent,
    MagicLinkComponent,
    DashboardComponent,
    ClassicLoginComponent,
    GalleryComponent,
    TeamOverviewComponent,
    DepartmentComponent,
    BoardComponent,
    StatsComponent,
    CalendarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    PdfViewerModule,
    HttpClientModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
