import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  session: any;

  constructor(public supabase: SupabaseService, private router: Router) { 
  }

  public ngOnInit() {
    this.supabase.getAuthState();
    this.supabase.authChanges((event, session) => (this.session = session))
  }

  public isAuthenticated(): boolean {
    if (this.session) {
      return true;
    }
    return false;
  }

  public signOut(): void {
    this.supabase.signOut().then(() => {
        this.router.navigate(['/login']);
      });
  }

}
