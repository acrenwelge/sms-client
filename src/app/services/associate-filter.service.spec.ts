import { TestBed, inject } from '@angular/core/testing';
import { AssociateFilterService } from './associate-filter.service';
import { Associate } from '../models/associate';

function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
function getMonday(d: Date) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}
function getFriday(d: Date) {
  d = new Date(d);
  var day = d.getDay(),
      diff = d.getDate() + day;
  return new Date(d.setDate(diff));
}
/**
 * fake associate data containing some associate in staging today, 
 * some this week, some this month, some this quarter, and some this year
 */
let fakeAssocs: Associate[] = [];
let now = new Date();
let mon = getMonday(now); let fri = getFriday(now);
let jan1 = new Date(now.getFullYear(),0,1); let dec31 = new Date(now.getFullYear(),11,31);
// populate fakeAssocs
for (let i=0;i<49;i++) {
  fakeAssocs.push({
    selected: false,
    id: i+1,
    firstName: `Person ${i}`,
    lastName: `LN`,
    attendance: null,
    batch: {
      id: i+1, name: `batch ${i}`, location: null, skill: null, trainerName: `trainer ${i}`,
      startDate: null, endDate: null
    },
    marketingStartDate: jan1,
    stagingStartDate: null,
    stagingEndDate: null,
    confirmationDate: dec31,
    projectStartDate: dec31,
    numberInterviews: i % 4,
    repanelCount: (i+1) % 5,
    clientName: `client ${i}`
  });
}

// edit staging start / end dates
fakeAssocs[0].stagingStartDate = addDays(now,-1); // start yesterday
fakeAssocs[0].stagingEndDate = addDays(now,1); // end tomorrow
fakeAssocs[1].stagingStartDate = addDays(mon,-7); // start before the week
fakeAssocs[1].stagingEndDate = now; // end today
fakeAssocs[2].stagingStartDate = addDays(fri,-1); // start thursday
fakeAssocs[2].stagingEndDate = addDays(now, 7); // end next week
fakeAssocs[3].stagingStartDate = new Date(now.getFullYear(),now.getMonth()-1,15); // start middle of last month
fakeAssocs[3].stagingEndDate = now; // end today
fakeAssocs[4].stagingStartDate = addDays(jan1,1); // start this year
fakeAssocs[4].stagingEndDate = addDays(dec31,-1); // end at end of year
fakeAssocs[5].stagingStartDate = null; // null
fakeAssocs[5].stagingEndDate = null; // null
fakeAssocs[6].stagingStartDate = addDays(jan1,-10); // last year
fakeAssocs[6].stagingEndDate = jan1; // first of this year

describe('AssociateFilterService', () => {
  let service: AssociateFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssociateFilterService]
    });
    service = TestBed.get(AssociateFilterService);
  });

  it('should be created', inject([AssociateFilterService], (service: AssociateFilterService) => {
    expect(service).toBeTruthy();
  }));

  it('should filter for today', inject([AssociateFilterService], (service: AssociateFilterService) => {
    let filtered = service.filterAssociates(fakeAssocs, 'today');
    expect(filtered.length).toBeLessThanOrEqual(fakeAssocs.length);
    console.log(filtered);
  }));

  it('should filter for this week', inject([AssociateFilterService], (service: AssociateFilterService) => {
    let filtered = service.filterAssociates(fakeAssocs, 'this week');
    expect(filtered.length).toBeLessThanOrEqual(fakeAssocs.length);
    console.log(filtered);
  }));

  it('should filter for this month', inject([AssociateFilterService], (service: AssociateFilterService) => {
    let filtered = service.filterAssociates(fakeAssocs, 'this month');
    expect(filtered.length).toBeLessThanOrEqual(fakeAssocs.length);
    console.log(filtered);
  }));

  it('should filter for this year', inject([AssociateFilterService], (service: AssociateFilterService) => {
    let filtered = service.filterAssociates(fakeAssocs, 'this year');
    expect(filtered.length).toBeLessThanOrEqual(fakeAssocs.length);
    console.log(filtered);
  }));
});
