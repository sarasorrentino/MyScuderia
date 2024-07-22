import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit{

  images: string[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    //this.fetchImages();
  }

  // fetchImages() {
  //   this.apiService.getImages().subscribe(
  //     (data: any) => {
  //       this.images = data.images;
  //     },
  //     (error: any) => {
  //       console.error('Error fetching images:', error);
  //     }
  //   );
  // }

}
