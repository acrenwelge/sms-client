import { Injectable } from '@angular/core';
import { Stats } from '../models/stats';
import { Associate } from '../models/associate';
import { DateService } from './date.service';

@Injectable()
export class StatsService {
  stats: Stats = new Stats();

  constructor(private ds: DateService) {
  }

  /**
   * add in the individual associate attendance for the given time period.
   * @param assoc
   * @param timePeriod
   */
  private addSingleAssocAttendance(assoc: Associate, timePeriod: string) {
    let startOfPeriod, endOfPeriod;
    // assign start / end dates
    if (timePeriod == this.ds.timePeriodOpts.today) { // calc today's attendance
      if (assoc.attendance[this.ds.getTodayDateString()]) this.stats.totalPresent++;
      else this.stats.totalAbsent++;
    } else if (timePeriod == this.ds.timePeriodOpts.week) {
      startOfPeriod = this.ds.dates.monday;
      endOfPeriod = this.ds.dates.friday;
    } else if (timePeriod == this.ds.timePeriodOpts.month) {
      startOfPeriod = this.ds.dates.som;
      endOfPeriod = this.ds.dates.eom;
    } else if (timePeriod == this.ds.timePeriodOpts.qtr) {
      startOfPeriod = this.ds.dates.soq;
      endOfPeriod = this.ds.dates.eoq;
    } else if (timePeriod == this.ds.timePeriodOpts.yr) {
      startOfPeriod = this.ds.dates.soy;
      endOfPeriod = this.ds.dates.eoy;
    }
    if (timePeriod != this.ds.timePeriodOpts.today) { // skip if today - already calculated above
      for (let dateStr in assoc.attendance) {
        let date = new Date(dateStr);
        if (date < endOfPeriod && date > startOfPeriod) { // filter by dates that are within the time period
          if (assoc.attendance[dateStr]) this.stats.totalPresent++;
          else this.stats.totalAbsent++;
        }
      }
    }
  }

  /**
   * Returns the statistics object calculated for the given associates over given time period
   * @param associates
   * @param timePeriod
   */
  calcStatistics(associates: Associate[], timePeriod: string): Stats {
    let start = Date.now();
    // reset stats totals
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
      // calculate total attendance for the given time period
      this.addSingleAssocAttendance(assoc, timePeriod);
      // calculate other totals
      if (assoc.confirmationDate) {this.stats.totalConfirmed++;}
      totDaysInStaging += this.ds.getDayDiff(assoc.stagingStartDate, assoc.stagingEndDate);
      totDaysMkToConf += this.ds.getDayDiff(assoc.marketingStartDate, assoc.confirmationDate);
      totDaysMkToProjStart += this.ds.getDayDiff(assoc.marketingStartDate, assoc.projectStartDate);;
      totInts += assoc.numberInterviews;
      totRepanels += assoc.repanelCount;
    }
    // calculate averages
    this.stats.avgDaysInStaging = +(totDaysInStaging / totAssociates).toFixed(2);
    this.stats.avgDaysMkToConf = +(totDaysMkToConf / totAssociates).toFixed(2);
    this.stats.avgDaysMkToProjStart = +(totDaysMkToProjStart / totAssociates).toFixed(2);
    this.stats.avgInterviews = +(totInts / totAssociates).toFixed(2);
    this.stats.avgRepanels = +(totRepanels / totAssociates).toFixed(2);
    const now = Date.now();
    this.stats.history = this.calcAttendanceHistory(associates,timePeriod);
    console.log(`Time to calculate attendance history: ${Date.now() - now} ms`);
    console.log(this.stats.history);
    console.log(`Time to get stats: ${Date.now() - start} ms`);
    return this.stats;
  }

  /**
   * Computes the attendance history for the given associates for the specified time period:
   *  - today: no history
   *  - this week: daily attendance over the past week (skip Saturday/Sunday)
   *  - this month: weekly attendance over the past month (last 4 weeks)
   *  - this quarter: weekly attendance for the current quarter
   *  - this year: monthly attendance over the past year (last 12 months)
   * @param associates
   * @param timePeriod
   */
  private calcAttendanceHistory(associates: Associate[], timePeriod: string): {data: number[], labels: string[]} {
    let history: {data: number[], labels: string[]} = {
      data: [],
      labels: []
    };
    let today = this.ds.dates.today;
    if (timePeriod == this.ds.timePeriodOpts.today) {} // no history
    else if (timePeriod == this.ds.timePeriodOpts.week) {
      let weekAgo = this.ds.addDays(today,-6);
      for (let i=0;i <= this.ds.getDayDiff(weekAgo, today); i++) {
        let date = this.ds.addDays(weekAgo, i);
        if (date.getDay() == 0 || date.getDay() == 6) continue; // skip Sundays and Saturdays
        let str = this.ds.getDateString(date);
        let absent = 0, present = 0;
        for (let assoc of associates) {
          if (assoc.attendance[str]) present++;
          else absent++;
        }
        history.data.push(Number((present * 100 / ( present + absent )).toFixed(2)));
        history.labels.push(this.ds.getDayOfWeekStr(date));
      }
    }
    else if (timePeriod == this.ds.timePeriodOpts.month) {
      let start = this.ds.goBackFourWeeks(this.ds.dates.monday); // start 4 weeks back from this monday
      for (let j=0;j < 4; j++) { // iterate over weeks
        let weekStart = this.ds.addDays(start,j*7); // get each week's monday
        let weekEnd = this.ds.getFriday(weekStart); // each week's friday
        // initialize weekly numbers
        let weekTotAbsent = 0, weekTotPresent = 0;
        for (let i=0;i <= this.ds.getDayDiff(weekStart, weekEnd); i++) { // iterate over days
          let date = this.ds.addDays(weekStart, i);
          // if (date.getDay() == 0 || date.getDay() == 6) continue; // skip Sundays and Saturdays - not needed
          let str = this.ds.getDateString(date);
          for (let assoc of associates) {
            if (assoc.attendance[str]) weekTotPresent++;
            else weekTotAbsent++;
          }
        }
        history.data.push(Number((weekTotPresent * 100 / ( weekTotPresent + weekTotAbsent )).toFixed(2)));
        history.labels.push(`${weekStart.getMonth()+1}/${weekStart.getDate()} - ${weekEnd.getMonth()+1}/${weekEnd.getDate()}`);
      }
    }
    else if (timePeriod == this.ds.timePeriodOpts.qtr) {
      let start = this.ds.getQuarterStart(today); // start at beginning of current quarter
      const numDays = this.ds.getDayDiff(start,today);
      let weekTotAbsent = 0, weekTotPresent = 0; // initialize weekly numbers
      for (let j=0;j <= numDays; j++) { // iterate over all days
        let date = this.ds.addDays(start, j);
        if (date.getDay() == 0 || date.getDay() == 6) continue;
        let str = this.ds.getDateString(date);
        for (let assoc of associates) {
          if (assoc.attendance[str]) weekTotPresent++;
          else weekTotAbsent++;
        }
        if (date.getDay() == 5 || j == numDays) { // reset totals and push week stats when we get to Fridays or end of loop
          const percentAttend = Number((weekTotPresent * 100 / ( weekTotPresent + weekTotAbsent )).toFixed(2));
          weekTotAbsent = weekTotPresent = 0;
          const weekStart = this.ds.getMonday(date);
          const weekEnd = this.ds.getFriday(date);
          history.data.push(percentAttend);
          history.labels.push(`${weekStart.getMonth()+1}/${weekStart.getDate()} - ${weekEnd.getMonth()+1}/${weekEnd.getDate()}`);
        }
      }
    }
    else if (timePeriod == this.ds.timePeriodOpts.yr) {
      let start = this.ds.dates.soy; // start at beginning of current year
      const numDays = this.ds.getDayDiff(start,today);
      let monthTotAbsent = 0, monthTotPresent = 0; // initialize weekly numbers
      for (let j=0;j <= numDays; j++) { // iterate over all days
        let date = this.ds.addDays(start, j);
        if (date.getDay() == 0 || date.getDay() == 6) continue;
        let str = this.ds.getDateString(date);
        for (let assoc of associates) {
          if (assoc.attendance[str]) monthTotPresent++;
          else monthTotAbsent++;
        }
        if (this.ds.isLastDayOfMonth(date) || j == numDays) { // reset totals and push week stats when we get to Fridays or end of loop
          const percentAttend = Number((monthTotPresent * 100 / ( monthTotPresent + monthTotAbsent )).toFixed(2));
          monthTotAbsent = monthTotPresent = 0;
          history.data.push(percentAttend);
          history.labels.push(`${this.ds.getMonthString(date)}`);
        }
      }
    }
    history.data.reverse();
    history.labels.reverse();
    return history;
  }

}
