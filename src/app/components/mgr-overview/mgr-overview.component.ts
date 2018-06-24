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
  totalAbsent: number = 0;
  totalPresent: number = 0;
  avgDaysInStaging: number = 0;
  avgDaysMkToConf: number = 0;
  avgInterviews: number = 0;
  avgRepanels: number = 0;

  constructor(private associateService: AssociateService) { }

  ngOnInit() {
    this.associateService.getAssociatesInStaging().subscribe(allAssociates => {
      this.associates = allAssociates;
      this.calcStatistics();
    });
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
      // let start: Date = new Date(assoc.stagingStartDate);
      // let end: Date = new Date(assoc.stagingEndDate) || new Date();
      // let timeDiff = Math.abs(end.getTime() - start.getTime());
      totDaysInStaging += getDayDiff(assoc.stagingStartDate, assoc.stagingEndDate);
      totDaysMkToConf += getDayDiff(assoc.marketingStartDate, assoc.confirmationDate);
      totInts += assoc.numberInterviews;
      totRepanels += assoc.repanelCount;
    }
    this.avgDaysInStaging = totDaysInStaging / totAssociates;
    this.avgDaysMkToConf = totDaysMkToConf / totAssociates;
    this.avgInterviews = totInts / totAssociates;
    this.avgRepanels = totRepanels / totAssociates;
  }

}
