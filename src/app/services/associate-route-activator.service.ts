import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, Resolve } from '@angular/router';
import { AssociateService } from './associate.service';
import 'rxjs/add/operator/map';

@Injectable()
export class AssociateRouteActivator implements CanActivate, Resolve<any> {

  constructor(
    private associateService: AssociateService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot) {
    console.log('activating route...');
    // const associateExists = !!this.associateService.getAssociate(+route.paramMap.get('id')).subscribe();
    const associateExists = +route.paramMap.get('id') < 99;
    if (!associateExists)
      this.router.navigate(['/404']);
    return associateExists;
  }

  resolve(route: ActivatedRouteSnapshot) {
    console.log("pre-fetching associate...");
    return this.associateService.getAssociate(+route.paramMap.get('id')).map(associate => associate);
  }

}
