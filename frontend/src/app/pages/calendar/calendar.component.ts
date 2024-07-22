import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { SupabaseService } from 'src/app/services/supabase.service';

interface Event {
  title: string;
  description: string;
  location: string;
  date: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  userRole = localStorage.getItem('role');
  upcomingEvents: Event[] = [];

  newEvent: Event = {
    title: '',
    description: '',
    location: '',
    date: '',
  };

  clearForm() {
    this.newEvent = {
      title: '',
      description: '',
      location: '',
      date: '',
    };
  }

  planEvent() {
    this.apiService.createEvent(this.newEvent);
    this.clearForm();
  }

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getEvents().subscribe((data) => {
      this.upcomingEvents = data;
    });
  }

}
