import { TestBed, inject } from '@angular/core/testing';

import { DateService } from './date.service';

describe('DateService', () => {
  let service: DateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateService]
    });
    service = TestBed.get(DateService);
  });

  it('should be created', inject([DateService], (service: DateService) => {
    expect(service).toBeTruthy();
  }));

  describe('getMonday function', () => {
    it('should return 06/25/2018 when given the date 6/29/2018', () => {
      let mon = service.getMonday(new Date("6/29/18"));
      expect(mon).toEqual(new Date("6/25/2018"));
    });
  });

  describe('getFriday function', () => {
    it('should return 06/29/2018 when given the date 6/25/2018', () => {
      let fri = service.getFriday(new Date("6/25/18"));
      expect(fri).toEqual(new Date("6/29/2018"));
    });
  });

  describe('getMonthStart function', () => {
    it('should return 06/01/2018 when given the date 6/15/2018', () => {
      let som = service.getMonthStart(new Date("6/25/18"));
      expect(som).toEqual(new Date("6/01/2018"));
    });
  });

  describe('getMonthEnd function', () => {
    it('should return 06/30/2018 when given the date 6/15/2018', () => {
      let eom = service.getMonthEnd(new Date("6/15/18"));
      expect(eom).toEqual(new Date("6/30/2018"));
    });
  });
});
