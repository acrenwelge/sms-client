import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatTable } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Associate } from '../../models/associate';

@Component({
  selector: 'app-associate-table',
  templateUrl: './associate-table.component.html',
  styleUrls: ['./associate-table.component.scss']
})
export class AssociateTableComponent implements OnInit {
  todayDateString: string;
  @Input() associates: Associate[];
  @Input() displayedColNames;

  selection = new SelectionModel<Associate>(true, []);
  allColNames = ['select','id', 'name', 'attendance', 'batchName',
  'startMarketing', 'startStaging', 'confirmation', 'projectStart', 'stagingEnd',
  'interviews', 'repanels', 'client'];

  dataSource: MatTableDataSource<Associate>;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor() { }
  ngOnInit() {
    const now = new Date();
    this.todayDateString = `${now.getMonth()+1}/${now.getDate()}/${now.getFullYear()}`;
    this.dataSource = new MatTableDataSource(this.associates);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterInStaging(assocs: Associate[], inStaging: boolean) {
    if (!assocs) return;
    if (inStaging) {
      // filtering to get all associates currently in staging
      return assocs.filter((associate, index) => {
        return (!!associate.stagingStartDate && !associate.stagingEndDate); 
        // return only associates WITH a staging start date but WITHOUT a staging end date
      });
    } else {
      // filtering to get all associates NOT currently in staging
      return assocs.filter((associate, index) => {
        return (!associate.stagingStartDate || !!associate.stagingEndDate);
        // return only associates WITHOUT a staging start date OR WITH a staging end date
      });
    }
  }

}
