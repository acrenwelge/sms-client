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

  calcStatistics(associates: Associate[], timePeriod: string): Stats {
    let dateService = { 
      now: new Date(),
      monday: new Date('6/25/2018'),
      friday: new Date('6/29/2018'),
      som: new Date('6/1/2018'),
      eom: new Date('6/30/2018'),
      soq: new Date('3/15/2018'),
      eoq: new Date('7/31/2018'),
      soy: new Date('1/1/2018'),
      eoy: new Date('12/31/2018')
    };
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
    let now = new Date(); let today = `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()}`;
    for (let i=0; i < totAssociates; i++) {
      let assoc: Associate = associates[i];
      // calculate total attendance for the given time period
      if (timePeriod == 'today') {
        if (assoc.attendance[today]) this.stats.totalPresent++;
        else this.stats.totalAbsent++;
      } else if (timePeriod == 'this week') {
        for (let dateStr in assoc.attendance) {
          let date = new Date(dateStr);
          if (date < dateService.friday && date > dateService.monday) {
            if (assoc.attendance[dateStr]) this.stats.totalPresent++;
            else this.stats.totalAbsent++;
          }
        }
      } else if (timePeriod == 'this month') {
        for (let dateStr in assoc.attendance) {
          let date = new Date(dateStr);
          if (date < dateService.eom && date > dateService.som) {
            if (assoc.attendance[dateStr]) this.stats.totalPresent++;
            else this.stats.totalAbsent++;
          }
        }
      } else if (timePeriod == 'this quarter') {
        for (let dateStr in assoc.attendance) {
          let date = new Date(dateStr);
          if (date < dateService.eoq && date > dateService.soq) {
            if (assoc.attendance[dateStr]) this.stats.totalPresent++;
            else this.stats.totalAbsent++;
          }
        }
      } else if (timePeriod == 'this year') {
        for (let dateStr in assoc.attendance) {
          let date = new Date(dateStr);
          if (date < dateService.eoy && date > dateService.soy) {
            if (assoc.attendance[dateStr]) this.stats.totalPresent++;
            else this.stats.totalAbsent++;
          }
        }
      }
      // calculate other totals
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
