import { Injectable } from '@angular/core';
import { Associate } from '../models/associate';
import { DateService } from './date.service';

@Injectable()
export class AssociateFilterService {

  constructor(private ds: DateService) { }

  /** Filters associates based on the time period being inspected - today, this week, this month, this quarter, or this year.
   *   - today: start date was before today AND end date is after today
   *   - this week: start date was before last day of the week OR end date is after first day of the week
   *   - this month: start date was before last day of the month OR end date is after first day of the month
   *   - this month: start date was before last day of the quarter OR end date is after first day of the quarter
   *   - this year: start date was before last day of the year OR end date is after first day of the year
   */
  filterAssociates(associates: Associate[],timePeriod: string): Associate[] {
    const now = new Date();
    let monday = this.ds.getMonday(now);
    let friday = this.ds.getFriday(now);
    let som = this.ds.getMonthStart(now); // set to start of month
    let eom = this.ds.getMonthEnd(now); // set to end of month
    let soq = this.ds.getMonthStart(now); // set to start of month
    let eoq = this.ds.getMonthEnd(now); // set to end of month
    let soy = new Date(now.getFullYear(),0,1); // set to Jan 1 - start of year
    let eoy = new Date(now.getFullYear(),11,31); // set to Dec 31 - end of year
    if (timePeriod == this.ds.timePeriodOpts.today) {
      return associates.filter((assoc) => {
        return new Date(assoc.stagingStartDate) < now && new Date(assoc.stagingEndDate) > now;
      });
    } else if (timePeriod == this.ds.timePeriodOpts.week) {
      return associates.filter((assoc) => {
        return new Date(assoc.stagingStartDate) < friday && new Date(assoc.stagingEndDate) > monday;
      });
    } else if (timePeriod == this.ds.timePeriodOpts.month) {
      return associates.filter((assoc) => {
        return new Date(assoc.stagingStartDate) < eom && new Date(assoc.stagingEndDate) > som;
      });
    } else if (timePeriod == this.ds.timePeriodOpts.qtr) {
      return associates.filter((assoc) => {
        return new Date(assoc.stagingStartDate) < eoq && new Date(assoc.stagingEndDate) > soq;
      });
    } else if (timePeriod == this.ds.timePeriodOpts.yr) {
      return associates.filter((assoc) => {
        return new Date(assoc.stagingStartDate) < eoy && new Date(assoc.stagingEndDate) > soy;
      });
    }
    return associates;
  }

}
