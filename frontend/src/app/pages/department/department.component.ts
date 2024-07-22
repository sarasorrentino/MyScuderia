import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

interface Department {
  name: string;
  description: string;
}

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {

  departments: Department[] =[];
  newDepartment: Department = {
    name: '',
    description: ''
  };
  selectedDepartment: Department | null = null;
  teamId = localStorage.getItem('teamId');

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.fetchDepartments();
  }

  fetchDepartments() {
    this.apiService.getDepartments(this.teamId).subscribe(
      (departments: Department[]) => {
        this.departments = departments;
      },
      (error: any) => {
        console.log('Error fetching departments:', error);
      }
    );
  }

  openDepartmentDetails(department: Department) {
    this.selectedDepartment = department;
  }

  closeDepartmentDetails() {
    this.selectedDepartment = null;
  }

  createDepartment() {
    if (this.newDepartment.name && this.newDepartment.description) {
      this.apiService.createDepartment(this.newDepartment).subscribe(
        (response: any) => {
          // Handle success, if needed
          this.fetchDepartments();
          this.clearForm();
        },
        (error: any) => {
          console.log('Error creating department:', error);
        }
      );
    }
  }

  deleteDepartment(department: string) {
    this.apiService.deleteDepartment(department).subscribe(
      (response: any) => {
        // Handle success, if needed
        this.fetchDepartments();
        this.closeDepartmentDetails();
      },
      (error: any) => {
        console.log('Error deleting department:', error);
      }
    );
  }

  clearForm() {
    this.newDepartment = {
      name: '',
      description: ''
    };
  }

}
