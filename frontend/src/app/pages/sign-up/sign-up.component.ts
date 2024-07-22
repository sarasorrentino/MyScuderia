import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {

  constructor(private supabaseService: SupabaseService) { }

  name: string;
  surname: string;
  email: string;
  password: string;
  team: string;
  loading = false;

  async submitForm() {
    try {
      this.loading = true
      localStorage.setItem('team', this.team);
      const { error } = await this.supabaseService.signUpWithEmail(this.email, this.password);
      if (error) throw error
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      alert('Check your email for the login link!')
      this.loading = false
    }
  }

}
