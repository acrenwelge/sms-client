import { Injectable } from '@angular/core';
import { Associate } from '../models/associate';

@Injectable()
export class AssociateFilterService {

  constructor() { }

  getMonday(d: Date) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  getFriday(d: Date) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() + (5 - day);
    return new Date(d.setDate(diff));
  }

  getMonthStart(d: Date) {
    d = new Date(d);
    return new Date(d.setDate(1));
  }

  getMonthEnd(d: Date) {
    d = new Date(d);
    return new Date(d.getFullYear(),d.getMonth()+1,0);
  }

  timePeriodOpts: {today: string, week: string, month: string, qtr: string, yr: string} = {
    today: 'today',
    week: 'this week',
    month: 'this month',
    qtr: 'this quarter',
    yr: 'this year'
  };

  getTimePeriodOpts() {
    return this.timePeriodOpts;
  };

  /** Filters associates based on the time period being inspected - today, this week, this month, this quarter, or this year.
   *   - today: start date was before today AND end date is after today
   *   - this week: start date was before last day of the week OR end date is after first day of the week
   *   - this month: start date was before last day of the month OR end date is after first day of the month
   *   - this month: start date was before last day of the quarter OR end date is after first day of the quarter
   *   - this year: start date was before last day of the year OR end date is after first day of the year
   */
  filterAssociates(associates: Associate[],timePeriod: string): Associate[] {
    let now = new Date();
    let monday = this.getMonday(now);
    let friday = this.getFriday(now);
    let som = this.getMonthStart(now); // set to start of month
    let eom = this.getMonthEnd(now); // set to end of month
    let soq = this.getMonthStart(now); // set to start of month
    let eoq = this.getMonthEnd(now); // set to end of month
    let soy = new Date(now.getFullYear(),0,1); // set to Jan 1 - start of year
    let eoy = new Date(now.getFullYear(),11,31); // set to Dec 31 - end of year
    if (timePeriod == this.timePeriodOpts.today) { 
      return associates.filter((assoc) => {
        return new Date(assoc.stagingStartDate) < now && new Date(assoc.stagingEndDate) > now;
      });
    } else if (timePeriod == this.timePeriodOpts.week) {
      return associates.filter((assoc) => {
        return new Date(assoc.stagingStartDate) < friday && new Date(assoc.stagingEndDate) > monday;
      });
    } else if (timePeriod == this.timePeriodOpts.month) {
      return associates.filter((assoc) => {
        return new Date(assoc.stagingStartDate) < eom && new Date(assoc.stagingEndDate) > som;
      });
    } else if (timePeriod == this.timePeriodOpts.qtr) {
      return associates.filter((assoc) => {
        return new Date(assoc.stagingStartDate) < eoq && new Date(assoc.stagingEndDate) > soq;
      });
    } else if (timePeriod == this.timePeriodOpts.yr) {
      return associates.filter((assoc) => {
        return new Date(assoc.stagingStartDate) < eoy && new Date(assoc.stagingEndDate) > soy;
      });
    }
    return associates;
  }

}
