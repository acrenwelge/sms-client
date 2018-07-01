import { Component, OnInit } from '@angular/core';
import { AssociateService } from '../../services/associate.service';
import { AssociateFilterService } from '../../services/associate-filter.service';
import { Associate } from '../../models/associate';
import { StatsService } from '../../services/stats.service';
import { Stats } from '../../models/stats';

@Component({
  selector: 'app-mgr-overview',
  templateUrl: './mgr-overview.component.html',
  styleUrls: ['./mgr-overview.component.css']
})
export class MgrOverviewComponent implements OnInit {
  todayDateString: string;
  associates: Associate[];
  filteredAssociates: Associate[] = []; // init to empty array
  timePeriodOpts: {today: string, week: string, month: string, qtr: string, yr: string} = this.filterService.getTimePeriodOpts();
  timePeriod: string = this.timePeriodOpts.today; // default to today
  stats: Stats;

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
    private filterService: AssociateFilterService,
    private statsService: StatsService
  ) { }

  ngOnInit() {
    const now = new Date(); 
    this.todayDateString = `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()}`;
    this.associateService.getAssociatesInStaging().subscribe(allAssociates => {
      this.associates = allAssociates;
      this.filteredAssociates = this.filterService.filterAssociates(this.associates, this.timePeriod);
      this.stats = this.statsService.calcStatistics(this.filteredAssociates, this.timePeriod);
    });
  }

  timePeriodChange($event) {
    let time = $event.value;
    this.timePeriod = time;
    this.filteredAssociates = this.filterService.filterAssociates(this.associates,this.timePeriod);
    this.stats = this.statsService.calcStatistics(this.filteredAssociates, this.timePeriod);
  }

}
