import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user: any;

  constructor(private apiService: ApiService, private supabase: SupabaseService, private router: Router) { }

  ngOnInit(): void {
    this.user.role = ' team_pricipal';
    this.apiService.getUser('').subscribe((data) => {
      localStorage.setItem('user', data.user);
      this.user = data.user;
    });

  }

  public signOut(): void {
    this.supabase.signOut().then(() => {
        this.router.navigate(['/login']);
      });
  }

}
