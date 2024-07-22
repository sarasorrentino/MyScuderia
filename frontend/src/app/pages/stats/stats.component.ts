import { Component, OnInit } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  yearlyData: any[] = [];
  // barChartData: ChartDataSets[] = [];
  // barChartLabels: Label[] = [];
  // barChartOptions: ChartOptions = {
  //   responsive: true,
  // };
  // barChartLegend = true;
  // barChartType: ChartType = 'bar';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    //this.fetchYearlyData();
  }

  // fetchYearlyData() {
  //   this.apiService.getYearlyData().subscribe(
  //     (data: any[]) => {
  //       this.yearlyData = data;
  //       this.processBarChartData(data);
  //     },
  //     (error) => {
  //       console.error(`Error fetching yearly data: ${error}`);
  //     }
  //   );
  // }

  processBarChartData(data: any[]) {
    // const labels: Label[] = [];
    // const values: number[] = [];

    // data.forEach((item) => {
    //   labels.push(item.year);
    //   values.push(item.value);
    // });

    // this.barChartLabels = labels;
    // this.barChartData = [{ data: values, label: 'Yearly Data' }];
  }

}
