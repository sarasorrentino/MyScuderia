import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';

interface TeamMember {
  _id?: string;
  name: string;
  role: string;
  department: string;
}

@Component({
  selector: 'app-team-overview',
  templateUrl: './team-overview.component.html',
  styleUrls: ['./team-overview.component.scss']
})
export class TeamOverviewComponent implements OnInit {

  teamMembers: any[] = [];
  teamId = localStorage.getItem('teamId');
  newMember: TeamMember = {
    name: '',
    role: '',
    department: ''
  };


  constructor(private apiService: ApiService, private modalService: NgbModal) {}

  ngOnInit() {
    this.fetchTeamMembers();
  }

  fetchTeamMembers() {
    this.apiService.getTeamMembers(this.teamId).subscribe(
       (members: any[]) => {
         this.teamMembers = members;
       },
       (error: any) => {
         console.error('Failed to fetch team members:', error);
       }
     );
  }

  removeMember(memberId: string) {
    this.apiService.removeUserFromTeam(this.teamId, memberId).subscribe(
       () => {
         this.teamMembers = this.teamMembers.filter(
           (member) => member.id !== memberId
         );
       },
       (error: any) => {
         console.error('Failed to remove team member:', error);
       }
    );
  }

  isEngineer(role: string) {
    if(role === 'engineer'){
      return true;
    }
    return false;
  }

  openAddMemberModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-title' });
  }

  addTeamMember() {
    if (this.newMember.name && this.newMember.role && this.newMember.department) {
      this.apiService.addTeamMember(this.teamId, this.newMember._id).subscribe(
        (response: any) => {
          // Handle success, if needed
          this.fetchTeamMembers();
          this.modalService.dismissAll();
          this.clearForm();
        },
        (error: any) => {
          console.log('Error adding team member:', error);
        }
      );
    }
  }

  clearForm() {
    this.newMember = {
      name: '',
      role: '',
      department: ''
    };
  }
}
