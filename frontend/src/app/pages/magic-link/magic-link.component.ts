import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-magic-link',
  templateUrl: './magic-link.component.html',
  styleUrls: ['./magic-link.component.scss']
})
export class MagicLinkComponent {

  loading: boolean;
  email: string;

  constructor(private supabase: SupabaseService) { }

  async onSubmit() {
    try {
      this.loading = true
      const { error } = await this.supabase.signInWithMagicLink(this.email)
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    } finally {
      this.email = ''
      this.loading = false
    }
  }

}
