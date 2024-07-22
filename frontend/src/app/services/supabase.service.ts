import { Injectable } from '@angular/core'
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'

import { environment } from 'src/environments/environment'

export interface Profile {
  id?: string
  username: string
  password: string
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;
  state: string

  constructor() {
    const options = {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      },
    }
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, options)
  }

  public getUser(){
    return this.supabase.auth.getUser();
  }

  public getSession() {
    return this.supabase.auth.getSession();
  }

  public authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void): any {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  getAuthState(){
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.state = event
      console.log(this.state);
    })
  }

  public getProfile(user: User) {
    return this.supabase
        .from('profiles')
        .select(`username, password`)
        .eq('id', user.id)
        .single()
  }

  public signInWithMagicLink(email: string): Promise<any> {
    return this.supabase.auth.signInWithOtp({email: email});
  }

  public signOut() {
    return this.supabase.auth.signOut();
  }

  public updateProfile(profile: Profile): any {
    const update = {
      password: profile.password,
      updated_at: new Date(),
    }

    return this.supabase.from('profiles').upsert(update);
  }

  //-----------------------------------------------------------------------
  signInWithEmail(email: string, pwd: string){
    return this.supabase.auth.signInWithPassword({
      email: email,
      password: pwd,
    })
  }

  signUpWithEmail(email: string, pwd: string){
    return this.supabase.auth.signUp({
      email: email,
      password: pwd,
    })
  }

  requestResetPassword(email: string){
    return this.supabase.auth.resetPasswordForEmail(email, {redirectTo: "http://localhost:4200/updatePassword"})
  }

  updatePassword(pwd: string){
    return this.supabase.auth.updateUser({
      password: pwd,
    });
  }
}