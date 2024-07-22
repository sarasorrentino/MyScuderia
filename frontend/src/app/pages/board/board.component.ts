import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  pdfs: string[] = [];

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.fetchPdfs();
  }

  fetchPdfs() {
    this.apiService.getDocuments().subscribe(
      (data: any) => {
        this.pdfs = data.pdfs;
      },
      (error: any) => {
        console.error('Error fetching PDFs:', error);
      }
    );
  }

}
