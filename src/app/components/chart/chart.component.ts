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

  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

}
