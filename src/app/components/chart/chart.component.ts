import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  constructor() { }
  ngOnInit() {}

  @Input() type: string; // line, bar, radar, pie, polarArea, doughnut
  @Input() legend: boolean;
  @Input() data: Array<number[]> | number[];
  @Input() datasets: Array<{data: Array<number[]> | number[], label: string}>;
  @Input() labels: string[]; // necessary for line, bar, and radar charts
  @Input() options: any;

  // public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  // public barChartType:string = 'bar';
  // public barChartLegend:boolean = true;
 
  // public barChartData:any[] = [
  //   {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
  //   {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  // ];
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

}
