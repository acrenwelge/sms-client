import * as bootstrap from "bootstrap";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

/** Imported for Angular Material usage */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './components/login/login.component';
import { MgrOverviewComponent } from './components/mgr-overview/mgr-overview.component';
import { MgrAssociateViewComponent } from './components/mgr-associate-view/mgr-associate-view.component';

import { AssociateService } from './services/associate.service';
import { AssociateRouteActivator } from './services/associate-route-activator.service';
import { BatchService } from './services/batch.service';
import { ClientService } from './services/client.service';
import { TrainerService } from './services/trainer.service';

import { NavbarComponent } from './components/navbar/navbar.component';
import { AttendanceReportComponent } from './components/attendance-report/attendance-report.component';
import { StatusReportComponent } from './components/status-report/status-report.component';
import { EditFormComponent } from './components/edit-form/edit-form.component';
import { ModalComponent } from './components/modal/modal.component';
import { FooterComponent } from './components/footer/footer.component';
import { MgrManageAssociatesComponent } from './components/mgr-manage-associates/mgr-manage-associates.component';
import { AddFormComponent } from './components/add-form/add-form.component';
import { RemoveAlertComponent } from './components/remove-alert/remove-alert.component';
import { Error404Component } from './components/error404/error404.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MgrOverviewComponent,
    MgrAssociateViewComponent,
    NavbarComponent,
    AttendanceReportComponent,
    StatusReportComponent,
    EditFormComponent,
    ModalComponent,
    FooterComponent,
    MgrManageAssociatesComponent,
    AddFormComponent,
    RemoveAlertComponent,
    Error404Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule
  ],
  entryComponents: [
  ],
  providers: [
    AssociateService,
    AssociateRouteActivator,
    BatchService,
    TrainerService,
    ClientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
