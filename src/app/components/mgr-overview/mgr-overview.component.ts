import { Component, OnInit } from '@angular/core';
import { AssociateService } from '../../services/associate.service';
import { Associate } from '../../models/associate';

@Component({
  selector: 'app-mgr-overview',
  templateUrl: './mgr-overview.component.html',
  styleUrls: ['./mgr-overview.component.css']
})
export class MgrOverviewComponent implements OnInit {
  associates: Associate[];
  timePeriod: string = 'today';
  status: string;
  totalAbsent: number = 0;
  totalPresent: number = 0;
  avgDaysInStaging: number = 0;
  avgDaysMkToConf: number = 0;
  avgDaysMkToProjStart: number = 0;
  avgInterviews: number = 0;
  avgRepanels: number = 0;

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

  constructor(private associateService: AssociateService) { }

  ngOnInit() {
    this.associateService.getAssociatesInStaging().subscribe(allAssociates => {
      this.associates = allAssociates;
      this.calcStatistics();
    });
  }

  timePeriodChange($event) {
    let time = $event.value;
    this.timePeriod = time;
    switch (time) {
      case 'today': console.log('today');
    }
  }

  calcStatistics() {
    function getDayDiff(first, second) {
      let start: Date = new Date(first);
      let end: Date = new Date(second) || new Date();
      let timeDiff = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }
    let totDaysInStaging = 0;
    let totDaysMkToConf = 0;
    let totInts = 0;
    let totRepanels = 0;
    let totAssociates = this.associates.length;
    for (let i=0; i < totAssociates; i++) {
      let assoc: Associate = this.associates[i];
      if (assoc.absent) {this.totalAbsent++;} else {this.totalPresent++;}
      totDaysInStaging += getDayDiff(assoc.stagingStartDate, assoc.stagingEndDate);
      totDaysMkToConf += getDayDiff(assoc.marketingStartDate, assoc.confirmationDate);
      totInts += assoc.numberInterviews;
      totRepanels += assoc.repanelCount;
    }
    this.avgDaysInStaging = +(totDaysInStaging / totAssociates).toFixed(2);
    this.avgDaysMkToConf = +(totDaysMkToConf / totAssociates).toFixed();
    this.avgInterviews = +(totInts / totAssociates).toFixed();
    this.avgRepanels = +(totRepanels / totAssociates).toFixed();
  }

}
