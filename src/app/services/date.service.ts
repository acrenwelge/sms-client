import { Injectable } from '@angular/core';

@Injectable()
export class DateService {
  /**
   * Returns options for filtering by time period
   */
  get timePeriodOpts(): {today: string, week: string, month: string, qtr: string, yr: string} {
    return {
      today: 'Today',
      week: 'This week',
      month: 'This month',
      qtr: 'This quarter',
      yr: 'This year'
    }
  };

  get dates(): {[s: string]: Date} {
    let now = new Date();
    return {
      today: new Date(now.getFullYear(),now.getMonth(),now.getDate()),
      monday: this.getMonday(now),
      friday: this.getFriday(now),
      som: this.getMonthStart(now),
      eom: this.getMonthEnd(now),
      soq: this.getQuarterStart(now),
      eoq: this.getQuarterEnd(now),
      soy: new Date(now.getFullYear(),0,1),
      eoy: new Date(now.getFullYear(),11,31)
    }
  }

  constructor() { }

  getDayOfWeekStr(d: Date): string {
    switch (d.getDay()) {
      case 0: return 'Sunday';
      case 1: return 'Monday';
      case 2: return 'Tuesday';
      case 3: return 'Wednesday';
      case 4: return 'Thursday';
      case 5: return 'Friday';
      case 6: return 'Saturday';
    }
  }

  /**
   * Takes a date and returns the string representation in the format: MM/DD/YYYY
   * @param date 
   */
  getDateString(date: Date): string {
    return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
  }

  /**
   * Get the current date as a string: MM/DD/YYYY
   */
  getTodayDateString(): string {
    return this.getDateString(new Date());
  }

  /**
   * Returns the number of days in the specified month
   * @param month the month index - 1-indexed (January is 1, February is 2, etc)
   * @param year format: YYYY. needed for leap year cases
   */
  daysInMonth (month: number, year: number) {
    return new Date(year, month, 0).getDate();
  }

  /**
   * Returns a date object for the date 4 weeks (28 days) before the input date
   * @param date 
   */
  goBackFourWeeks(date: Date): Date {
    return this.addDays(date,-28);
  }

  /**
   * Returns the difference in days between two dates (any order)
   * @param first the first date
   * @param second the second date
   */
  getDayDiff(first: Date, second: Date): number {
    let start: Date = new Date(first);
    let end: Date = new Date(second) || new Date();
    let timeDiff = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  /**
   * Takes a date and returns a new date with the specified number of days added
   * @param date initial date
   * @param days number of days to add
   */
  addDays(date: Date, days: number): Date {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Returns the date object representing the Monday of a given week. If a Sunday is passed, will return the previous Monday 
   * @param d the date object for any day in the week
   */
  getMonday(d: Date) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  /**
   * Returns the date object representing the Friday of a given week.
   * @param d the date object for any day in the week
   */
  getFriday(d: Date) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() + (5 - day);
    return new Date(d.setDate(diff));
  }

  /**
   * Returns the date object representing the first day of the month
   * @param d the date object for any day in the month
   */
  getMonthStart(d: Date) {
    d = new Date(d);
    return new Date(d.setDate(1));
  }

  /**
   * Returns the date object representing the last day of the month
   * @param d the date object for any day in the month
   */
  getMonthEnd(d: Date) {
    d = new Date(d);
    return new Date(d.getFullYear(),d.getMonth()+1,0);
  }

  /**
   * Returns the date object representing the first day of the quarter of the calendar year
   * @param d the date object for any day in the quarter
   */
  getQuarterStart(d: Date) {
    d = new Date(d);
    if (d.getMonth() < 3) {
      return new Date(d.getFullYear(),0,1); // Q1 - Jan1
    } else if (d.getMonth() < 6) {
      return new Date(d.getFullYear(),3,1); // Q2 - Apr1
    } else if (d.getMonth() < 9) {
      return new Date(d.getFullYear(),6,1); // Q3 - Jul1
    } else {
      return new Date(d.getFullYear(),9,1); // Q4 - Oct1
    }
  }

  /**
   * Returns the date object representing the last day of the quarter of the calendar year
   * @param d the date object for any day in the quarter
   */
  getQuarterEnd(d: Date) {
    d = new Date(d);
    if (d.getMonth() < 3) {
      return new Date(d.getFullYear(),2,31); // Q1 - Mar31
    } else if (d.getMonth() < 6) {
      return new Date(d.getFullYear(),5,30); // Q2 - Jun30
    } else if (d.getMonth() < 9) {
      return new Date(d.getFullYear(),8,30); // Q3 - Sept30
    } else {
      return new Date(d.getFullYear(),11,31); // Q4 - Dec31
    }
  }

}
