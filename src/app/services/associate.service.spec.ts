import { TestBed, inject } from '@angular/core/testing';
import { Associate } from '../models/associate';
import { AssociateService } from './associate.service';

let service: AssociateService;

describe('AssociateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssociateService]
    });
    service = TestBed.get(AssociateService);
  });

  it('should be created', inject([AssociateService], (service: AssociateService) => {
    expect(service).toBeTruthy();
  }));

  it('should return associates in staging', inject([AssociateService], (service: AssociateService) => {
    service.getAssociatesInStaging().subscribe(associates => {
      expect(associates).toBeTruthy();
    });
  }));

  it('should return associates by id', inject([AssociateService], (service: AssociateService) => {
    const idsToTest = [1, 2, 5, 10];
    for (let i = 0; i < idsToTest.length; i++) {
      const id = idsToTest[i];
      service.getAssociate(id).subscribe(associate => {
        // check that an associate is returned and has the correct id
        expect(associate).toBeTruthy();
        expect(associate.id).toEqual(id);
      });
    }
  }));

  xit('should update an associate', inject([AssociateService], (service: AssociateService) => {
    const id = 1;
    const now = new Date(); const dateString = `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()}`;
    service.getAssociate(id).subscribe(associate => {
      const updatedAssociate: Associate = {
        selected: !associate.selected,
        id: id,
        firstName: 'testingFirstName',
        lastName: 'testingLastName',
        attendance: {dateString: !associate.attendance[dateString]},
        batch: {
          id: 1,
          trainerName: 'testTrainerName',
          name: 'testBatchName',
          location: 'testLocation',
          skill: 'testSkill',
          startDate: new Date('1-1-20'),
          endDate: new Date('1-1-20')
        },
        marketingStartDate: new Date('1-1-20'),
        stagingStartDate: new Date('1-1-20'),
        confirmationDate: new Date('1-1-20'),
        projectStartDate: new Date('1-1-20'),
        stagingEndDate: new Date('1-1-20'),
        numberInterviews: 6,
        repanelCount: 6,
        clientName: 'testClientName'
      };
      service.updateAssociate(updatedAssociate).subscribe(newAssociate => {
        expect(newAssociate).toBeTruthy();
        expect(newAssociate.selected).not.toEqual(associate.selected);
        expect(newAssociate.id).toEqual(updatedAssociate.id);
        expect(newAssociate.firstName).toEqual(updatedAssociate.firstName);
        expect(newAssociate.lastName).toEqual(updatedAssociate.lastName);
        expect(newAssociate.attendance[dateString]).not.toEqual(associate.attendance[dateString]);
        expect(newAssociate.batch.trainerName).toEqual(updatedAssociate.batch.trainerName);
        expect(newAssociate.batch.name).toEqual(updatedAssociate.batch.name);
        expect(newAssociate.batch.location).toEqual(updatedAssociate.batch.location);
        expect(newAssociate.batch.skill).toEqual(updatedAssociate.batch.skill);
        expect(newAssociate.marketingStartDate).toEqual(updatedAssociate.marketingStartDate);
        expect(newAssociate.numberInterviews).toEqual(updatedAssociate.numberInterviews);
        expect(newAssociate.repanelCount).toEqual(updatedAssociate.repanelCount);
        expect(newAssociate.clientName).toEqual(updatedAssociate.clientName);
      });
    });
  }));
});
