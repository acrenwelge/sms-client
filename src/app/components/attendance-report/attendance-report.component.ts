import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AssociateTableComponent } from '../associate-table/associate-table.component';
import { AssociateService } from '../../services/associate.service';
import { Associate } from '../../models/associate';
import { AssociateFilterService } from '../../services/associate-filter.service';
import { StatsService } from '../../services/stats.service';
import { Stats } from '../../models/stats';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.css']
})

export class AttendanceReportComponent implements OnInit {
  @ViewChild(AssociateTableComponent) assocTable: AssociateTableComponent;
  timePeriod: string = this.ds.timePeriodOpts.today; // default
  timePeriodOpts = this.ds.timePeriodOpts;
  associates: Associate[] = [];
  filteredAssociates: Associate[] = [];
  stats: Stats;
  lineChartLabels: string[] = [];

  pieChartOpts = {
    title: {
      display: true,
      text: 'Attendance'
    }
  }

  attendanceLineChartOpts = {
    title: {
      display: true,
      text: `Attendance Over Time: ${this.timePeriod}`
    },
    scales: {
        yAxes: [{
            ticks: {
                suggestedMin: 0,
                suggestedMax: 3
            }
        }]
    }
  }

  barChartOpts = {
    scales: {
      yAxes: [{
          ticks: {
              suggestedMin: 0
          }
      }]
    }
  }

  constructor(
    private associateService: AssociateService,
    private afs: AssociateFilterService,
    private ss: StatsService,
    private ds: DateService
  ) { }

  ngOnInit() {
    this.associateService.getAssociatesInStaging().subscribe(data => {
      this.associates = data;
      this.refreshReport();
    });
  }

  refreshReport(): void {
    let start = Date.now();
    this.filteredAssociates = this.afs.filterAssociates(this.associates, this.timePeriod);
    this.assocTable.associates = this.filteredAssociates;
    this.stats = this.ss.calcStatistics(this.filteredAssociates, this.timePeriod);
    this.lineChartLabels.length = 0;
    for (let i=this.stats.history.labels.length-1;i >= 0; i--) {
      this.lineChartLabels.push(this.stats.history.labels[i]);
    }
    let end = Date.now();
    this.assocTable.refresh();
    console.log(`Time to refresh report: ${end - start} ms`);
  }

  timePeriodChange($event) {
    let time: string = $event.value;
    this.timePeriod = time;
    this.attendanceLineChartOpts.title.text = `Attendance Over Time: ${this.timePeriod}`; // must assign explicitly for chart to pick up change
    this.refreshReport();
  }

}
