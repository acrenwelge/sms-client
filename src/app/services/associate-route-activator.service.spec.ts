import { TestBed, inject } from '@angular/core/testing';

import { AssociateRouteActivator } from './associate-route-activator.service';

describe('AssociateRouteActivator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssociateRouteActivator]
    });
  });

  it('should be created', inject([AssociateRouteActivator], (service: AssociateRouteActivator) => {
    expect(service).toBeTruthy();
  }));
});
