import { Component } from '@angular/core';
import { ChartOptions } from "../../../config/chart-options";

@Component({
  selector: 'app-page-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent {
  public chartOptions = ChartOptions.getChartOptions();

  public barChartData: { data: number[], label: string }[] = [
    { data: [65, 67, 70, 75, 80, 90], label: 'PHP' },
    { data: [50, 48, 47, 49, 44, 40], label: '.Net' },
    { data: [40, 30, 28, 25, 22, 20], label: 'Java' },
  ];
  public barChartLabels: string[] = ['2015', '2016', '2017', '2018', '2019', '2020'];

  public lineChartData: { data: number[], label: string }[] = [
    { data: [61, 59, 80, 65, 45, 55, 40, 56, 76, 65, 77, 60], label: 'Apple' },
    { data: [57, 50, 75, 87, 43, 46, 37, 48, 67, 56, 70, 50], label: 'Mi' }
  ];
  public lineChartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  public pieChartData: { data: number[] }[] = [{ data: [50, 30, 20] }];
  public pieChartLabels: string[] = ['PHP', '.Net', 'Java'];

  public radarChartData: { data: number[], label: string }[] = [
    { data: [61, 59, 80, 65, 45, 55, 40, 56, 76, 65, 77, 60], label: 'Apple' }
  ];
  public radarChartLabels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  public doughnutChartData: { data: number[] }[] = this.pieChartData;
  public doughnutChartLabels: string[] = this.pieChartLabels;
}
