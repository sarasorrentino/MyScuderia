import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements  OnInit{
  
  authMethod:boolean = false;
  email: string;
  password: string;
  loading: boolean;
  session: any;


  constructor(private supabase: SupabaseService, private router: Router) { }

  public ngOnInit() {
    this.supabase.getAuthState();
    this.supabase.authChanges((event, session) => (this.session = session))
    if(this.session){
      this.router.navigate(['/dashboard']);
    }
  }

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

  changeauthMethod(){
    this.authMethod = !this.authMethod;
  }

  buttonText(){
    if(!this.authMethod){
      return "Usa la tua email e password per accedere";
    }else{
      return "Usa magic link per accedere";
    }
  }
}
