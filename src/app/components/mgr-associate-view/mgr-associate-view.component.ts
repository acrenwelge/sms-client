import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { AssociateService } from '../../services/associate.service';
import { Associate } from '../../models/associate';

@Component({
  selector: 'app-mgr-associate-view',
  templateUrl: './mgr-associate-view.component.html',
  styleUrls: ['./mgr-associate-view.component.css'],
})
export class MgrAssociateViewComponent implements OnInit {
  public todayDateString: string;
  public associate: Associate = new Associate();
  public progressValue: number;
  public progressText: string;
  public editingMode = false;

  // new associate properties
  public newAttendance: boolean;
  public newMarketingStartDate: Date = new Date('2018-01-26');
  public newStagingStartDate: Date = new Date('2018-01-26');
  public newStagingEndDate: Date = new Date('2018-01-26');
  public newConfirmationDate: Date = new Date('2018-01-26');
  public newProjectStartDate: Date = new Date('2018-01-26');
  public newClientName: string;
  public newNumberInterviews: number;
  public newRepanelCount: number;

  constructor(
    private route: ActivatedRoute,
    private associateService: AssociateService,
    private location: Location
  ) {}

  ngOnInit() {
    const now = new Date();
    this.todayDateString = `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()}`;
    this.associate = this.route.snapshot.data['associate'];
    this.progressValue = 50;
    this.progressText = "in staging...";
  }

  /**
   * Calculate the progress of an associate:
   * - training (no marketing start date)
   * - marketing (has marketing start date)
   * - staging (has staging start date)
   * - confirmed (has confirmation date)
   * - left staging (staging end date is past)
   * - on client project (client project start date is past)
   * */
  calcProgress() {
    let now = new Date();
    let msd = this.associate.marketingStartDate;
    let ssd = this.associate.stagingStartDate;
    let sed = this.associate.stagingEndDate;
    let cd = this.associate.confirmationDate;
    let psd = this.associate.projectStartDate;
    if (!msd) { // no marketing start date
      this.progressValue = 0;
      this.progressText = 'still in training';
    } else if (!!msd && !ssd) { // has marketing start date but no staging start date
      this.progressValue = 100 / 6 * 1;
      this.progressText = 'started marketing';
    } else if (!!ssd && !sed) { // has staging start date but no staging end date
      this.progressValue = 100 / 6 * 2;
      this.progressText = 'in staging';
    } else if (!!sed && !cd) { // has staging end date but no confirmation date
      this.progressValue = 100 / 6 * 3;
      this.progressText = 'in staging';
    } else if (!!cd && !psd) { // has confirmation date but no project start date
      this.progressValue = 100 / 6 * 4;
      this.progressText = 'confirmed by client';
      if (sed && now > sed) { // has staging end date and it has passed
        this.progressValue = 100 / 6 * 5;
        this.progressText += ' and left staging';
      }
    } else if (!!psd) { // has project start date
      if (now > psd) { // start date passed
        this.progressValue = 100;
        this.progressText = "on client project";
      } else if (now > sed) { // staging end date is passed
        this.progressValue = 100 / 6 * 5;
        this.progressText = "has client project start date and left staging";
      }
    }
  }

  toggleEditMode() {
    this.editingMode = !this.editingMode;
  }

  saveChanges() {
    console.log('saving changes...');
    this.saveNewVariables();
    console.log(`New date: ${this.newMarketingStartDate}`);
    console.log(`New date: ${this.associate.marketingStartDate}`);
    this.editingMode = false;
    this.associateService.updateAssociate(this.associate);
  }

  cancelChanges() {
    this.resetNewVariables();
    this.editingMode = false;
  }

  saveNewVariables() {
    let now = new Date(); let dateString = `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()}`;
    this.associate.attendance[dateString] = this.newAttendance;
    this.associate.marketingStartDate = this.newMarketingStartDate;
    this.associate.stagingStartDate = this.newStagingStartDate;
    this.associate.stagingEndDate = this.newStagingEndDate;
    this.associate.confirmationDate = this.newConfirmationDate;
    this.associate.projectStartDate = this.newProjectStartDate;
    this.associate.clientName = this.newClientName;
    this.associate.numberInterviews = this.newNumberInterviews;
    this.associate.repanelCount = this.newRepanelCount;
  }

  resetNewVariables() {
    let now = new Date(); let dateString = `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()}`;
    this.newAttendance[dateString] = this.associate.attendance;
    this.newMarketingStartDate = this.associate.marketingStartDate;
    this.newStagingStartDate = this.associate.stagingStartDate;
    this.newStagingEndDate = this.associate.stagingEndDate;
    this.newConfirmationDate = this.associate.confirmationDate;
    this.newProjectStartDate = this.associate.projectStartDate;
    this.newClientName = this.associate.clientName;
    this.newNumberInterviews = this.associate.numberInterviews;
    this.newRepanelCount = this.associate.repanelCount;
  }

}
