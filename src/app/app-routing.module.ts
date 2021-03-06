import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MgrOverviewComponent } from './components/mgr-overview/mgr-overview.component';
import { MgrAssociateViewComponent } from './components/mgr-associate-view/mgr-associate-view.component';
import { AttendanceReportComponent } from './components/attendance-report/attendance-report.component';
import { StatusReportComponent } from './components/status-report/status-report.component';
import { MgrManageAssociatesComponent } from './components/mgr-manage-associates/mgr-manage-associates.component';
import { Error404Component } from './components/error404/error404.component';
import { AssociateRouteActivator } from './services/associate-route-activator.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'overview', component: MgrOverviewComponent },
  { path: 'manage', component: MgrManageAssociatesComponent },
  { path: 'associates/:id', component: MgrAssociateViewComponent, 
  canActivate: [AssociateRouteActivator],
  resolve: {associate: AssociateRouteActivator}
  },
  { path: 'reports/attendance', component: AttendanceReportComponent },
  { path: 'reports/status', component: StatusReportComponent },
  { path: '404', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
