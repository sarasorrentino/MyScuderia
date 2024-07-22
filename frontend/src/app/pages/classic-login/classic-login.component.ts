import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-classic-login',
  templateUrl: './classic-login.component.html',
  styleUrls: ['./classic-login.component.scss']
})
export class ClassicLoginComponent implements OnInit {

  loading = false;
  forgotPwd = false;
  session: any;
  password: string;
  email: string;

  constructor(
    private router: Router,
    private readonly supabase: SupabaseService,
  ) { }

  ngOnInit(): void {
    this.supabase.authChanges((event, session) => (this.session = session));
    this.isLogged();
  }

  isLogged() {
    if (this.session) {
      this.router.navigate(['/dashboard']);
    }
  }

  async onSubmit(): Promise<void> {
    try {
      this.loading = true
      const { error } = await this.supabase.signInWithEmail(this.email, this.password);
      if (error) throw error
      else await this.router.navigate(['/dashboard']);

    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
        await this.router.navigate(['/login']);
      }
    } finally {
      this.email = '';
      this.password = '';
      this.loading = false
    }
  }

}
