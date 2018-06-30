import { Injectable } from '@angular/core';
import { Stats } from '../models/stats';
import { Associate } from '../models/associate';

@Injectable()
export class StatsService {
  stats: Stats;

  constructor() {
    this.stats = new Stats();
  }

  getDayDiff(first, second) {
    let start: Date = new Date(first);
    let end: Date = new Date(second) || new Date();
    let timeDiff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  calcStatistics(associates: Associate[]): Stats {
    // reset totals
    this.stats.totalAbsent = 0;
    this.stats.totalPresent = 0;
    this.stats.totalConfirmed = 0;
    // local variables
    let totDaysInStaging = 0;
    let totDaysMkToConf = 0;
    let totDaysMkToProjStart = 0;
    let totInts = 0;
    let totRepanels = 0;
    let totAssociates = associates.length;
    for (let i=0; i < totAssociates; i++) {
      let assoc: Associate = associates[i];
      if (assoc.absent) {this.stats.totalAbsent++;} else {this.stats.totalPresent++;}
      if (assoc.confirmationDate) {this.stats.totalConfirmed++;}
      totDaysInStaging += this.getDayDiff(assoc.stagingStartDate, assoc.stagingEndDate);
      totDaysMkToConf += this.getDayDiff(assoc.marketingStartDate, assoc.confirmationDate);
      totDaysMkToProjStart += this.getDayDiff(assoc.marketingStartDate, assoc.projectStartDate);;
      totInts += assoc.numberInterviews;
      totRepanels += assoc.repanelCount;
    }
    this.stats.avgDaysInStaging = +(totDaysInStaging / totAssociates).toFixed(2);
    this.stats.avgDaysMkToConf = +(totDaysMkToConf / totAssociates).toFixed(2);
    this.stats.avgDaysMkToProjStart = +(totDaysMkToProjStart / totAssociates).toFixed(2);
    this.stats.avgInterviews = +(totInts / totAssociates).toFixed(2);
    this.stats.avgRepanels = +(totRepanels / totAssociates).toFixed(2);
    return this.stats;
  }

}
